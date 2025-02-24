'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TimeLeft {
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  className?: string
}

export function CountdownTimer({ className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    months: 3,
    days: 14,
    hours: 21,
    minutes: 48,
    seconds: 54
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        // Decrement logic here
        let { months, days, hours, minutes, seconds } = prevTime
        
        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              hours = 23
              if (days > 0) {
                days--
              } else {
                days = 30
                if (months > 0) {
                  months--
                }
              }
            }
          }
        }

        return { months, days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">
        COUNTDOWN TO MANDATORY GRANTS SUBMISSION DEADLINE
      </div>
      <div className="flex gap-2">
        <TimeUnit value={timeLeft.months} label="MONTHS" />
        <TimeUnit value={timeLeft.days} label="DAYS" />
        <TimeUnit value={timeLeft.hours} label="HOURS" />
        <TimeUnit value={timeLeft.minutes} label="MINUTES" />
        <TimeUnit value={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-emerald-600 text-white px-3 py-1 rounded font-mono text-lg font-bold min-w-[48px] text-center">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mt-1">
        {label}
      </div>
    </div>
  )
} 