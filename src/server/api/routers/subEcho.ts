import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subEchoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subEcho.findMany()
  }),
  getSubEchoByName: publicProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .query(({ ctx, input }) => {      
      const subEcho = ctx.prisma.subEcho.findUnique({where: { title: input.name}})
      if(!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
      return subEcho
    }),
  getSubEchoById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {      
      const subEcho = ctx.prisma.subEcho.findUnique({where: { id: input.id}})
      if(!subEcho) throw new TRPCError({ code: "NOT_FOUND" });
      return subEcho
    }),
});
