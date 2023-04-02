import dayjs from "dayjs"
import { Message } from "~/models/Message"
import relativeTime from "dayjs/plugin/relativeTime"
import styles from './Messages.module.css'
import InfiniteScroll from "react-infinite-scroll-component"

dayjs.extend(relativeTime)

interface IProps {
  messages: Message[],
  className?: string,
  onDelete(id: string): void
  fetchMoreData(): void
}

interface IItemProps {
  msg: Message
  onDelete(id: string): void
}

function Messages({ messages, className, fetchMoreData, onDelete }: IProps) {

  return (
    <section className={className}>
      <div
        id="scrollableDiv"
        className="h-full overflow-auto bg-red-slate-200 z-20 flex flex-col flex-col-reverse"
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreData}
          className="px-4 flex flex-col-reverse"
          style={{ overflow: "hidden", height: "100%" }}
          inverse={true} //
          hasMore={true}
          loader={<Loading />}
          scrollableTarget="scrollableDiv"
        >
          {messages.map((msg, i) => (
            <MessageItem key={i}
              onDelete={onDelete}
              msg={msg} />
          ))}
        </InfiniteScroll>
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

function Loading() {
  return <p className="text-center text-slate-400 text-sm p-4">Loading...</p>
}

export { Messages }