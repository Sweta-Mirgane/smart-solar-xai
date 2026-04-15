"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import PredictionCard from "@/components/prediction-card"
import PredictionModal from "@/components/prediction-modal"
import { ProtectedLayout } from "@/components/protected-layout"
import { SystemLiveBadge } from "@/components/system-live-badge"
import Calendar from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const COMPONENT_ORDER = ["inverter", "wms", "ht_mfm", "lt_mfm"]

export default function PredictionPage() {
  return (
    <ProtectedLayout>
      <PredictionPageContent />
    </ProtectedLayout>
  )
}

function PredictionPageContent() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filter, setFilter] = useState<string>("all")
  const [data, setData] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [modalData, setModalData] = useState<any[]>([])
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd")

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/predictions/by-date/${selectedDateKey}`)
      .then((res) => res.json())
      .then((result) => {
        const latestByComponent = COMPONENT_ORDER
          .map((component) =>
            result.find((item: any) => String(item.component).toLowerCase() === component)
          )
          .filter(Boolean)

        setData(latestByComponent)
      })
  }, [selectedDateKey])

  useEffect(() => {
    let ws: WebSocket | null = null
    let isMounted = true

    const connect = () => {
      if (!isMounted) return

      ws = new WebSocket("ws://localhost:8000/ws/live")

      ws.onopen = () => {
        console.log("WS Connected")
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        console.log("DATA:", msg)

        if (msg.type === "prediction") {
          console.log("Live Prediction:", msg.data)

          setData((prev: any[]) => {
            const updated = [...prev]
            const index = updated.findIndex(
              (item) => String(item.component).toLowerCase() === String(msg.data.component).toLowerCase()
            )

            if (index !== -1) {
              updated[index] = msg.data
            } else {
              updated.push(msg.data)
            }

            return updated.sort((a, b) => {
              const aIndex = COMPONENT_ORDER.indexOf(String(a.component).toLowerCase())
              const bIndex = COMPONENT_ORDER.indexOf(String(b.component).toLowerCase())
              return aIndex - bIndex
            })
          })
        }
      }

      ws.onerror = (err) => {
        console.error("WS Error:", err)
      }

      ws.onclose = () => {
        console.log("WS Closed")
        if (isMounted) setTimeout(connect, 2000)
      }
    }

    connect()

    return () => {
      isMounted = false
      if (ws) ws.close()
    }
  }, [])

  const handleClick = async (component: string) => {
    const res = await fetch(
      `http://127.0.0.1:8000/predictions/component/${component}/${selectedDateKey}`
    )
    const result = await res.json()

    setModalData(result)
    setSelected(component)
  }

  const counts = useMemo(() => {
    const initial = {
      NORMAL: 0,
      WARNING: 0,
      CRITICAL: 0,
    }

    data.forEach((item: any) => {
      if (item.health_status in initial) {
        initial[item.health_status as keyof typeof initial]++
      }
    })

    return initial
  }, [data])

  const filterButtons = [
    { label: "All", value: "all", count: data.length, icon: null },
    {
      label: "Normal",
      value: "NORMAL",
      count: counts.NORMAL,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-normal align-middle" />,
    },
    {
      label: "Warning",
      value: "WARNING",
      count: counts.WARNING,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400 align-middle" />,
    },
    {
      label: "Critical",
      value: "CRITICAL",
      count: counts.CRITICAL,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-critical align-middle" />,
    },
  ]

  const filteredPredictions = useMemo(() => {
    if (filter === "all") return data
    return data.filter((item: any) => item.health_status === filter)
  }, [data, filter])

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Prediction
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live + historical component prediction visibility
          </p>
        </div>

        <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-border bg-card/60 p-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex gap-1 rounded-lg border border-border bg-background p-1">
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setFilter(button.value)}
                className={cn(
                  "rounded-md border border-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
                  filter === button.value
                    ? "border-foreground bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {button.icon && <span className="mr-1 inline">{button.icon}</span>}
                {button.label} ({button.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-8 items-center rounded-md border border-border bg-background px-3 text-left text-xs font-medium text-foreground transition hover:border-foreground"
                >
                  {format(selectedDate, "MMM d, yyyy")}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-auto border-slate-800 bg-transparent p-0 shadow-none">
                <Calendar
                  selectedDate={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </PopoverContent>
            </Popover>

            <SystemLiveBadge selectedDate={selectedDate} />
          </div>
        </div>

        <section className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredPredictions.map((item: any, i) => (
              <PredictionCard
                key={`${item.component}-${i}`}
                data={item}
                onClick={() => handleClick(item.component)}
              />
            ))}
          </div>
        </section>

        {filteredPredictions.length === 0 && (
          <div className="mt-10 text-center text-gray-400">
            No prediction data available for selected date
          </div>
        )}

        {selected && (
          <PredictionModal
            data={modalData}
            component={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </main>
    </div>
  )
}
