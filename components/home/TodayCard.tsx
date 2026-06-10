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
    return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
  }

  if (!currentDay) return null

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentDay.emoji}</span>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              {currentDay.date === today ? "Aujourd'hui" : 'Prochain jour'}
            </div>
            <div className="text-xs text-gray-500">{currentDay.label}</div>
          </div>
        </div>
        <span className="text-xs bg-azure-100 text-azure-700 px-2 py-1 rounded-full font-medium">
          {dayActivities.length} activité{dayActivities.length !== 1 ? 's' : ''}
        </span>
      </div>

      {dayActivities.length > 0 ? (
        <div className="space-y-1.5 mb-3">
          {dayActivities.slice(0, 3).map(a => (
            <div key={a.id} className="flex items-center gap-2 text-sm text-gray-700">
              <span>{a.emoji}</span>
              <span className="truncate">{a.title}</span>
              {a.time_slot && <span className="text-gray-400 text-xs ml-auto flex-shrink-0">{a.time_slot}</span>}
            </div>
          ))}
          {dayActivities.length > 3 && (
            <div className="text-xs text-gray-400">+{dayActivities.length - 3} autres</div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-3">Aucune activité planifiée</p>
      )}

      <Link
        href="/planning"
        className="flex items-center justify-center gap-1.5 w-full h-9 rounded-xl bg-azure-50 text-azure-600 text-sm font-medium active:scale-95 transition-transform"
      >
        Voir le planning
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}
