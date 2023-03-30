import { useState } from "react";
import { Message } from "~/models/Message";
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
  const [search, setSearch] = useState({
    sortingBy: SortType.ByCreatedAt,
    order: SortTypeOrder.Descending
  })
  const addMsgMutation = trpc['msg.add'].useMutation();
  const deleteMutation = trpc['msg.delete'].useMutation();
  const messagesResult = trpc['msg.list'].useQuery(search);

  if (!messagesResult.data) { return <p>Loading</p> }

  const messages: Message[] = messagesResult.data

  const onMsgSubmit = (msg: string) => {
    addMsgMutation.mutate({ desc: msg })
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
    <div className="bg-slate-200 flex flex-col h-full">
      {addMsgMutation.error && <p>Something went wrong! {addMsgMutation.error.message}</p>}
      <SortButtons
        order={search.order}
        sortType={search.sortingBy}
        onSubmit={onSortChange} />
      <Messages
        onDelete={onDelete}
        className="grow"
        messages={messages} />
      <FooterButtons onSubmit={onMsgSubmit} />
    </div>
  )
}

export { Chat }