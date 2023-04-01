import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import "../global.css"
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
};

export default trpc.withTRPC(MyApp);
