import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient, type User } from "@clerk/nextjs/server";
import type { Post, Prisma, PrismaClient, Comment, Like, Dislike, Tag } from "@prisma/client";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { getUrlMetadata } from "~/server/helpers/urlMetadata";
import { createFindManyPostQuery } from "~/server/helpers/postQuery";
import { ratelimit } from "~/server/helpers/ratelimit";

const getMappedComments = async (comments: Comment[]) => {
  const userId = comments.map((comment) => comment.authorId);
  const users = (await clerkClient.users.getUserList({
    userId: userId, limit: 100,
  })).map(filterUserForClient)
  return comments.map((comment) => {
    let author = users.find((user) => user.id === comment.authorId)

    if (!author) author = { username: '[deleted]', id: '', profileImageUrl: '' }
    return {
      ...comment,
      author: { ...author, username: author.username }, // need to spread the author object and add the username object to ensure type checking
    }
  })

}

interface PostPayload extends Post {
  comments?: Comment[],
  likes?: Like[],
  dislikes?: Dislike[],
  tags?: Tag[]
}

const getMappedPosts = async (posts: PostPayload[], ctx: {
  userId: string | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}) => {
  return await Promise.all(posts.map(async (post) => {
    const { likes, comments, authorId, dislikes, tags } = post
    const subEcho = await ctx.prisma.subEcho.findUnique({ where: { id: post.echoId } });
    // const likes = await ctx.prisma.like.findMany({ where: { postId: post.id } }) || []
    // const comments = await ctx.prisma.comment.findMany({ where: { postId: post.id }, orderBy: { createdAt: 'desc' } }) || []
    const userId = authorId;
    const user = userId ? await clerkClient.users.getUser(userId).then(filterUserForClient).catch() : { username: '[deleted]', id: '', profileImageUrl: '' };


    // const mappedComments = comments ? await getMappedComments(comments) : []
    const mappedComments = await getMappedComments(comments || [])
    const metadata = await getUrlMetadata(post.url)

    // if (!user)
    //   user = {username: '[deleted]', id: '', profileImageUrl: ''}

    return {
      ...post,
      echoName: subEcho?.title,
      likes: likes || [],
      dislikes: dislikes || [],
      comments: mappedComments,
      user,
      tags: tags || [],
      metadata,
    };
  }));
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.input(z.object({ sortKey: z.string().min(1).optional() })).query(async ({ ctx, input }) => {
    const postQuery = createFindManyPostQuery({ ...input })

    const posts = await ctx.prisma.post.findMany({ ...postQuery });
    if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
    const mappedPosts = getMappedPosts(posts, ctx)
    return mappedPosts
  }),
  getPostsByEchoId: publicProcedure
    .input(z.object({ echoId: z.string().min(1), sortKey: z.string().min(1).optional() }))
    .query(async ({ ctx, input }) => {
      const postQuery = createFindManyPostQuery({ ...input })

      const subPosts = await ctx.prisma.post.findMany({
        where: { echoId: input.echoId }, take: 100, ...postQuery
      })

      if (!subPosts) throw new TRPCError({ code: "NOT_FOUND" });
      const mappedPosts = getMappedPosts(subPosts, ctx)
      return mappedPosts
    }),
  getPostById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const postQuery: Prisma.PostFindUniqueArgs = {
        where: {
          id: input.id
        },
        include: {
          likes: true,
          comments: true,
          dislikes: true,
          tags: true
        },
      };
      const subPosts = await ctx.prisma.post.findUnique(postQuery)
      if (!subPosts) throw new TRPCError({ code: "NOT_FOUND" });
      const mappedPosts = getMappedPosts([subPosts], ctx)
      return mappedPosts
    }),
  create: privateProcedure.input(z.object({
    title: z.string().min(1).max(100),
    url: z.string().min(0).url("Enter a URL").max(255).or(z.literal('')),
    echo: z.string().min(1).max(50),
    description: z.string().max(5000).optional(),
    tags: z.string().array().max(6)
  }
  )).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId
    const { success } = await ratelimit.limit(userId)
    if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
    const { title, url = '', echo, description = '', tags = [] } = input
    const subEcho = await ctx.prisma.subEcho.findUnique({ where: { title: echo } });
    if (!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
    const post = await ctx.prisma.post.create({ data: { title, url, echoId: subEcho.id, description, authorId: userId } })
    await Promise.all(tags.map(async (tag) => {
      await ctx.prisma.tag.create({data: {text: tag, postId: post.id, userId}})
    }))
    return { ...post, echoName: input.echo }

  }),
  deletePost: privateProcedure.input(z.object({ id: z.string().min(1).max(255) })).mutation(async ({ ctx, input }) => {

    const userId = ctx.userId
    const post = await ctx.prisma.post.findUnique({ where: { id: input.id } })
    if (post?.authorId !== userId) throw new TRPCError({ code: "FORBIDDEN" })
    // await ctx.prisma.post.delete({where: {id: input.id}})
    await ctx.prisma.post.update({ where: { id: input.id }, data: { authorId: '' } })
    return true
  }),
  addComment: privateProcedure.input(z.object({
    content: z.string().min(1).max(500),
    postId: z.string().min(1),
    parentCommentId: z.string().min(1).optional(),
  })).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId
    const { content, postId, parentCommentId } = input
    const comment = await ctx.prisma.comment.create({ data: { content, authorId: userId, postId, parentCommentId } })
    return comment

  }),
  deleteComment: privateProcedure.input(z.object({ id: z.string().min(1).max(255) })).mutation(async ({ ctx, input }) => {

    const userId = ctx.userId
    const comment = await ctx.prisma.comment.findUnique({ where: { id: input.id } })
    if (comment?.authorId !== userId) throw new TRPCError({ code: "FORBIDDEN" })
    await ctx.prisma.comment.update({ where: { id: input.id }, data: { authorId: '' } })
    return true
  }),
  likePost: privateProcedure.input(z.object({ postId: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId
    const postLike = await ctx.prisma.like.findFirst({ where: { postId: input.postId, userId: userId } })
    const postDisLike = await ctx.prisma.dislike.findFirst({ where: { postId: input.postId, userId: userId } })
    if (postDisLike) {
      await ctx.prisma.dislike.delete({ where: { id: postDisLike.id } })
      await ctx.prisma.like.create({ data: { postId: input.postId, userId: userId } })
    }
    else if (postLike) {
      await ctx.prisma.like.delete({ where: { id: postLike.id } })
    } else {
      await ctx.prisma.like.create({ data: { postId: input.postId, userId: userId } })
    }
  }),
  dislikePost: privateProcedure.input(z.object({ postId: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId
    const postLike = await ctx.prisma.like.findFirst({ where: { postId: input.postId, userId: userId } })
    const postDisLike = await ctx.prisma.dislike.findFirst({ where: { postId: input.postId, userId: userId } })

    if (postLike) {
      await ctx.prisma.like.delete({ where: { id: postLike.id } })
      await ctx.prisma.dislike.create({ data: { postId: input.postId, userId: userId } })
    }
    else if (postDisLike) {
      await ctx.prisma.dislike.delete({ where: { id: postDisLike.id } })
    } else {
      await ctx.prisma.dislike.create({ data: { postId: input.postId, userId: userId } })
    }
  }),
  getMetadataFromUrl: publicProcedure
    .input(z.object({ url: z.string().min(1).url("Must enter a URL") }))
    .mutation(async ({ input }) => {
      try {
        const metadata = await getUrlMetadata(input.url)

        return metadata

      } catch (error) {
        return null
      }
    }),
});
