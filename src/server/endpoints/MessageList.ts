import { messages } from '@prisma/client';
import { z } from 'zod';
import { Message, MessageList } from '~/models/Message';
import { SortType, SortTypeOrder } from '~/models/Sorts';
import { db } from '~/server/db';
import { publicProcedure } from '~/server/trpc';

const LIMIT = 10

interface Request {
  sortingBy: SortType;
  order: SortTypeOrder;
  cursor?: string | null | undefined;
}

export const listMessage = publicProcedure
  .input(
    z.object({
      sortingBy:
        z.enum([SortType.ByCreatedAt, SortType.ByText]),
      order:
        z.enum([SortTypeOrder.Ascending, SortTypeOrder.Descending]),
      cursor: z.string().nullish(),
    }),
  )
  .query(async ({ input }) => {
    // [1] find results
    const messageList = await find(input)

    let nextCursor: typeof input.cursor | undefined = undefined;
    if (messageList.length > LIMIT) {
      const nextItem = messageList.pop()
      nextCursor = nextItem!.id;
    }

    // [2] transform results

    const result: Message[] = messageList.map((message) => ({
      desc: message.desc || "",
      createdAt: message.createdAt.toISOString(),
      id: message.id
    }))

    return {
      messages: result,
      nextCursor: nextCursor
    } as MessageList
  })

async function find(input: Request): Promise<messages[]> {
  const { cursor } = input;

  const orderBy: any = (() => {
    const order: string =
      input.order === SortTypeOrder.Ascending ? "asc" : "desc"
    if (input.sortingBy === SortType.ByCreatedAt) {
      return { createdAt: order }
    }
    return { desc: order }
  })()

  const myCursor: any = (() => {
    if (!cursor) return undefined;
    return { id: cursor }
  })();


  return await db.messages.findMany({
    take: LIMIT + 1,
    cursor: myCursor,
    orderBy: [orderBy]
  })
}