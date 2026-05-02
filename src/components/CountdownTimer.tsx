'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
  eventName: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-brand-card border border-brand-border rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        <span className="font-heading text-3xl md:text-4xl text-brand-gold">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-1.5 text-white/50 text-xs tracking-widest uppercase">{label}</span>
    </div>
  )
}

export default function CountdownTimer({ targetDate, eventName }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className="text-center">
      <p className="text-white/60 text-sm tracking-widest uppercase mb-3">
        {isExpired ? 'Event has started!' : `Next Event: ${eventName}`}
      </p>
      {!isExpired && (
        <div className="flex items-end justify-center gap-3 md:gap-4">
          <Segment value={timeLeft.days} label="Days" />
          <span className="font-heading text-3xl text-brand-gold mb-4">:</span>
          <Segment value={timeLeft.hours} label="Hours" />
          <span className="font-heading text-3xl text-brand-gold mb-4">:</span>
          <Segment value={timeLeft.minutes} label="Mins" />
          <span className="font-heading text-3xl text-brand-gold mb-4">:</span>
          <Segment value={timeLeft.seconds} label="Secs" />
        </div>
      )}
    </div>
  )
}
