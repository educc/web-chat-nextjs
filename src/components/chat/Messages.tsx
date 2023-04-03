import dayjs from "dayjs"
import { MessageResponse } from "~/models/Message"
import relativeTime from "dayjs/plugin/relativeTime"
import styles from './Messages.module.css'
import InfiniteScroll from "react-infinite-scroll-component"

dayjs.extend(relativeTime)

interface IProps {
  messages: MessageResponse[],
  className?: string,
  onDelete(id: string): void
  fetchMoreData(): void
  hasMore?: boolean
}

interface IItemProps {
  msg: MessageResponse
  onDelete(id: string): void
}

function Messages({ messages, className, hasMore, fetchMoreData, onDelete }: IProps) {

  return (
    <section className={className}>
      <div
        id="scrollableDiv"
        className="h-full overflow-auto z-20 flex flex-col flex-col-reverse"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreData}
          className="px-4 flex flex-col-reverse"
          style={{ overflow: "hidden", height: "100%" }}
          inverse={true}
          hasMore={hasMore || false}
          loader={<Loading />}
          endMessage={<NoMoreMessage />}
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
      {msg.imageUrl && <img src={msg.imageUrl} className="h-32" />}
      <p className="p-2 text-xs text-slate-400">
        {dayjs(msg.createdAt).fromNow()}
      </p>
    </div>
  )
}

function Loading() {
  return <p className="text-center text-slate-400 text-sm p-4">Loading...</p>
}

function NoMoreMessage() {
  return <p className="text-center text-slate-400 text-sm p-4">No more messages</p>
}

export { Messages }