'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { usePlanningStore } from '@/store/planningStore'
import { useEffect } from 'react'
import type { Category } from '@/types'

const CATEGORY_COLOR: Record<Category, string> = {
  plage: '#0077B6',
  restaurant: '#E76F51',
  visite: '#7B2D8B',
  day_trip: '#2D8B4A',
  soiree: '#1A1A2E',
  sport: '#F4A261',
  shopping: '#F4A261',
  libre: '#90E0EF',
  transport: '#6B7280',
}

export function TodayCard() {
  const { days, activities, fetchAll, isLoading } = usePlanningStore()

  useEffect(() => {
    if (days.length === 0) fetchAll()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const currentDay = days.find(d => d.date === today) || days[0]
  const dayActivities = currentDay ? (activities[currentDay.id] || []) : []

  if (isLoading) {
    return <div className="h-40 rounded-card animate-pulse" style={{ background: '#F0F4F8' }} />
  }

  if (!currentDay) return null

  const isToday = currentDay.date === today
  const preview = dayActivities.slice(0, 4)

  return (
    <div className="rounded-card overflow-hidden bg-white"
         style={{ boxShadow: '0 2px 12px rgba(0,119,182,0.1)' }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between"
           style={{ borderBottom: '1px solid rgba(0,119,182,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
               style={{ background: 'rgba(0,119,182,0.07)' }}>
            {currentDay.emoji}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#0077B6' }}>
              {isToday ? "Aujourd'hui" : 'Prochain jour'}
            </p>
            <p className="font-semibold text-sm leading-tight" style={{ color: '#1A1A2E' }}>
              {currentDay.label}
            </p>
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,119,182,0.08)', color: '#0077B6' }}
          >
            {dayActivities.length} activité{dayActivities.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(244,211,63,0.18)', color: '#7a5c00' }}>
          {dayActivities.length} activité{dayActivities.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Timeline */}
      {preview.length > 0 ? (
        <div className="px-4 pt-3 pb-1">
          {preview.map((a, i) => {
            const color = CATEGORY_COLOR[a.category as Category] || '#90E0EF'
            const isLast = i === preview.length - 1
            return (
              <div key={a.id} className="flex items-stretch gap-3">
                {/* Dot + line */}
                <div className="flex flex-col items-center w-4 shrink-0 pt-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  {!isLast && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(0,119,182,0.08)' }} />}
                </div>
                {/* Row */}
                <div className={`flex items-center justify-between flex-1 min-w-0 ${!isLast ? 'pb-3' : 'pb-1'}`}>
                  <span className="text-sm truncate" style={{ color: '#1A1A2E' }}>
                    <span className="mr-1.5">{a.emoji}</span>{a.title}
                  </span>
                  {a.time_slot && (
                    <span className="text-[11px] shrink-0 ml-2 font-mono"
                          style={{ color: 'rgba(26,26,46,0.35)', fontFamily: 'var(--font-mono)' }}>
                      {a.time_slot}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {dayActivities.length > 4 && (
            <p className="text-xs pl-7 pb-2" style={{ color: 'rgba(26,26,46,0.38)' }}>
              +{dayActivities.length - 4} autres
            </p>
          )}
        </div>
      ) : (
        <p className="px-4 py-4 text-sm" style={{ color: 'rgba(26,26,46,0.4)' }}>
          Aucune activité planifiée
        </p>
      )}

      {/* CTA */}
      <div className="px-4 pb-4 pt-3">
        <Link href="/planning"
              className="flex items-center justify-between w-full px-4 h-10 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0077B6, #0096C7)', color: 'white' }}>
          Voir le planning
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  )
}
