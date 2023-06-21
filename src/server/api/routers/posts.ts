import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient, type User } from "@clerk/nextjs/server";
import type { Post, Prisma, PrismaClient, SubEcho } from "@prisma/client";


const getMappedPosts = async (posts: Post[], ctx: {
  userId: string | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}) => {
  return await Promise.all(posts.map(async (post) => {
    const subEcho = await ctx.prisma.subEcho.findUnique({ where: { id: post.echoId } });
    const likes = await ctx.prisma.like.findMany({ where: { postId: post.id } }) || []
    const comments = await ctx.prisma.comment.findMany({ where: { postId: post.id } }) || []
    const userId = post.authorId;
    const user = await clerkClient.users.getUser(userId);

    if (!user)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author for post not found" });
    const username = user?.username || (user?.firstName && user?.lastName ? `${user.firstName}_${user.lastName}` : 'unknown');
    return {
      ...post,
      echoName: subEcho?.title,
      likes,
      comments,
      user: { id: user.id, username, profileImageUrl: user.profileImageUrl }
    };
  }));
}

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100, orderBy: { createdAt: 'desc' } })
    if (!posts) throw new TRPCError({ code: "NOT_FOUND" });
    const mappedPosts = getMappedPosts(posts, ctx)
    return mappedPosts
  }),
  getSubEchoByName: publicProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .query(async ({ ctx, input }) => {
      const subEcho = await ctx.prisma.subEcho.findUnique({ where: { title: input.name } })
      if (!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
      return subEcho
    }),
  create: privateProcedure.input(z.object({ title: z.string().min(1).max(100), url: z.string().url("Enter a URL").max(255).optional(), echo: z.string().min(1).max(50), description:z.string().max(50).optional()})).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId
    const {title, url = '', echo, description = ''} = input
    const subEcho = await ctx.prisma.subEcho.findUnique({ where: { title: echo } });
    if(!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
    const post = await ctx.prisma.post.create({data: {title, url, echoId: subEcho.id, description, authorId: userId}})
    return post
    
  }),
  likePost: privateProcedure.input(z.object({postId: z.string().min(1)})).mutation(async ({ ctx, input }) => {
    const userId = ctx.userId
    const postLikes = await ctx.prisma.like.findMany({where: {postId: input.postId}})
    const postLike = postLikes.find((post) => post.userId === userId)
    if(postLike) {
      await ctx.prisma.like.delete({where: {id: postLike.id}})
    } else {      
      await ctx.prisma.like.create({data: {postId: input.postId, userId: userId}})
    }
  })
});
