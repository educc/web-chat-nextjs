import { useState } from "react"


interface IProps {
  onSubmit: any
}

function FooterButtons({ onSubmit }: IProps) {
  const [message, setMessage] = useState('')

  const onSubmitForm = (e: any) => {
    e.preventDefault()
    onSubmit(message)
    setMessage('')
  }


  return (
    <footer className="h-24 bg-white  z-10">
      <form
        onSubmit={onSubmitForm}
        className="flex gap-4 p-4 h-full">
        <input
          className="grow h-full p-4 border-slate-400 border-2"
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          type="text" />
        <button
          className="p-4 bg-blue-700 text-white"
          type="submit">SEND</button>
      </form>
    </footer>
  )
}

export { FooterButtons }