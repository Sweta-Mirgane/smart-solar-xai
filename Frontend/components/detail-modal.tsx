"use client"

import { cn } from "@/lib/utils"
import { X, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DetailModalProps } from "@/types/fault-detection"

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: typeof CheckCircle }> = {
  CRITICAL: {
    bg: "bg-status-critical/10",
    text: "text-status-critical",
    label: "Critical",
    icon: XCircle,
  },
  DEGRADED: {
    bg: "bg-status-warning/10",
    text: "text-status-warning",
    label: "Degraded",
    icon: AlertTriangle,
  },
  MONITOR: {
    bg: "bg-status-normal/10",
    text: "text-status-normal",
    label: "Monitor",
    icon: CheckCircle,
  },
  STABLE: {
    bg: "bg-status-normal/10",
    text: "text-status-normal",
    label: "Stable",
    icon: CheckCircle,
  },
}

const normalizeStatus = (status: string) => {
  switch (status) {
    case "Normal":
      return "MONITOR"
    case "Warning":
      return "DEGRADED"
    case "Fault":
      return "CRITICAL"
    default:
      return status
  }
}

const formatInverterName = (name: string) => {
  return name.startsWith("INV-") ? name.replace("INV-", "INVERTER") : name
}

const getConfidence = ({
  confidence,
  confidence_label,
  confidence_score,
}: {
  confidence?: number | string
  confidence_label?: string
  confidence_score?: number
}) => {
  if (confidence_label) return confidence_label
  if (confidence !== undefined && confidence !== null && confidence !== "") return confidence

  if (confidence_score !== undefined) {
    if (confidence_score > 0.8) return "HIGH"
    if (confidence_score > 0.5) return "MEDIUM"
    return "LOW"
  }

  return "--"
}

export function DetailModal({
  isOpen,
  onClose,
  inverter,
  date,
  status,
  confidence,
  confidence_score,
  confidence_label,
  fault_type,
  root_level,
  feature_drift,
  prediction_drift,
  performance_drift,
  intraday_alert,
  likely_causes,
  recommended_action,
  xaiPlaceholder,
}: DetailModalProps) {
  if (!isOpen) return null

  const normalizedStatus = normalizeStatus(status)
  const config = statusConfig[normalizedStatus] || statusConfig.MONITOR
  const confidenceValue = getConfidence({ confidence, confidence_label, confidence_score })
  const showCauses = normalizedStatus === "CRITICAL"
  const showAction = normalizedStatus === "CRITICAL" || normalizedStatus === "DEGRADED"

  const faultType = (() => {
    if (fault_type) return fault_type
    if (feature_drift) return "Feature Drift"
    if (prediction_drift) return "Prediction Drift"
    if (performance_drift) return "Performance Drift"
    return "No Drift Detected"
  })()

  const causesText = Array.isArray(likely_causes)
    ? likely_causes.filter(Boolean).join(", ")
    : typeof likely_causes === "string"
      ? likely_causes.trim()
      : ""

  const actionText = typeof recommended_action === "string" ? recommended_action.trim() : ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-[#0a0f1a] p-6 shadow-2xl shadow-[0_0_20px_rgba(0,255,150,0.1)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{formatInverterName(inverter)}</h2>
            <p className="text-xs text-gray-400">{date || "Today"}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-semibold uppercase", config.text)}>{config.label}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-border/50">
          <div className="grid grid-cols-3 divide-x divide-border/50 bg-secondary/30">
            <div className="p-2.5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Date</div>
              <div className="mt-1 text-sm font-medium text-foreground">{date || "Today"}</div>
            </div>
            <div className="p-2.5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Status</div>
              <div className="mt-1 text-sm font-medium text-foreground">{config.label}</div>
            </div>
            <div className="p-2.5 text-center">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Confidence</div>
              <div className="mt-1 text-sm font-medium text-foreground">{confidenceValue}</div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-2 text-sm font-semibold text-foreground">COMPONENT DETAILS</div>
          <div className="overflow-hidden rounded-lg border border-border/50">
            <div className="grid grid-cols-2 divide-x divide-border/50 bg-secondary/30">
              <div className="p-2.5">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Fault Type</div>
                <div className="mt-1 text-sm font-medium text-foreground">{faultType || "--"}</div>
              </div>
              <div className="p-2.5">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">Root</div>
                <div className="mt-1 text-sm font-medium text-foreground">{root_level || "--"}</div>
              </div>
            </div>
          </div>
        </div>

        {(showCauses || showAction) && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {showCauses && (
              <div className="rounded-lg border border-border/60 p-4">
                <p className="mb-2 text-xs text-muted-foreground">LIKELY CAUSES</p>
                {causesText ? <p className="text-sm font-medium text-foreground">{"->"} {causesText}</p> : null}
              </div>
            )}

            {showAction && (
              <div className="rounded-lg border border-border/60 p-4">
                <p className="mb-2 text-xs text-muted-foreground">RECOMMENDED ACTION</p>
                {actionText ? <p className="text-sm font-medium text-foreground">{"->"} {actionText}</p> : null}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
