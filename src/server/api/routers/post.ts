import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

// TODO: Add correct error handling
// TODO: Split into separate routers (comments, likes etc.)
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

      if (postInDb?.userId === ctx.session.user.id)
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
      const postInDb = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (postInDb?.userId === ctx.session.user.id)
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

      if (postLikeInDb === null) {
        return await ctx.prisma.postLike.create({
          data: {
            postId: postId,
            userId: ctx.session.user.id,
          },
        });
      }
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

      if (postLikeInDb !== null) {
        return await ctx.prisma.postLike.deleteMany({
          where: {
            postId: postId,
            userId: ctx.session.user.id,
          },
        });
      }
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

      if (forwardInDb === null) {
        return await ctx.prisma.forward.create({
          data: {
            postId: postId,
            userId: ctx.session.user.id,
          },
        });
      }
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

      if (forwardInDb !== null) {
        return await ctx.prisma.forward.deleteMany({
          where: {
            id: forwardId,
            userId: ctx.session.user.id,
          },
        });
      }
    }),
  comment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { postId, comment } }) => {
      const postInDb = await ctx.prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (postInDb !== null) {
        return await ctx.prisma.comment.create({
          data: {
            userId: ctx.session.user.id,
            postId: postId,
          },
        });
      }
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { commentId } }) => {
      const commentInDb = await ctx.prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (commentInDb !== null && commentInDb.userId === ctx.session.user.id) {
        return await ctx.prisma.comment.delete({
          where: {
            id: commentId,
          },
        });
      }
    }),
  likeComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { commentId } }) => {
      const commentLikeInDb = await ctx.prisma.commentLike.findFirst({
        where: {
          AND: [{ commentId: commentId }, { userId: ctx.session.user.id }],
        },
      });

      if (commentLikeInDb === null) {
        return await ctx.prisma.commentLike.create({
          data: {
            userId: ctx.session.user.id,
            commentId: commentId,
          },
        });
      }
    }),
  unlikeComment: protectedProcedure
    .input(
      z.object({
        commentLikeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { commentLikeId } }) => {
      const commentLikeInDb = await ctx.prisma.commentLike.findFirst({
        where: {
          AND: [{ id: commentLikeId }, { userId: ctx.session.user.id }],
        },
      });

      if (
        commentLikeInDb !== null &&
        commentLikeInDb.userId === ctx.session.user.id
      ) {
        return await ctx.prisma.commentLike.delete({
          where: {
            id: commentLikeId,
          },
        });
      }
    }),
});
