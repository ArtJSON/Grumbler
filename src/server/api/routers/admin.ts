import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { errorMessages } from "../../../utils/errorMessages";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  comment: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { comment } }) => {}),
});
