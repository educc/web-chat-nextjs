import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { ApiResponse } from '~/models/ApiResponse';
import { Message } from '~/models/Message';
import { SortType, SortTypeOrder } from '~/models/Sorts';
import { db } from '~/server/db';
import { publicProcedure, router } from '~/server/trpc';


const appRouter = router({
  "msg.delete": publicProcedure
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
    }),
  "msg.add": publicProcedure
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
    }),
  "msg.list": publicProcedure
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
    }),
  greeting: publicProcedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z.object({
        name: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      // This is what you're returning to your client
      return {
        text: `hello ${input?.name ?? 'world'}`,
        // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
      };
    }),
  // 💡 Tip: Try adding a new procedure here and see if you can use it in the client!
  // getUser: publicProcedure.query(() => {
  //   return { id: '1', name: 'bob' };
  // }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
