import { ChangeEvent, useState } from "react"



interface IProps {
  onSubmit(message: string, imageBase64?: string): void
}

function FooterButtons({ onSubmit }: IProps) {
  const [message, setMessage] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();

  const onSubmitForm = async (e: any) => {
    e.preventDefault()
    const base64File = uploadedFile ?
      await toBase64(uploadedFile) : undefined

    onSubmit(message, base64File)
    setMessage('')
    setUploadedFile(undefined)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFile(e.target.files[0]);
    }
  };

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
        <label
          className="p-4 bg-blue-700 text-white"
          htmlFor="upload-photo"
        >
          📎
        </label>
        <input
          id="upload-photo"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileChange} />
        <button
          className="p-4 bg-blue-700 text-white"
          type="submit">SEND</button>
      </form>
    </footer>
  )
}

function toBase64(file: File): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export { FooterButtons }