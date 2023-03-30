import dayjs from "dayjs"
import { Message } from "~/models/Message"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface IProps {
  messages: Message[],
  className?: string
}

function Messages({ messages, className }: IProps) {

  return (
    <section className={className}>
      <div className="p-4">
        {messages.map((msg, i) => (
          <MessageItem key={i} {...msg} />
        ))}
      </div>
    </section>
  )
}

function MessageItem(data: Message) {
  return (
    <div>
      <span className="bg-white p-2">
        {data.desc}
      </span>
      <p className="p-2 text-xs text-slate-400">
        {dayjs(data.createdAt).fromNow()}
      </p>
    </div>
  )
}

export { Messages }