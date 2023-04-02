import { useState } from "react";
import { Message, MessageResponse } from "~/models/Message";
import { trpc } from "~/utils/trpc";
import { SortTypeOrder, SortType } from "~/models/Sorts";
import { FooterButtons } from "./FooterButtons"
import { Messages } from "./Messages";
import { SortButtons } from "./SortButtons";

interface ISearch {
  sortingBy: SortType,
  order: SortTypeOrder
}

function Chat() {
  const [search, setSearch] = useState<ISearch>({
    sortingBy: SortType.ByCreatedAt,
    order: SortTypeOrder.Descending
  })
  const addMsgMutation = trpc['msg.add'].useMutation();
  const deleteMutation = trpc['msg.delete'].useMutation();
  const messagesResult = trpc['msg.list'].useInfiniteQuery(
    search,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!messagesResult.data) { return <p>Loading</p> }

  const messages: MessageResponse[] = messagesResult.data.pages.reduce(
    (acc, page) => acc.concat(page.messages), [] as MessageResponse[])

  const onMsgSubmit = (msg: string, imageBase64: string | undefined) => {
    addMsgMutation.mutate({
      desc: msg,
      imgBase64: imageBase64
    })
  }


  const onSortChange = (sortType: SortType, order: SortTypeOrder) => {
    setSearch({ sortingBy: sortType, order: order })
  }

  const onDelete = (id: string) => {
    deleteMutation.mutate({ id })
    messagesResult.refetch();
  }

  if (addMsgMutation.isSuccess) {
    console.log("refetching by mutation")
    messagesResult.refetch();
  }

  return (
    <div className="bg-slate-200 flex flex-col h-full relative">
      {addMsgMutation.error && <p>Something went wrong! {addMsgMutation.error.message}</p>}
      <SortButtons
        order={search.order}
        sortType={search.sortingBy}
        onSubmit={onSortChange} />
      <Messages
        fetchMoreData={messagesResult.fetchNextPage}
        onDelete={onDelete}
        className="absolute h-full w-full pt-20 pb-24  z-0"
        messages={messages} />
      <span className="grow" />
      <FooterButtons onSubmit={onMsgSubmit} />
    </div>
  )
}

export { Chat }