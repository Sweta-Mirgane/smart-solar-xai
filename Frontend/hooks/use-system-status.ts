"use client"

import { useEffect, useState } from "react"

type SystemStatus = {
  online: boolean
  status: "online" | "offline"
  source?: string
  heartbeat_file?: string | null
  last_heartbeat?: string | null
  age_seconds?: number | null
  timeout_seconds?: number | null
}

const defaultStatus: SystemStatus = {
  online: false,
  status: "offline",
  source: "heartbeat_file",
  heartbeat_file: null,
  last_heartbeat: null,
  age_seconds: null,
  timeout_seconds: null,
}

export function useSystemStatus(pollIntervalMs = 10000) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(defaultStatus)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/system/status")
        const data = await response.json()

        if (isMounted) {
          setSystemStatus({
            ...defaultStatus,
            ...data,
          })
        }
      } catch {
        if (isMounted) {
          setSystemStatus(defaultStatus)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchStatus()
    const interval = window.setInterval(fetchStatus, pollIntervalMs)

    return () => {
      isMounted = false
      window.clearInterval(interval)
    }
  }, [pollIntervalMs])

  return {
    systemStatus,
    isLoading,
  }
}
