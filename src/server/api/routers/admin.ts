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
});
