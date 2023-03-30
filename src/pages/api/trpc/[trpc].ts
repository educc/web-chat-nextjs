import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { ApiResponse } from '~/models/ApiResponse';
import { Message } from '~/models/Message';
import { db } from '~/server/db';
import { publicProcedure, router } from '~/server/trpc';

const appRouter = router({
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
        name: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const messages = await db.messages.findMany()
      const result: Message[] = messages.map((message) => ({
        desc: message.desc || "",
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
