import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { ratelimit } from "~/server/helpers/ratelimit";

export const subEchoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subEcho.findMany()
  }),
  getHeaderEcho: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.subEcho.findMany({take: 5, orderBy: {createdAt: 'desc'}})
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
    create: privateProcedure.input(z.object({ title: z.string().min(1).max(100), description:z.string().max(500).optional()})).mutation(async ({ ctx, input }) => {
      const userId = ctx.userId
      const {success} = await ratelimit.limit(userId)
      if(!success) throw new TRPCError({code: 'TOO_MANY_REQUESTS'})
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
    searchSubEchoByName: publicProcedure
    .input(z.object({ name: z.string().max(50) }))
    .query(async ({ ctx, input }) => {     
      if(input.name.length){
        const searchString = input.name.toLowerCase() 
        const subEchos = await ctx.prisma.subEcho.findMany({take: 5,  where: { title: {contains: searchString}}, select:{ title: true}})
        return subEchos || []
      } return []
    }),
    updateSubEcho: privateProcedure.input(z.object({echoId: z.string().min(1).max(100), description: z.string().min(1).max(500)})).mutation(async ({ ctx, input }) => {
      const userId = ctx.userId
      const {echoId, description} = input
      const echo = await ctx.prisma.subEcho.findUnique({ where: { id: input.echoId } })
      if (echo?.authorId !== userId) throw new TRPCError({ code: "FORBIDDEN" })
      const updatedEcho = await ctx.prisma.subEcho.update({
        where: {
          id: echoId,
        },
        data: {
          description,
        },
      })
      return updatedEcho
    })
});
