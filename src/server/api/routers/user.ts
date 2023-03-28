import { TRPCError } from "@trpc/server";
import dateFormat from "dateformat";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// TODO: Add notifications
export const userRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { username } }) => {
      const userInDb = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          username: username,
        },
      });

      const followsInDb = await ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: userInDb.id,
          },
        },
      });

      if (followsInDb !== null || userInDb.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessages.BAD_REQUEST,
        });
      }

      return await ctx.prisma.follows.create({
        data: {
          followerId: ctx.session.user.id,
          followingId: userInDb.id,
        },
      });
    }),
  unfollow: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { username } }) => {
      const userInDb = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          username: username,
        },
      });

      const followsInDb = await ctx.prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: userInDb.id,
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
            followingId: userInDb.id,
          },
        },
      });
    }),
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        page: z.number().min(0),
      })
    )
    .query(async ({ ctx, input: { username, page } }) => {
      const postInDb = await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: page * 25,
        take: 25,
        where: {
          user: {
            username: username,
          },
        },
        include: {
          postLikes: {
            where: {
              user: {
                id: ctx.session?.user.id,
              },
            },
          },
          user: true,
          _count: {
            select: {
              comments: true,
              postLikes: true,
            },
          },
        },
      });

      const userInDb = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          username: username,
        },
        include: {
          _count: {
            select: {
              posts: true,
              followedBy: true,
              following: true,
            },
          },
        },
      });

      const followInDb = await ctx.prisma.follows.findFirst({
        where: {
          followerId: ctx.session?.user.id,
          following: {
            username: username,
          },
        },
      });

      return {
        user: {
          username: userInDb.username ?? "",
          bio: userInDb.bio ?? undefined,
          imageUrl: userInDb.avatar,
          displayName: userInDb.displayName ?? "",
          joinedAt: dateFormat(userInDb.joinedAt, "dd/mm/yyyy, HH:MM:ss"),
          followers: userInDb._count.followedBy,
          following: userInDb._count.following,
          posts: userInDb._count.posts,
          isUserFollowing: followInDb !== null ? true : false,
          isUserOwner: ctx.session?.user.username === username,
        },
        posts: postInDb.map((p) => ({
          id: p.id,
          createdAt: dateFormat(p.createdAt, "dd/mm/yyyy, HH:MM:ss"),
          userId: p.user.id,
          userImage: p.user.avatar,
          displayName: p.user.displayName ?? "",
          username: p.user.username ?? "",
          content: p.content,
          commentsCount: p._count.comments,
          likesCount: p._count.postLikes,
          liked: ctx.session !== null && p.postLikes.length !== 0,
          hasExtendedContent: p.extendedContent !== null,
          likeButtonActive: ctx.session !== null,
        })),
      };
    }),
  updateSettings: protectedProcedure
    .input(
      z.object({
        displayName: z
          .string()
          .min(3)
          .max(32)
          .regex(/^\S+(?: \S+)*$/),
        username: z
          .string()
          .min(3)
          .max(32)
          .regex(/^[a-z0-9._]+$/),
        bio: z.string().max(320),
      })
    )
    .mutation(async ({ ctx, input: { bio, displayName, username } }) => {
      return ctx.prisma.user.update({
        data: {
          bio,
          displayName,
          username,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
  getSettings: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const userInDb = await ctx.prisma.user.findFirstOrThrow({
      where: {
        username: ctx.session.user.username,
      },
    });

    return {
      username: userInDb.username ?? "",
      displayName: userInDb.displayName ?? "",
      bio: userInDb.bio ?? "",
    };
  }),
});
