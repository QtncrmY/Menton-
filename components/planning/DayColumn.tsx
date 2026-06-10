'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { DraggableActivity } from './DraggableActivity'
import type { Day, Activity } from '@/types'

interface DayColumnProps {
  day: Day
  activities: Activity[]
  onAddActivity: (dayId: string) => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (activityId: string) => void
  onMoveUp: (activityId: string) => void
  onMoveDown: (activityId: string) => void
  onMoveToDay: (activityId: string) => void
}

export function DayColumn({
  day,
  activities,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onMoveUp,
  onMoveDown,
  onMoveToDay,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: day.id })
  const allBabyFriendly = activities.length > 0 && activities.every(a => a.is_baby_friendly)

  return (
    <div className="flex flex-col gap-3">
      {/* Day header */}
      <div className="flex items-start gap-3 px-1">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'rgba(0,119,182,0.08)' }}
        >
          {day.emoji}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-semibold leading-tight" style={{ color: '#1A1A2E' }}>
            {day.label}
          </h2>
          {day.description && (
            <p className="text-xs mt-0.5" style={{ color: 'rgba(26,26,46,0.5)' }}>{day.description}</p>
          )}
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {day.is_arrival && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,119,182,0.1)', color: '#0077B6' }}
              >
                ✈️ Arrivée
              </span>
            )}
            {day.is_departure && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(231,111,81,0.1)', color: '#E76F51' }}
              >
                👋 Départ
              </span>
            )}
            {allBabyFriendly && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(244,211,63,0.15)', color: '#8a6d00' }}
              >
                🍼 Tout bébé
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sortable list */}
      <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="space-y-2 min-h-[80px] rounded-xl transition-colors duration-150 p-1"
          style={isOver ? { background: 'rgba(0,119,182,0.05)', outline: '2px dashed rgba(0,119,182,0.2)' } : {}}
        >
          <AnimatePresence mode="popLayout">
            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
                style={{ color: 'rgba(26,26,46,0.3)' }}
              >
                <span className="text-4xl mb-2 opacity-40">📋</span>
                <p className="text-sm">Aucune activité planifiée</p>
                <p className="text-xs mt-1 opacity-70">Tap le + pour en ajouter une</p>
              </motion.div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                >
                  <DraggableActivity
                    activity={activity}
                    onEdit={() => onEditActivity(activity)}
                    onDelete={() => onDeleteActivity(activity.id)}
                    onMoveUp={() => onMoveUp(activity.id)}
                    onMoveDown={() => onMoveDown(activity.id)}
                    onMoveToDay={() => onMoveToDay(activity.id)}
                    isFirst={index === 0}
                    isLast={index === activities.length - 1}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Add button */}
      <button
        onClick={() => onAddActivity(day.id)}
        className="w-full h-13 rounded-card flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-medium text-sm"
        style={{
          border: '2px dashed rgba(0,119,182,0.3)',
          color: '#0077B6',
          background: 'transparent',
          height: '52px',
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,119,182,0.05)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,119,182,0.6)'
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,119,182,0.3)'
        }}
      >
        <Plus size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">Ajouter une activité</span>
      </button>
    </div>
  )
}
