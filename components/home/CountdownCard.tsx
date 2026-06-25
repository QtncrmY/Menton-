'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DEPARTURE = '2026-06-27'
const ARRIVAL_END = '2026-07-04'
const PLAN_START = '2026-01-01'

function getDiff(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  }
}

function getDaysUntil(dateStr: string) {
  const t = new Date(dateStr), n = new Date()
  t.setHours(0, 0, 0, 0); n.setHours(0, 0, 0, 0)
  return Math.ceil((t.getTime() - n.getTime()) / 86400000)
}

function pad(n: number) { return String(n).padStart(2, '0') }

export function CountdownCard() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const daysUntil = getDaysUntil(DEPARTURE)
  const daysUntilEnd = getDaysUntil(ARRIVAL_END)
  const isOnVoyage = daysUntil <= 0 && daysUntilEnd >= 0
  const isAfter = daysUntilEnd < 0

  if (isAfter) {
    return (
      <div className="rounded-card p-5 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #7B2D8B, #9B59B6)', boxShadow: '0 4px 20px rgba(123,45,139,0.25)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">💭 Souvenir</p>
        <p className="font-display text-2xl italic font-semibold text-white">Un souvenir inoubliable</p>
        <p className="text-sm text-white/50 mt-1">Menton 2026 — 27 juin au 4 juillet</p>
      </div>
    )
  }

  if (isOnVoyage) {
    const voyageDay = Math.abs(daysUntil) + 1
    const progress = Math.min(100, ((voyageDay - 1) / 8) * 100)
    return (
      <motion.div className="rounded-card p-5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #2D8B4A, #27AE60)', boxShadow: '0 4px 20px rgba(45,139,74,0.3)' }}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">🌊 On est à Menton !</p>
        <div className="flex items-end gap-2 mb-5">
          <span className="font-display text-6xl font-semibold text-white leading-none">{voyageDay}</span>
          <span className="text-base font-semibold text-white/70 mb-1.5">/ 8 jours</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <motion.div className="h-full rounded-full bg-white"
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }} />
        </div>
        <p className="text-xs text-white/50 mt-2">Profite ! 🍋</p>
      </motion.div>
    )
  }

  const { days, hours, mins, secs } = getDiff(DEPARTURE)
  const planStart = new Date(PLAN_START).getTime()
  const departure = new Date(DEPARTURE).getTime()
  const progress = Math.min(100, Math.max(0, ((Date.now() - planStart) / (departure - planStart)) * 100))

  const stats = [
    { n: pad(days), label: 'jours' },
    { n: pad(hours), label: 'heures' },
    { n: pad(mins), label: 'min' },
    { n: pad(secs), label: 'sec' },
  ]

  return (
    <motion.div className="rounded-card overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0077B6, #0096C7)', boxShadow: '0 4px 20px rgba(0,119,182,0.28)' }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          ✈️ Départ dans
        </p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {stats.map(({ n, label }) => (
            <div key={label} className="rounded-xl flex flex-col items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.13)', height: '64px' }}>
              <div className="font-display text-2xl font-semibold text-white leading-none tracking-tight">{n}</div>
              <div className="text-[10px] text-white/55 mt-1 font-medium uppercase tracking-wider whitespace-nowrap">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>Sam 27 juin 2026</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{Math.round(progress)}%</p>
        </div>

        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'rgba(255,255,255,0.75)' }}
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }} />
        </div>
      </div>
    </motion.div>
  )
}
