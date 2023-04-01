import { useState } from "react"
import { SortType, SortTypeOrder } from "~/models/Sorts"


interface IProps {
  sortType: SortType
  order: SortTypeOrder
  onSubmit(sortType: SortType, order: SortTypeOrder): void
}

function SortButtons({ sortType, order, onSubmit }: IProps) {
  const [selectedOrder, setSelectedOrder] = useState(order)
  const [selectedType, setSelectedType] = useState(sortType)

  const onClickButton = (myType: SortTypeOrder) => {
    setSelectedOrder(myType)
    onSubmit(selectedType, myType)
  }

  const classForBtn = (myType: SortTypeOrder) => {
    if (selectedOrder == myType) {
      return "px-2 bg-blue-700 text-white"
    }
    return "px-2 bg-white text-blue-700"
  }

  const onSelectChange = (value: string) => {
    const mySortType = value as SortType
    setSelectedType(mySortType)
    onSubmit(mySortType, selectedOrder)
  }

  return (
    <header className={"bg-white h-20 z-10"}>
      <div className={"flex h-full gap-2 p-4 text-sm"}>

        <select
          value={selectedType}
          onChange={(e) => onSelectChange(e.target.value)}
          className="grow bg-white border-slate-400 border-2 px-2">
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
      </div>
    </header>
  )
}

export type { SortType, SortTypeOrder }
export { SortButtons }