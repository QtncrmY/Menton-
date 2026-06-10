'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { usePlanningStore } from '@/store/planningStore'
import { useEffect } from 'react'

export function TodayCard() {
  const { days, activities, fetchAll, isLoading } = usePlanningStore()

  useEffect(() => {
    if (days.length === 0) fetchAll()
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const currentDay = days.find(d => d.date === today) || days[0]
  const dayActivities = currentDay ? (activities[currentDay.id] || []) : []

  if (isLoading) {
    return <div className="h-32 rounded-card animate-pulse" style={{ background: '#F0F4F8' }} />
  }

  if (!currentDay) return null

  return (
    <div
      className="rounded-card overflow-hidden"
      style={{
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,119,182,0.08)',
        borderLeft: '4px solid #F4D03F',
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(0,119,182,0.06)' }}
            >
              {currentDay.emoji}
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(26,26,46,0.4)' }}>
                {currentDay.date === today ? "Aujourd'hui" : 'Prochain jour'}
              </div>
              <div className="font-semibold text-sm leading-tight" style={{ color: '#1A1A2E' }}>
                {currentDay.label}
              </div>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,119,182,0.08)', color: '#0077B6' }}
          >
            {dayActivities.length} activité{dayActivities.length !== 1 ? 's' : ''}
          </span>
        </div>

        {dayActivities.length > 0 ? (
          <div className="space-y-1.5 mb-3">
            {dayActivities.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(26,26,46,0.7)' }}>
                <span>{a.emoji}</span>
                <span className="truncate flex-1">{a.title}</span>
                {a.time_slot && (
                  <span
                    className="text-[10px] flex-shrink-0 font-mono"
                    style={{ fontFamily: 'var(--font-mono)', color: 'rgba(26,26,46,0.4)' }}
                  >
                    {a.time_slot}
                  </span>
                )}
              </div>
            ))}
            {dayActivities.length > 3 && (
              <div className="text-xs" style={{ color: 'rgba(26,26,46,0.4)' }}>
                +{dayActivities.length - 3} autres
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm mb-3" style={{ color: 'rgba(26,26,46,0.4)' }}>Aucune activité planifiée</p>
        )}

        <Link
          href="/planning"
          className="flex items-center justify-center gap-1.5 w-full h-9 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: 'rgba(0,119,182,0.06)', color: '#0077B6' }}
        >
          Voir le planning
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
