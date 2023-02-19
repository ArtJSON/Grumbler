import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getRecent: publicProcedure
    .input(
      z.object({
        page: z.number().min(0),
      })
    )
    .query(async ({ ctx, input: { page } }) => {
      return await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: page * 25,
        take: 25,
        include: {
          user: {
            select: {
              avatar: true,
              displayName: true,
              name: true,
            },
          },
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
  getRecentByFollowed: protectedProcedure
    .input(
      z.object({
        page: z.number().min(0),
      })
    )
    .query(async ({ ctx, input: { page } }) => {
      const followsInDb = await ctx.prisma.follows.findMany({
        where: {
          followerId: ctx.session?.user.id,
        },
        select: {
          followingId: true,
        },
      });

      const followingIds = followsInDb.map(({ followingId }) => followingId);

      return await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: {
            in: followingIds,
          },
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
    .mutation(async ({ ctx, input: { content, extendedConent } }) => {
      // TODO: Add hashtag extraction

      return await ctx.prisma.post.create({
        data: {
          content: content,
          extendedContent: extendedConent,
          userId: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input: { postId } }) => {
      const postInDb = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (postInDb?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errorMessages.UNAUTHORIZED,
        });
      }

      return await ctx.prisma.post.delete({
        where: {
          id: postId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        extendedConent: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input: { content, extendedConent, postId } }) => {
      // TODO: Add hashtag extraction
      const postInDb = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (postInDb?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errorMessages.UNAUTHORIZED,
        });
      }

      return await ctx.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          content: content,
          extendedContent: extendedConent,
        },
      });
    }),
  like: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      const postLikeInDb = await ctx.prisma.postLike.findFirst({
        where: {
          AND: [
            {
              userId: ctx.session.user.id,
            },
            {
              postId: postId,
            },
          ],
        },
      });

      if (postLikeInDb !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessages.BAD_REQUEST,
        });
      }

      return await ctx.prisma.postLike.create({
        data: {
          postId: postId,
          userId: ctx.session.user.id,
        },
      });
    }),
  unlike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      const postLikeInDb = await ctx.prisma.postLike.findFirst({
        where: {
          AND: [
            {
              userId: ctx.session.user.id,
            },
            {
              postId: postId,
            },
          ],
        },
      });

      if (postLikeInDb === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errorMessages.UNAUTHORIZED,
        });
      }

      return await ctx.prisma.postLike.deleteMany({
        where: {
          postId: postId,
          userId: ctx.session.user.id,
        },
      });
    }),
  forward: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId } }) => {
      const forwardInDb = await ctx.prisma.forward.findFirst({
        where: {
          AND: [
            {
              userId: ctx.session.user.id,
            },
            {
              postId: postId,
            },
          ],
        },
      });

      if (forwardInDb !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessages.BAD_REQUEST,
        });
      }

      return await ctx.prisma.forward.create({
        data: {
          postId: postId,
          userId: ctx.session.user.id,
        },
      });
    }),
  unforward: protectedProcedure
    .input(
      z.object({
        forwardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { forwardId } }) => {
      const forwardInDb = await ctx.prisma.forward.findFirst({
        where: {
          AND: [
            {
              userId: ctx.session.user.id,
            },
            {
              id: forwardId,
            },
          ],
        },
      });

      if (forwardInDb === null) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: errorMessages.UNAUTHORIZED,
        });
      }

      return await ctx.prisma.forward.deleteMany({
        where: {
          id: forwardId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
