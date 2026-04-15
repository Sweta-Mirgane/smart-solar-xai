"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  data: any[]
  onClose: () => void
  component: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "border-red-500/60"
    case "WARNING":
      return "border-yellow-400/60"
    case "NORMAL":
      return "border-green-500/60"
    default:
      return "border-border"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-400"
    case "WARNING":
      return "bg-yellow-500/10 text-yellow-300"
    case "NORMAL":
      return "bg-green-500/10 text-green-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function PredictionModal({ data, onClose, component }: Props) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})

  const formatCauseItem = (value: string) => {
    const cleaned = value.replace(/â†’|→/g, ":").replace(/\s+/g, " ").trim()
    if (!cleaned) return null

    return cleaned.replace(/^\(([^)]+)\)\s*:\s*/u, "$1: ")
  }

  const getCauseItems = (value: unknown) => {
    if (typeof value !== "string") return []

    return value
      .split(",")
      .map((entry) => formatCauseItem(entry))
      .filter((entry): entry is string => Boolean(entry))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-[1400px] max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]/95 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.65)]">
        <div className="border-b border-slate-800/80 px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold uppercase tracking-[0.08em] text-white">
                {component}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Full prediction timeline
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-md border border-slate-700 bg-black/30 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-8 py-6">
          <div className="grid gap-3 pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((item, i) => {
              const causeItems = getCauseItems(item.likely_cause)
              const isExpanded = Boolean(expandedItems[i])
              const visibleCauseItems = isExpanded ? causeItems : causeItems.slice(0, 2)
              const hasMoreCauses = causeItems.length > 2

              return (
                <div
                  key={i}
                  className={cn(
                    "flex min-h-[190px] flex-col rounded-lg border bg-slate-950/40 p-0 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
                    getStatusColor(item.health_status)
                  )}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5">
                    <span className="text-xs font-semibold tracking-tight text-white">
                      {item.time}
                    </span>

                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em]",
                        getStatusBadge(item.health_status)
                      )}
                    >
                      {item.health_status}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-3 py-2.5 text-[11px]">
                    <div className="grid grid-cols-2 gap-y-3 text-[11px]">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                          Prediction
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-white">
                          {item.prediction}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                          Component
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase text-white">
                          {component}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Timeline Status
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[11px] font-bold",
                          item.health_status === "CRITICAL" && "text-red-400",
                          item.health_status === "WARNING" && "text-yellow-300",
                          item.health_status === "NORMAL" && "text-green-400"
                        )}
                      >
                        {item.health_status}
                      </p>
                    </div>

                    {item.health_status === "CRITICAL" && (
                      <div className="mt-auto pt-2">
                        <div className="rounded border border-red-500/20 bg-red-500/5 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-red-300/80">
                            Likely Cause
                          </p>

                          {causeItems.length > 0 ? (
                            <>
                              <ul className="mt-2 space-y-1.5 text-[10px] leading-5 text-red-300">
                                {visibleCauseItems.map((cause, causeIndex) => (
                                  <li
                                    key={`${i}-${causeIndex}`}
                                    className="flex gap-2 whitespace-normal break-words [overflow-wrap:anywhere]"
                                  >
                                    <span className="pt-[2px] text-red-400">-</span>
                                    <span>{cause}</span>
                                  </li>
                                ))}
                              </ul>

                              {hasMoreCauses && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedItems((current) => ({
                                      ...current,
                                      [i]: !current[i],
                                    }))
                                  }
                                  className="mt-2 text-[10px] font-normal text-slate-400 transition hover:text-slate-200"
                                >
                                  {isExpanded ? "Show less" : "Show more"}
                                </button>
                              )}
                            </>
                          ) : (
                            <p className="mt-2 whitespace-normal break-words text-[10px] leading-5 text-red-300 [overflow-wrap:anywhere]">
                              Critical anomaly detected
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {item.health_status !== "CRITICAL" && (
                      <div className="mt-auto pt-2">
                        <div className="rounded border border-border/60 bg-slate-950/20 px-2 py-1.5 text-center text-[10px] text-muted-foreground">
                          {item.health_status === "WARNING"
                            ? "Warning trend detected - continue monitoring"
                            : "System normal - no action required"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
