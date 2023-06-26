import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

export const subEchoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subEcho.findMany()
  }),
  getHeaderEcho: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subEcho.findMany({take: 5})
  }),
  getSubEchoByName: publicProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .query(async ({ ctx, input }) => {      
      const subEcho = await ctx.prisma.subEcho.findUnique({where: { title: input.name}})
      if(!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
      return subEcho
    }),
  getSubEchoById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {      
      const subEcho = await ctx.prisma.subEcho.findUnique({where: { id: input.id}})
      if(!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
      return subEcho
    }),
    create: privateProcedure.input(z.object({ title: z.string().min(1).max(100), description:z.string().max(255).optional()})).mutation(async ({ ctx, input }) => {
      const userId = ctx.userId
      const {title, description = ''} = input
      const subEcho = await ctx.prisma.subEcho.findUnique({ where: { title: title.toLocaleLowerCase() } });
      if(subEcho) throw new TRPCError({ code: "CONFLICT", message: "Echo Space with the same name exists" });
      const echo = await ctx.prisma.subEcho.create({data: {title: title.toLocaleLowerCase(), authorId: userId, description}})
      return echo
      
    }),
    getAllCount: publicProcedure.query(async ({ ctx }) => {
      const count = {
        echoSpaces: 0, 
        users: 0,
      }
      count.echoSpaces = (await ctx.prisma.subEcho.findMany()).length
      count.users = await clerkClient.users.getCount()
      return count
    }),
});
