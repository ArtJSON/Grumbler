import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const followRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { userId } }) => {
      const followsInDb = await ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: userId,
          },
        },
      });

      if (followsInDb !== null || userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessages.BAD_REQUEST,
        });
      }

      return await ctx.prisma.follows.create({
        data: {
          followerId: ctx.session.user.id,
          followingId: userId,
        },
      });
    }),
  unfollow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { userId } }) => {
      const followsInDb = await ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: userId,
          },
        },
      });

      if (followsInDb === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessages.BAD_REQUEST,
        });
      }

      return await ctx.prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: userId,
          },
        },
      });
    }),
});
