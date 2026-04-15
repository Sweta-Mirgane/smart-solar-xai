import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

type StatusType = "normal" | "warning" | "critical"

interface StatusCardProps {
  title: string
  value: string | number
  subtitle?: string
  status?: StatusType
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
  }
  className?: string
}

const statusStyles: Record<StatusType, string> = {
  normal: "border-status-normal/30 bg-status-normal/5",
  warning: "border-status-warning/30 bg-status-warning/5",
  critical: "border-status-critical/30 bg-status-critical/5",
}

const statusDotStyles: Record<StatusType, string> = {
  normal: "bg-status-normal",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
}

const statusTextStyles: Record<StatusType, string> = {
  normal: "text-status-normal",
  warning: "text-status-warning",
  critical: "text-status-critical",
}

export function StatusCard({
  title,
  value,
  subtitle,
  status = "normal",
  icon: Icon,
  trend,
  className,
}: StatusCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 transition-all hover:border-border/80",
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={cn("rounded-md p-2", status === "normal" ? "bg-primary/10" : statusStyles[status])}>
              <Icon className={cn("h-4 w-4", statusTextStyles[status])} />
            </div>
          )}
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className={cn("h-2.5 w-2.5 rounded-full", statusDotStyles[status])} />
      </div>
      
      <div className="mt-3">
        <div className={cn("text-3xl font-bold tracking-tight", statusTextStyles[status])}>
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <span className={trend.value >= 0 ? "text-status-normal" : "text-status-critical"}>
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
