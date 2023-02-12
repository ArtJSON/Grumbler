import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getRecent: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
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

  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return "you can now see this secret message!";
  }),
});
