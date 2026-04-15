import { cn } from "@/lib/utils"

type Props = {
  data: any
  onClick: () => void
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
      return "border-gray-500/60"
  }
}

const getAccentColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500/70"
    case "WARNING":
      return "bg-yellow-400/70"
    case "NORMAL":
      return "bg-green-500/70"
    default:
      return "bg-gray-500/70"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return { label: "Critical", style: "bg-red-500/10 text-red-400" }
    case "WARNING":
      return { label: "Warning", style: "bg-yellow-500/10 text-yellow-300" }
    case "NORMAL":
      return { label: "Normal", style: "bg-green-500/10 text-green-400" }
    default:
      return { label: status, style: "bg-gray-500/10 text-gray-400" }
  }
}

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "text-red-400"
    case "WARNING":
      return "text-yellow-300"
    case "NORMAL":
      return "text-green-400"
    default:
      return "text-gray-300"
  }
}

export default function PredictionCard({ data, onClick }: Props) {
  const badge = getStatusBadge(data.health_status)

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-lg border bg-slate-950/40 text-left transition-all duration-200 hover:scale-[1.02] hover:bg-slate-950/60 hover:shadow-lg",
        getStatusColor(data.health_status)
      )}
    >
      <div className={cn("absolute left-0 top-0 h-[2px] w-full", getAccentColor(data.health_status))} />

      <div className="flex h-full min-h-[180px] flex-col justify-between">
        <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase text-foreground">{data.component}</p>
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
          <div className="grid grid-cols-2 gap-y-3 text-[11px]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Prediction</p>
              <p className={cn("text-[11px] font-semibold", getStatusTextColor(data.health_status))}>
                {data.prediction || "--"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Health Status</p>
              <p className={cn("text-[11px] font-bold", getStatusTextColor(data.health_status))}>
                {data.health_status}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Latest Time</p>
              <p className={cn("text-[10px]", getStatusTextColor(data.health_status))}>
                {data.latest_time || "--"}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-2">
            <div className="rounded border border-border/60 bg-slate-950/20 px-2 py-1.5 text-center text-[10px] text-muted-foreground">
              {data.health_status === "CRITICAL"
                ? data.likely_cause || "Critical pattern detected - investigate immediately"
                : data.health_status === "WARNING"
                ? "Warning trend detected - continue monitoring"
                : "System normal - no action required"}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
