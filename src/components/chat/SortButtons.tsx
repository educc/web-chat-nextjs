import { useState } from "react"
import { SortType, SortTypeOrder } from "~/models/Sorts"


interface IProps {
  onSubmit(sortType: SortType, order: SortTypeOrder): void
}

function SortButtons({ onSubmit }: IProps) {
  const [selectedOrder, setSelectedOrder] = useState(SortTypeOrder.Ascending)
  const [selectedType, setSelectedType] = useState(SortType.ByCreatedAt)

  const onClickButton = (myType: SortTypeOrder) => {
    setSelectedOrder(myType)
    onSubmit(selectedType, myType)
  }

  const classForBtn = (myType: SortTypeOrder) => {
    if (selectedOrder == myType) {
      return "p-2 bg-blue-700 text-white"
    }
    return "p-2 bg-white text-blue-700"
  }

  const onSelectChange = (value: string) => {
    const mySortType = value as SortType
    setSelectedType(mySortType)
    onSubmit(mySortType, selectedOrder)
  }

  return (
    <header className={"flex gap-4 p-4 bg-white"}>
      <select
        value={selectedType}
        onChange={(e) => onSelectChange(e.target.value)}
        className="grow p-2 bg-white border-slate-400 border-2">
        <option value={SortType.ByText}>Text</option>
        <option value={SortType.ByCreatedAt}>Sort by Time</option>
      </select>
      <button
        className={classForBtn(SortTypeOrder.Ascending)}
        onClick={() => onClickButton(SortTypeOrder.Ascending)}
        type="submit">ASC</button>
      <button
        className={classForBtn(SortTypeOrder.Descending)}
        onClick={() => onClickButton(SortTypeOrder.Descending)}
        type="submit">DESC</button>
    </header>
  )
}

export type { SortType, SortTypeOrder }
export { SortButtons }