"use client"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const getStatusColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "border-red-500/60"
    case "DEGRADED":
      return "border-orange-500/60"
    case "MONITOR":
      return "border-blue-500/60"
    case "STABLE":
      return "border-green-500/60"
    default:
      return "border-gray-500/60"
  }
}

const getAccentColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500/70"
    case "DEGRADED":
      return "bg-orange-500/70"
    case "MONITOR":
      return "bg-blue-500/70"
    case "STABLE":
      return "bg-green-500/70"
    default:
      return "bg-gray-500/70"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return { label: "Critical", style: "bg-red-500/10 text-red-400" }
    case "DEGRADED":
      return { label: "Degraded", style: "bg-orange-500/10 text-orange-500" }
    case "MONITOR":
      return { label: "Monitor", style: "bg-blue-500/10 text-blue-400" }
    case "STABLE":
      return { label: "Stable", style: "bg-green-500/10 text-green-400" }
    default:
      return { label: status, style: "bg-gray-500/10 text-gray-400" }
  }
}

const getFooterMessage = (status: string) => {
  switch (status) {
    case "STABLE":
      return "System stable - no action required"
    case "MONITOR":
      return "Monitoring - no immediate action"
    case "DEGRADED":
      return "Performance degrading - attention needed"
    default:
      return null
  }
}

export function InverterCard({ fault, onClick, className }: any) {
  const badge = getStatusBadge(fault.status)

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg border bg-slate-950/40 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-950/60 hover:shadow-lg hover:shadow-red-500/10",
        getStatusColor(fault.status),
        className
      )}
    >
      <div className={cn("absolute left-0 top-0 h-[2px] w-full", getAccentColor(fault.status))} />

      <div className="flex h-full min-h-[180px] flex-col justify-between">
        <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5">
          <p className="text-xs font-semibold text-foreground">{fault.inverter}</p>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em]",
              badge.style
            )}
          >
            {badge.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-3 py-2.5 text-[11px]">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-y-3 text-[11px]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Fault Type</p>
                <p className="text-[11px] font-semibold text-white">{fault.fault_type || "--"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Root</p>
                <p className="text-[10px] text-gray-300">{fault.root_level || "--"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Confidence</p>
                <p className="text-[11px] font-bold text-blue-400">{fault.confidence || "--"}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-2">
            <div className="rounded border border-border/60 bg-slate-950/20 px-2 py-1.5 text-center text-[10px] text-muted-foreground">
              {fault.recommended_action || getFooterMessage(fault.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </button>
  )
}
