import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getRecent: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 25;
      const { cursor } = input;

      const postsInDb = await ctx.prisma.post.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        take: limit + 1,
        include: {
          user: true,
          postLikes: {
            where: {
              userId: ctx.session?.user.id,
            },
          },
          _count: {
            select: {
              comments: true,
              postLikes: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (postsInDb.length > limit) {
        const nextItem = postsInDb.pop();
        nextCursor = nextItem!.id;
      }

      return {
        nextCursor: nextCursor,
        posts: postsInDb.map((p) => ({
          id: p.id,
          createdAt: p.createdAt.toDateString(),
          userId: p.user.id,
          userImage: p.user.avatar,
          displayName: p.user.displayName ?? "",
          username: p.user.username ?? "",
          content: p.content,
          commentsCount: p._count.comments,
          likesCount: p._count.postLikes,
          viewsCount: p.views,
          liked: ctx.session !== null && p.postLikes.length !== 0,
          hasExtendedContent: p.extendedContent !== null,
          likeButtonActive: ctx.session !== null,
        })),
      };
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const postInDb = await ctx.prisma.post.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          user: true,
          postLikes: {
            where: {
              userId: ctx.session?.user.id,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  displayName: true,
                  avatar: true,
                  name: true,
                },
              },
              commentLike: {
                where: {
                  userId: ctx.session?.user.id,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
              postLikes: true,
            },
          },
        },
      });

      return {
        post: {
          id: postInDb.id,
          createdAt: postInDb.createdAt.toDateString(),
          userId: postInDb.user.id,
          imageUrl: postInDb.user.avatar ?? "/defaultUserImage.webp",
          displayName: postInDb.user.displayName ?? "",
          username: postInDb.user.username ?? "",
          content: postInDb.content,
          extendedContent: postInDb.extendedContent ?? undefined,
          commentsCount: postInDb._count.comments,
          likesCount: postInDb._count.postLikes,
          viewsCount: postInDb.views,
          liked: ctx.session !== null && postInDb.postLikes.length !== 0,
          hasExtendedContent: postInDb.extendedContent !== null,
          likeButtonActive: ctx.session !== null,
        },
        comments: postInDb.comments.map((c) => ({
          commentId: c.id,
          text: c.text,
          createdAt: c.createdAt.toDateString(),
          displayName: c.user.displayName ?? "",
          username: c.user.name ?? "",
          userImgUrl: c.user.avatar ?? "/defaultUserImage.webp",
          userId: c.userId ?? "",
          liked: c.commentLike.length != 0,
          likeAmount: c.commentLike.length,
        })),
      };
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
              postLikes: true,
            },
          },
        },
      });
    }),
  getTrending: publicProcedure
    .input(
      z.object({
        page: z.number().min(0),
      })
    )
    .query(async ({ ctx, input: { page } }) => {
      const trendingMinDate = new Date();
      trendingMinDate.setDate(trendingMinDate.getDate() - 7);

      const postsInDb = await ctx.prisma.post.findMany({
        where: {
          createdAt: {
            gt: trendingMinDate,
          },
        },
        include: {
          user: true,
          _count: true,
          postLikes: true,
        },
        orderBy: {
          postLikes: {
            _count: "desc",
          },
        },
        skip: page * 25,
        take: 25,
      });

      return {
        posts: postsInDb.map((p) => ({
          id: p.id,
          createdAt: p.createdAt.toDateString(),
          userId: p.user.id,
          userImage: p.user.avatar,
          displayName: p.user.displayName ?? "",
          username: p.user.username ?? "",
          content: p.content,
          commentsCount: p._count.comments,
          likesCount: p._count.postLikes,
          viewsCount: p.views,
          liked: ctx.session !== null && p.postLikes.length !== 0,
          hasExtendedContent: p.extendedContent !== null,
          likeButtonActive: ctx.session !== null,
        })),
      };
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
});
