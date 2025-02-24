'use client'

import { CountdownTimer } from '@/components/ui/countdown-timer'

export default function PilotPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-end mb-8">
        <CountdownTimer />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Pilot Program</h1>
        {/* Rest of pilot page content */}
      </div>
    </div>
  )
} 