import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";
import dateFormat, { masks } from "dateformat";

import { createTRPCRouter, adminProcedure } from "../trpc";
import { Prisma } from "@prisma/client";

export const adminRouter = createTRPCRouter({
  getReports: adminProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number().min(1).max(100).nullish(),
        showResolved: z.boolean().optional(),
        sortOption: z.string().optional(),
      })
    )
    .query(async ({ ctx, input: { page, limit, sortOption = "asc" } }) => {
      const pageLimit = limit ?? 25;

      const reportsInDb = await ctx.prisma.report.findMany({
        orderBy: {
          createdAt: sortOption as Prisma.SortOrder,
        },
        take: pageLimit,
        skip: (page - 1) * pageLimit,
      });

      const reportsCount = await ctx.prisma.report.count();

      return {
        pages: Math.ceil(reportsCount / pageLimit),
        reports: reportsInDb.map((r) => ({
          id: r.id,
          postId: r.postId,
          createdAt: dateFormat(r.createdAt, "dd/mm/yyyy, HH:MM:ss"),
          reason: r.reason,
        })),
      };
    }),
  getReportedPost: adminProcedure
    .input(
      z.object({
        reportId: z.string(),
      })
    )
    .query(async ({ ctx, input: { reportId } }) => {
      const reportInDb = await ctx.prisma.report.findUniqueOrThrow({
        where: {
          id: reportId,
        },
        include: { post: true },
      });

      return {
        report: {
          id: reportInDb.id,
          reason: reportInDb.reason,
        },
        post: {
          id: reportInDb.post.id,
          content: reportInDb.post.content,
          extendedContent: reportInDb.post.extendedContent,
        },
      };
    }),
  reviewReport: adminProcedure
    .input(
      z.object({
        shouldPostBeRemoved: z.boolean(),
        reportId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { shouldPostBeRemoved, reportId } }) => {
      const reportInDb = await ctx.prisma.report.findUniqueOrThrow({
        where: { id: reportId },
      });

      if (shouldPostBeRemoved) {
        await ctx.prisma.report.delete({
          where: {
            id: reportInDb.id,
          },
        });

        await ctx.prisma.post.delete({
          where: {
            id: reportInDb.postId,
          },
        });
      } else {
        await ctx.prisma.report.delete({
          where: {
            id: reportInDb.id,
          },
        });
      }
    }),
  getUsers: adminProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number().min(1).max(100).nullish(),
        sortOption: z.string().optional(),
      })
    )
    .query(async ({ ctx, input: { page, limit, sortOption = "usr-asc" } }) => {
      const pageLimit = limit ?? 25;
      const usersCount = await ctx.prisma.user.count();

      let orderBy;

      switch (sortOption) {
        case "usr-asc":
          orderBy = {
            username: "asc" as Prisma.SortOrder,
          };
          break;
        case "usr-des":
          orderBy = {
            username: "desc" as Prisma.SortOrder,
          };
          break;
        case "dsp-asc":
          orderBy = {
            displayName: "asc" as Prisma.SortOrder,
          };
          break;
        case "dsp-des":
          orderBy = {
            displayName: "desc" as Prisma.SortOrder,
          };
          break;
        case "rol-asc":
          orderBy = {
            role: "asc" as Prisma.SortOrder,
          };
          break;
        case "rol-des":
          orderBy = {
            role: "desc" as Prisma.SortOrder,
          };
          break;
        case "flw-asc":
          orderBy = {
            followedBy: {
              _count: "asc" as Prisma.SortOrder,
            },
          };
          break;
        case "flw-des":
          orderBy = {
            followedBy: {
              _count: "desc" as Prisma.SortOrder,
            },
          };
          break;
        case "jdt-asc":
          orderBy = {
            joinedAt: "asc" as Prisma.SortOrder,
          };
          break;
        case "jdt-des":
          orderBy = {
            joinedAt: "desc" as Prisma.SortOrder,
          };
          break;
      }

      const usersInDb = await ctx.prisma.user.findMany({
        orderBy,
        include: {
          _count: {
            select: {
              followedBy: true,
            },
          },
        },
        take: pageLimit,
        skip: (page - 1) * pageLimit,
      });

      return {
        pages: Math.ceil(usersCount / pageLimit),
        users: usersInDb.map((r) => ({
          id: r.id,
          username: r.username ?? "",
          displayName: r.displayName ?? "",
          role: r.role,
          followers: r._count.followedBy,
          joinedAt: dateFormat(r.joinedAt, "dd/mm/yyyy, HH:MM:ss"),
          email: r.email ?? "",
        })),
      };
    }),
});
