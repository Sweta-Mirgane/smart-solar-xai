// Fault Detection Module Types
// Centralized type definitions for fault detection, inverter cards, and detail modals

/**
 * Status type representing the operational state of an inverter or system
 * - Normal: Operating within acceptable parameters
 * - Warning: Operating with minor anomalies or warnings
 * - Fault: Critical fault detected, requires immediate attention
 * - CRITICAL: Critical fault detected (API status)
 * - DEGRADED: Degraded state detected (API status)
 * - MONITOR: Normal monitoring state (API status)
 * - STABLE: Stable state without alerts (API status)
 */
export type StatusType = "Normal" | "Warning" | "Fault" | "CRITICAL" | "DEGRADED" | "MONITOR" | "STABLE"

/**
 * Filter type for filtering inverters by status
 * - all: Show all inverters
 * - Specific StatusType: Show only only inverters with that status
 * - monitoring: Show Normal inverters currently under monitoring
 * - stable: Show Normal inverters that are stable (not under monitoring)
 */
export type FilterType = "all" | StatusType | "monitoring" | "stable"

/**
 * Drift status indicating how model predictions are drifting
 * - stable: No significant drift detected
 * - drifting: Minor drift detected in model predictions
 * - critical: Critical drift detected, model may need retraining
 */
export type DriftStatusType = "stable" | "drifting" | "critical"

/**
 * Trend direction for factor impacts
 * - up: Increasing trend
 * - down: Decreasing trend
 * - stable: No significant change
 */
export type TrendType = "up" | "down" | "stable"

/**
 * Represents a single inverter with decision engine output data
 * Maps to decision_engine_output.csv structure
 */
export interface Inverter {
  // Basic identification
  inverter: string
  date: string

  // Status information
  status: StatusType
  confidence: number | string
  confidence_score?: number

  // Drift indicators
  feature_drift: boolean
  prediction_drift: boolean
  performance_drift: boolean

  // Alert and analysis
  intraday_alert: boolean
  likely_causes: string[]
  recommended_action: string
  fault_type?: string
  root_level?: "GRID" | "INVERTER" | "STRING" | "MPPT" | string
  confidence_label?: "HIGH" | "MED" | "LOW" | string
}

/**
 * Props for DetailModal component
 * Contains all information needed to display detailed inverter analysis
 */
export interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  inverter: string
  date?: string
  status: StatusType
  confidence: number | string
  confidence_score?: number
  confidence_label?: "HIGH" | "MED" | "LOW" | string
  fault_type?: string
  root_level?: "GRID" | "INVERTER" | "STRING" | "MPPT" | string
  feature_drift: boolean
  prediction_drift: boolean
  performance_drift: boolean
  intraday_alert: boolean
  likely_causes: string[]
  recommended_action: string
  xaiPlaceholder?: string
}

/**
 * Props for InverterCard component
 * Minimal information needed to display a card view of an inverter
 */
export interface InverterCardProps {
  inverter: string
  date?: string
  status: StatusType
  fault_type?: string
  root_level?: "GRID" | "INVERTER" | "STRING" | "MPPT" | string
  confidence_label?: "HIGH" | "MED" | "LOW" | string
  likely_causes?: string[]
  recommended_action?: string
  onClick?: () => void
  className?: string
}
