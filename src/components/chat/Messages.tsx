

interface Message {
  desc: string
}
interface IProps {
  messages: Message[],
  className?: string
}

function Messages({ messages, className }: IProps) {

  return (
    <section className={className}>
      {messages.map((msg, i) => (
        <p key={i}>{msg.desc}</p>
      ))}
    </section>
  )
}

export { Messages }