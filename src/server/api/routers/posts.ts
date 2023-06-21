import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient, type User } from "@clerk/nextjs/server";
import type { Post, Prisma, PrismaClient, SubEcho } from "@prisma/client";


const getMappedPosts = async (posts: Post[], ctx: {
  userId: string | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}) => {
  return await Promise.all(posts.map(async (post) => {
    const subEcho = await ctx.prisma.subEcho.findUnique({ where: { id: post.echoId } });
    const likes = await ctx.prisma.like.findMany({where: {postId: post.id}}) || []
    const comments = await ctx.prisma.comment.findMany({where: {postId: post.id}}) || []
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
    .query(({ ctx, input }) => {
      const subEcho = ctx.prisma.subEcho.findUnique({ where: { title: input.name } })
      if (!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
      return subEcho
    }),
});
