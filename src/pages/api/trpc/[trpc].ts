import * as trpcNext from '@trpc/server/adapters/next';
import { addMessage } from '~/server/endpoints/MessageAdd';
import { deleteMessage } from '~/server/endpoints/MessageDelete';
import { listMessage } from '~/server/endpoints/MessageList';
import { router } from '~/server/trpc';


const appRouter = router({
  "msg.delete": deleteMessage,
  "msg.add": addMessage,
  "msg.list": listMessage,
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
