import dayjs from "dayjs"
import { Message } from "~/models/Message"
import relativeTime from "dayjs/plugin/relativeTime"
import styles from './Messages.module.css'

dayjs.extend(relativeTime)

interface IProps {
  messages: Message[],
  className?: string,
  onDelete(id: string): void
}

interface IItemProps {
  msg: Message
  onDelete(id: string): void
}

function Messages({ messages, className, onDelete }: IProps) {

  return (
    <section className={className}>
      <div className="p-4 h-full flex flex-col flex-col-reverse gap-4 overflow-auto">
        {messages.map((msg, i) => (
          <MessageItem key={i}
            onDelete={onDelete}
            msg={msg} />
        ))}
      </div>
    </section>
  )
}

function MessageItem({ msg, onDelete }: IItemProps) {
  return (
    <div className={styles['msg-item']}>
      <span className="bg-white p-2">
        {msg.desc}
        <button onClick={() => onDelete(msg.id)}>🗑️</button>
      </span>
      <p className="p-2 text-xs text-slate-400">
        {dayjs(msg.createdAt).fromNow()}
      </p>
    </div>
  )
}

export { Messages }