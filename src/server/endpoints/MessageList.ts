import { z } from 'zod';
import { Message } from '~/models/Message';
import { SortType, SortTypeOrder } from '~/models/Sorts';
import { db } from '~/server/db';
import { publicProcedure } from '~/server/trpc';


export const listMessage = publicProcedure
  .input(
    z.object({
      sortingBy:
        z.enum([SortType.ByCreatedAt, SortType.ByText]),
      order:
        z.enum([SortTypeOrder.Ascending, SortTypeOrder.Descending]),
    }),
  )
  .query(async ({ input }) => {
    const orderByAttr: any = (() => {
      const order: string =
        input.order === SortTypeOrder.Ascending ? "asc" : "desc"
      if (input.sortingBy === SortType.ByCreatedAt) {
        return { createdAt: order }
      }
      return { desc: order }
    })()

    const messages = await db.messages.findMany({
      orderBy: [orderByAttr]
    })
    const result: Message[] = messages.map((message) => ({
      desc: message.desc || "",
      createdAt: message.createdAt.toISOString(),
      id: message.id
    }))
    return result
  })