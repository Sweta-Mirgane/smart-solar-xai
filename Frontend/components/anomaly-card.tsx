"use client"

import { cn } from "@/lib/utils"

const getStatusColor = (status: string) => {
  return status === "CRITICAL"
    ? "border-red-500/40 hover:shadow-red-500/10"
    : status === "WARNING"
    ? "border-yellow-500/30 hover:shadow-yellow-500/10"
    : "border-green-500/20 hover:shadow-green-500/10"
}

const getAccentColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500/70"
    case "WARNING":
      return "bg-yellow-500/70"
    case "NORMAL":
      return "bg-green-500/70"
    default:
      return "bg-blue-500/70"
  }
}

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "CRITICAL":
      return "text-red-400"
    case "WARNING":
      return "text-yellow-400"
    case "NORMAL":
      return "text-green-400"
    default:
      return "text-blue-400"
  }
}

export default function AnomalyCard({ anomaly }: any) {

  //  TIME  (supports both API + WS)
  const time =
    anomaly.time ||
    anomaly.timestamp?.split(" ")[1]?.slice(0, 5) ||
    "--"

  //  SCORE 
  const score =
    anomaly.score ??
    anomaly.anomaly_score ??
    "--"

  //  STATUS 
  const status =
    anomaly.status ||
    anomaly.anomaly_status ||
    "NORMAL"

  //  MAIN SOURCE
  const mainSource = anomaly.main_source || "--"

  //  CONTRIBUTORS 
  const contributors =
    Array.isArray(anomaly.contributors)
      ? anomaly.contributors.join(", ")
      : typeof anomaly.contributors === "string"
      ? anomaly.contributors
      : "--"

  //  SCORES  (support both formats)
  const scores = anomaly.scores || {
    wms: anomaly.wms_score,
    inverter: anomaly.inverter_score,
    dgr: anomaly.dgr_score,
    ht: anomaly.ht_score,
    lt: anomaly.lt_score,
  }

  const scoreEntries = Object.entries(scores || {}) as Array<[string, number]>

  const maxKey = scoreEntries.length
    ? scoreEntries.reduce((a, b) =>
        Number(a[1]) > Number(b[1]) ? a : b
      )[0]
    : null

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-slate-950/40 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-950/60 hover:shadow-lg",
        getStatusColor(status)
      )}
    >
      {/* TOP ACCENT LINE */}
      <div className={cn("absolute left-0 top-0 h-[2px] w-full", getAccentColor(status))} />

      <div className="flex h-full min-h-[180px] flex-col justify-between text-white">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-2.5">
          <h3 className="text-xs font-semibold text-foreground">{time}</h3>

          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em]",
              getStatusTextColor(status),
              status === "CRITICAL" && "bg-red-500/10",
              status === "WARNING" && "bg-yellow-500/10",
              status === "NORMAL" && "bg-green-500/10"
            )}
          >
            {status}
          </span>
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col px-3 py-2.5 text-[11px]">

          <div className="grid grid-cols-2 gap-y-3 text-[11px]">

            {/* SCORE */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Score</p>
              <p className={cn("text-[11px] font-bold", getStatusTextColor(status))}>
                {score !== "--" ? Number(score).toFixed(2) : "--"}
              </p>
            </div>

            {/* MAIN SOURCE */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Main Source</p>
              <p className="text-[11px] font-semibold text-white">{mainSource}</p>
            </div>

            {/* CONTRIBUTORS */}
            <div className="col-span-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Contributors</p>
              <p className="text-[10px] text-gray-300">{contributors}</p>
            </div>
          </div>

          {/* COMPONENT SCORES */}
          <div className="mt-auto pt-2">
            <div className="rounded border border-border/60 bg-slate-950/20 px-2 py-1.5">

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                {scoreEntries.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-2">

                    <span className={key === maxKey ? "text-yellow-400" : ""}>
                      {key.toUpperCase()}
                    </span>

                    <span className={cn("text-white", key === maxKey && "text-yellow-400")}>
                      {value ? Number(value).toFixed(2) : "--"}
                    </span>

                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
