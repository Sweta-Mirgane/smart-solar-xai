"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import AnomalyCard from "@/components/anomaly-card"
import { ProtectedLayout } from "@/components/protected-layout"
import { SystemLiveBadge } from "@/components/system-live-badge"
import Calendar from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { API_BASE_URL, WS_LIVE_URL } from "@/lib/api"

export default function AnomalyPage() {
  return (
    <ProtectedLayout>
      <AnomalyPageContent />
    </ProtectedLayout>
  )
}

function AnomalyPageContent() {
  const [selectedDate, setSelectedDate] = useState(new Date("2026-01-15"))
  const [anomalies, setAnomalies] = useState<any[]>([])
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd")

  useEffect(() => {
    fetch(`${API_BASE_URL}/anomalies/by-date/${selectedDateKey}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedData = [...data].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )

        console.log("ANOMALY DATA:", data)
        setAnomalies(sortedData)
      })
  }, [selectedDateKey])

  useEffect(() => {
    let ws: WebSocket | null = null
    let isMounted = true

    const connect = () => {
      if (!isMounted) return

      ws = new WebSocket(WS_LIVE_URL)

      ws.onopen = () => {
        console.log("WS Connected")
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        console.log("DATA:", msg)

        if (msg.type === "anomaly") {
          console.log("Live Anomaly:", msg.data)
          setAnomalies((prev: any[]) => [msg.data, ...prev].slice(0, 50))
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

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Anomaly Detection
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live anomaly visibility for solar system behavior
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card/60 p-2.5">
          <div />

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:border-foreground"
                >
                  {format(selectedDate, "MMM d")}
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

        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
          {anomalies.map((a: any, i: number) => (
            <AnomalyCard key={i} anomaly={a} />
          ))}
        </div>

        {anomalies.length === 0 && (
          <div className="mt-10 text-center text-gray-400">
            No anomaly data available for selected date
          </div>
        )}
      </main>
    </div>
  )
}
