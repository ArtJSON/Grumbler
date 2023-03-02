import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// TODO: Add notifications
export const userRouter = createTRPCRouter({
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
  getUserRecentPosts: publicProcedure
    .input(
      z.object({
        username: z.string(),
        page: z.number().min(0),
      })
    )
    .query(async ({ ctx, input: { username, page } }) => {
      return await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: page * 25,
        take: 25,
        where: {
          user: {
            name: username,
          },
        },
        include: {
          postLikes: true,
          user: true,
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
});
