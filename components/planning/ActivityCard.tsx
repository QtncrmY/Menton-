'use client'

import { GripVertical, ArrowUp, ArrowDown, MoveRight, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { CATEGORY_STYLES } from '@/data/activities-library'
import type { Activity } from '@/types'

interface ActivityCardProps {
  activity: Activity
  isDragging?: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onMoveToDay: () => void
  isFirst: boolean
  isLast: boolean
  dragHandleProps?: Record<string, unknown>
}

export function ActivityCard({
  activity,
  isDragging,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onMoveToDay,
  isFirst,
  isLast,
  dragHandleProps,
}: ActivityCardProps) {
  const style = CATEGORY_STYLES[activity.category] || CATEGORY_STYLES.libre

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 p-3 shadow-sm transition-all duration-150',
        isDragging && 'opacity-50 ring-2 ring-azure-400 shadow-lg scale-[1.02]'
      )}
    >
      <div className="flex items-start gap-2">
        <div
          {...dragHandleProps}
          className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing text-gray-300 touch-none"
          aria-label="Déplacer l'activité"
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-lg leading-none">{activity.emoji}</span>
            <span className="font-semibold text-gray-900 text-sm leading-tight">{activity.title}</span>
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', style.bg, style.text)}>
              {style.icon}
            </span>
            {activity.is_baby_friendly && (
              <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">🍼</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mb-2">
            {activity.time_slot && <span>{activity.time_slot}</span>}
            {activity.duration_minutes && (
              <>
                {activity.time_slot && <span>·</span>}
                <span>{formatDuration(activity.duration_minutes)}</span>
              </>
            )}
            {activity.location_name && (
              <>
                <span>·</span>
                <span className="truncate max-w-[120px]">📍 {activity.location_name}</span>
              </>
            )}
          </div>

          {activity.notes && (
            <p className="text-xs text-gray-400 italic line-clamp-2 mb-2">{activity.notes}</p>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              aria-label="Monter"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-500 disabled:opacity-30 active:scale-95 transition-transform"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              aria-label="Descendre"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-500 disabled:opacity-30 active:scale-95 transition-transform"
            >
              <ArrowDown size={14} />
            </button>
            <button
              onClick={onMoveToDay}
              aria-label="Déplacer vers un autre jour"
              className="flex items-center justify-center gap-1 h-8 px-2 rounded-lg bg-gray-50 text-gray-500 text-xs active:scale-95 transition-transform"
            >
              <MoveRight size={12} />
              <span>Déplacer</span>
            </button>
            <div className="flex-1" />
            <button
              onClick={onEdit}
              aria-label="Modifier l'activité"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-azure-50 text-azure-600 active:scale-95 transition-transform"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={onDelete}
              aria-label="Supprimer l'activité"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 active:scale-95 transition-transform"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
