'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Baby } from 'lucide-react'
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
      <div className="flex items-center gap-2 px-1">
        <span className="text-2xl">{day.emoji}</span>
        <div className="flex-1">
          <h2 className="font-display text-xl text-gray-900">{day.label}</h2>
          {day.description && (
            <p className="text-sm text-gray-500">{day.description}</p>
          )}
        </div>
        <div className="flex gap-1.5">
          {day.is_arrival && (
            <span className="text-xs bg-azure-100 text-azure-700 px-2 py-0.5 rounded-full font-medium">✈️ Arrivée</span>
          )}
          {day.is_departure && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">👋 Départ</span>
          )}
          {allBabyFriendly && (
            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Baby size={11} /> Tout bébé
            </span>
          )}
        </div>
      </div>

      <SortableContext
        items={activities.map(a => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`space-y-2 min-h-[80px] rounded-xl transition-colors duration-150 ${
            isOver ? 'bg-azure-50 ring-2 ring-azure-200' : ''
          }`}
        >
          <AnimatePresence mode="popLayout">
            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-gray-400"
              >
                <span className="text-3xl mb-2">📋</span>
                <p className="text-sm">Aucune activité planifiée</p>
              </motion.div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
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

      <button
        onClick={() => onAddActivity(day.id)}
        className="w-full h-12 rounded-xl border-2 border-dashed border-azure-200 text-azure-500 font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-azure-300 hover:bg-azure-50"
      >
        <Plus size={16} />
        Ajouter une activité
      </button>
    </div>
  )
}
