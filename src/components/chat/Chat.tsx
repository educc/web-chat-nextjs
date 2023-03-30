import { Message } from "~/models/Message";
import { trpc } from "~/utils/trpc";
import { FooterButtons } from "./FootButtons"
import { Messages } from "./Messages";

function Chat() {
  const addMsgMutation = trpc['msg.add'].useMutation();
  const messagesResult = trpc['msg.list'].useQuery({ name: 'client' });

  if (!messagesResult.data) { return <p>Loading</p> }

  const messages: Message[] = messagesResult.data

  const onMsgSubmit = (msg: string) => {

    addMsgMutation.mutate({ desc: msg })
  }

  return (
    <div className="bg-slate-200 flex flex-col h-full">
      {addMsgMutation.error && <p>Something went wrong! {addMsgMutation.error.message}</p>}
      <div>
        header
      </div>
      <Messages
        className="grow"
        messages={messages} />
      <FooterButtons onSubmit={onMsgSubmit} />
    </div>
  )
}

export { Chat }