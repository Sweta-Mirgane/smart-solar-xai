"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { format } from "date-fns"
import { ProtectedLayout } from "@/components/protected-layout"
import { InverterCard } from "@/components/inverter-card"
import { DetailModal } from "@/components/detail-modal"
import { SystemLiveBadge } from "@/components/system-live-badge"
import Calendar from "@/components/ui/calendar"
import { API_BASE_URL, WS_LIVE_URL } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function FaultDetectionPage() {
  return (
    <ProtectedLayout>
      <FaultDetectionPageContent />
    </ProtectedLayout>
  )
}

function FaultDetectionPageContent() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedInverter, setSelectedInverter] = useState<any | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [faults, setFaults] = useState<any[]>([])
  const calendarRef = useRef<HTMLDivElement | null>(null)
  const selectedDateKey = format(selectedDate, "yyyy-MM-dd")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/faults/by-date/${selectedDateKey}`)
        const data = await res.json()

        console.log("UPDATED DATA:", data)
        setFaults(data)
        setSelectedInverter(null)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
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

        if (msg.type === "fault") {
          console.log("Live Fault:", msg.data)
          setFaults((prev: any[]) => [msg.data, ...prev].slice(0, 50))
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

  const getLatestFaults = (data: any[]) => {
    const map: Record<string, any> = {}

    data.forEach((item) => {
      const inverter = item.inverter

      if (!map[inverter] || new Date(item.date) > new Date(map[inverter].date)) {
        map[inverter] = item
      }
    })

    return Object.values(map)
  }

  const latestFaults = getLatestFaults(faults)

  const sortedFaults = useMemo(() => {
    return [...latestFaults].sort((a: any, b: any) => {
      const numA = parseInt(String(a.inverter).replace("INVERTER", ""), 10)
      const numB = parseInt(String(b.inverter).replace("INVERTER", ""), 10)
      return numA - numB
    })
  }, [latestFaults])

  const getCounts = (data: any[]) => {
    const counts: Record<string, number> = {
      CRITICAL: 0,
      DEGRADED: 0,
      MONITOR: 0,
      STABLE: 0,
    }

    data.forEach((fault) => {
      if (counts[fault.status] !== undefined) {
        counts[fault.status]++
      }
    })

    return counts
  }

  const counts = getCounts(latestFaults)

  const filteredInverters = useMemo(() => {
    if (filter === "all") return sortedFaults
    return sortedFaults.filter((item) => item.status === filter)
  }, [filter, sortedFaults])

  const filterButtons = [
    { label: "All", value: "all", count: latestFaults.length, icon: null },
    {
      label: "Stable",
      value: "STABLE",
      count: counts.STABLE,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-normal align-middle" />,
    },
    {
      label: "Critical",
      value: "CRITICAL",
      count: counts.CRITICAL,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-critical align-middle" />,
    },
    {
      label: "Degraded",
      value: "DEGRADED",
      count: counts.DEGRADED,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full align-middle bg-orange-400" />,
    },
    {
      label: "Monitor",
      value: "MONITOR",
      count: counts.MONITOR,
      icon: <span className="inline-block h-1.5 w-1.5 rounded-full align-middle bg-blue-400" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inverter Health - Fault Detection</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live + historical inverter fault visibility</p>
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

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <div className="relative" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setShowCalendar((value) => !value)}
                className="flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-left text-xs font-medium text-foreground transition hover:border-foreground"
              >
                {format(selectedDate, "MMM d")}
              </button>

              {showCalendar && (
                <div className="absolute right-0 mt-2 z-50">
                  <Calendar
                    selectedDate={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date)
                      setShowCalendar(false)
                    }}
                  />
                </div>
              )}
            </div>

            <SystemLiveBadge selectedDate={selectedDate} />
          </div>
        </div>

        <section className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filteredInverters.map((fault: any) => (
              <InverterCard
                key={fault.inverter}
                fault={fault}
                onClick={() => setSelectedInverter(fault)}
              />
            ))}
          </div>
        </section>

        <DetailModal
          isOpen={!!selectedInverter}
          onClose={() => setSelectedInverter(null)}
          inverter={selectedInverter?.inverter || ""}
          date={selectedInverter?.date}
          status={selectedInverter?.status || "MONITOR"}
          confidence={selectedInverter?.confidence}
          confidence_score={selectedInverter?.confidence_score}
          confidence_label={selectedInverter?.confidence_label}
          fault_type={selectedInverter?.fault_type}
          root_level={selectedInverter?.root_level}
          feature_drift={selectedInverter?.feature_drift || false}
          prediction_drift={selectedInverter?.prediction_drift || false}
          performance_drift={selectedInverter?.performance_drift || false}
          intraday_alert={selectedInverter?.intraday_alert || false}
          likely_causes={selectedInverter?.likely_causes || []}
          recommended_action={selectedInverter?.recommended_action || "--"}
        />
      </main>
    </div>
  )
}
