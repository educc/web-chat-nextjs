import { useState } from "react"


interface IProps {
  onSubmit: any
}

export enum SortType {
  Ascending,
  Descending
}

function SortButtons({ onSubmit }: IProps) {
  const [selected, setSelected] = useState(SortType.Ascending)

  const onClickButton = (myType: SortType) => {
    setSelected(myType)
    onSubmit(myType)
  }

  const classForBtn = (myType: SortType) => {
    if (selected == myType) {
      return "p-2 bg-blue-700 text-white"
    }
    return "p-2 bg-white text-blue-700"
  }

  return (
    <header className={"flex gap-4 p-4 bg-white"}>
      <select className="grow p-2 bg-white border-slate-400 border-2">
        <option value="byTime">Sort by Time</option>
      </select>
      <button
        className={classForBtn(SortType.Ascending)}
        onClick={() => onClickButton(SortType.Ascending)}
        type="submit">ASC</button>
      <button
        className={classForBtn(SortType.Descending)}
        onClick={() => onClickButton(SortType.Descending)}
        type="submit">DESC</button>
    </header>
  )
}

export { SortButtons }