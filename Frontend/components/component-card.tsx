"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, ChevronRight, Clock } from "lucide-react"

type StatusType = "normal" | "warning" | "critical"

interface ComponentCardProps {
  name: string
  description: string
  icon: LucideIcon
  status: StatusType
  count?: number
  lastUpdated?: string
  onClick?: () => void
  selected?: boolean
  className?: string
}

const statusStyles: Record<StatusType, { dot: string; text: string; label: string }> = {
  normal: { dot: "bg-status-normal", text: "text-status-normal", label: "Normal" },
  warning: { dot: "bg-status-warning", text: "text-status-warning", label: "Warning" },
  critical: { dot: "bg-status-critical", text: "text-status-critical", label: "Critical" },
}

export function ComponentCard({
  name,
  description,
  icon: Icon,
  status,
  count,
  lastUpdated,
  onClick,
  selected,
  className,
}: ComponentCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:bg-secondary/30",
        selected && "border-primary bg-primary/5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("rounded-lg p-3", selected ? "bg-primary/10" : "bg-secondary")}>
          <Icon className={cn("h-6 w-6", selected ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={cn(
            "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
            status === "normal" ? "bg-status-normal/10 text-status-normal" :
            status === "warning" ? "bg-status-warning/10 text-status-warning" :
            "bg-status-critical/10 text-status-critical"
          )}>
            <div className={cn("h-1.5 w-1.5 rounded-full", statusStyles[status].dot)} />
            {statusStyles[status].label}
          </div>
          {count !== undefined && (
            <span className="text-xs text-muted-foreground">{count} units</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {lastUpdated && (
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {lastUpdated}</span>
        </div>
      )}

      <div className="absolute bottom-5 right-5 opacity-0 transition-opacity group-hover:opacity-100">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  )
}
