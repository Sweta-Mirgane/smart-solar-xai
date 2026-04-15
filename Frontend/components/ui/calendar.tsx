"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CalendarProps = {
  selectedDate?: Date
  onChange: (date: Date) => void
}

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const isSameDay = (left: Date, right: Date) => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export default function Calendar({ selectedDate, onChange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate ?? new Date())

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate)
    }
  }, [selectedDate])

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const days = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const leadingEmptyDays = firstDayOfMonth.getDay()
    const cells: Array<{ key: string; date?: Date }> = []

    for (let i = 0; i < leadingEmptyDays; i++) {
      cells.push({ key: `empty-${month}-${i}` })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ key: `day-${month}-${day}`, date: new Date(year, month, day) })
    }

    return cells
  }, [currentDate])

  const goToPreviousMonth = () => {
    setCurrentDate((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))
  }

  return (
    <div className="w-[260px] rounded-xl border border-slate-800 bg-[#0B1220] p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="rounded-md p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>

        <h2 className="text-sm font-semibold text-white">{monthLabel}</h2>

        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-md p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs text-slate-400">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((cell) => {
          if (!cell.date) {
            return <div key={cell.key} className="h-9" />
          }

          const selected = selectedDate ? isSameDay(cell.date, selectedDate) : false

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onChange(cell.date!)}
              className={
                selected
                  ? "h-9 rounded-md bg-green-500 text-sm font-semibold text-black transition-colors"
                  : "h-9 rounded-md text-sm text-slate-300 transition-colors hover:bg-slate-800"
              }
            >
              {cell.date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
