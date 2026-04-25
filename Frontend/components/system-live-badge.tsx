"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useSystemStatus } from "@/hooks/use-system-status"

type Props = {
  selectedDate: Date
}

export function SystemLiveBadge({ selectedDate }: Props) {
  const { systemStatus } = useSystemStatus()
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

  const label = !systemStatus.online ? "ONLINE" : isToday ? "LIVE" : "HISTORY"

  return (
    <span
      className={cn(
        "flex h-8 items-center rounded-md border px-2.5 text-[9px] font-semibold uppercase tracking-[0.2em]",
        label === "LIVE" && "border-status-normal/50 bg-status-normal/10 text-status-normal",
        label === "ONLINE" && "border-status-normal/50 bg-status-normal/10 text-status-normal",
        label === "HISTORY" && "border-border bg-background text-muted-foreground"
      )}
    >
      {label}
    </span>
  )
}
