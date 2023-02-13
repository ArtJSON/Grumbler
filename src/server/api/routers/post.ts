import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getRecent: publicProcedure
    .input(
      z.object({
        page: z.number().min(0),
      })
    )
    .query(({ ctx, input: { page } }) => {
      return ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: page * 25,
        take: 25,
        include: {
          _count: {
            select: {
              comments: true,
              forwards: true,
              postLikes: true,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({ content: z.string(), extendedConent: z.string().optional() })
    )
    .mutation(({ ctx, input: { content, extendedConent } }) => {
      return ctx.prisma.post.create({
        data: {
          content: content,
          extendedContent: extendedConent,
          userId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({ content: z.string(), extendedConent: z.string().optional() })
    )
    .mutation(({ ctx, input: { content, extendedConent } }) => {
      return ctx.prisma.post.create({
        data: {
          content: content,
          extendedContent: extendedConent,
          userId: ctx.session.user.id,
        },
      });
    }),
});
