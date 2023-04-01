import { z } from 'zod';
import { ApiResponse } from '~/models/ApiResponse';
import { db } from '~/server/db';
import { publicProcedure } from '~/server/trpc';


export const deleteMessage = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    await db.messages.delete({
      where: { id: input.id }
    })
    const response: ApiResponse = { success: true }
    return response
  })