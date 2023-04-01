import { z } from 'zod';
import { ApiResponse } from '~/models/ApiResponse';
import { db } from '~/server/db';
import { publicProcedure } from '~/server/trpc';


export const addMessage = publicProcedure
  .input(
    z.object({
      desc: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    await db.messages.create({
      data: { desc: input.desc }
    })
    const response: ApiResponse = { success: true }
    return response
  })