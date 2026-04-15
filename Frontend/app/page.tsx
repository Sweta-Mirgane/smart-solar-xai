'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AlertTriangle, Activity, TrendingUp } from 'lucide-react'
import { ProtectedLayout } from '@/components/protected-layout'

export default function Page() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-16">

        {/* CENTER TITLE */}
        <div className="text-center mt-10">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            XAI-Driven PLC & SCADA for Solar Plants
          </h1>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Fault Detection */}
          <div
            onClick={() => router.push('/fault-detection')}
            className="cursor-pointer rounded-xl border border-red-500/30 bg-card p-6 hover:shadow-lg hover:shadow-red-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" />
              <h2 className="text-lg font-semibold">Fault Detection</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Identify critical system failures in real-time
            </p>
          </div>

          {/* Anomaly Detection */}
          <div
            onClick={() => router.push('/anomaly-detection')}
            className="cursor-pointer rounded-xl border border-yellow-500/30 bg-card p-6 hover:shadow-lg hover:shadow-yellow-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-yellow-400" />
              <h2 className="text-lg font-semibold">Anomaly Detection</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Detect unusual patterns using AI-driven analysis
            </p>
          </div>

          {/* Prediction */}
          <div
            onClick={() => router.push('/prediction')}
            className="cursor-pointer rounded-xl border border-blue-500/30 bg-card p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-400" />
              <h2 className="text-lg font-semibold">Prediction</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Forecast component health & potential risks
            </p>
          </div>

        </div>

        {/* SYSTEM OVERVIEW */}
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold mb-10 tracking-wide text-foreground">
            SYSTEM OVERVIEW
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* IMAGE 1 */}
            <div className="space-y-4 flex flex-col items-center">
              <div
                onClick={() => setSelectedImage('/img_1.jpeg')}
                className="w-full h-56 overflow-hidden rounded-xl border border-border cursor-pointer"
              >
                <img
                  src="/img_1.jpeg"
                  alt="System Flow"
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg">Proposed System Flow</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                High-level data flow from field devices to AI insights and dashboards.
              </p>
            </div>

            {/* IMAGE 2 */}
            <div className="space-y-4 flex flex-col items-center">
              <div
                onClick={() => setSelectedImage('/img_2.jpeg')}
                className="w-full h-56 overflow-hidden rounded-xl border border-border cursor-pointer"
              >
                <img
                  src="/img_2.jpeg"
                  alt="SCADA Architecture"
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg">
                Industrial SCADA & Communication Architecture
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Real-world plant setup with PLCs, gateways, redundancy, and networking.
              </p>
            </div>

            {/* IMAGE 3 */}
            <div className="space-y-4 flex flex-col items-center">
              <div
                onClick={() => setSelectedImage('/img_3.jpeg')}
                className="w-full h-56 overflow-hidden rounded-xl border border-border cursor-pointer"
              >
                <img
                  src="/img_3.jpeg"
                  alt="Monitoring Interface"
                  className="w-full h-full object-cover hover:scale-110 transition-all duration-300"
                />
              </div>
              <h3 className="font-semibold text-lg">
                Operational SCADA Monitoring Interface
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Live status visualization, alarms, and feeder-level monitoring.
              </p>
            </div>

          </div>
        </div>

        {/* IMAGE MODAL */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          >
            <img
              src={selectedImage}
              className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
            />
          </div>
        )}

      </div>
    </ProtectedLayout>
  )
}
