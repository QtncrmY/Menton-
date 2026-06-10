'use client'

import { GripVertical, ArrowUp, ArrowDown, MoveRight, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import type { Activity } from '@/types'

const CATEGORY_ACCENT: Record<string, string> = {
  plage:      '#0077B6',
  restaurant: '#E76F51',
  visite:     '#7B2D8B',
  day_trip:   '#2D8B4A',
  soiree:     '#1A1A2E',
  sport:      '#E76F51',
  shopping:   '#F4A261',
  libre:      '#90E0EF',
  transport:  '#6B7280',
}

const CATEGORY_LABEL: Record<string, string> = {
  plage:      'Plage',
  restaurant: 'Resto',
  visite:     'Visite',
  day_trip:   'Day trip',
  soiree:     'Soirée',
  sport:      'Sport',
  shopping:   'Shopping',
  libre:      'Libre',
  transport:  'Transport',
}

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
  const accent = CATEGORY_ACCENT[activity.category] || '#90E0EF'
  const label = CATEGORY_LABEL[activity.category] || activity.category

  return (
    <div
      className={cn(
        'bg-white rounded-card overflow-hidden transition-all duration-150',
        isDragging
          ? 'shadow-card-hover scale-[1.02] opacity-90 rotate-[0.5deg]'
          : 'shadow-card'
      )}
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-start gap-2 p-3">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing touch-none pt-0.5"
          aria-label="Déplacer l'activité"
          style={{ color: 'rgba(26,26,46,0.2)' }}
        >
          <GripVertical size={16} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-lg leading-none">{activity.emoji}</span>
            <span className="font-semibold text-sm leading-tight" style={{ color: '#1A1A2E' }}>
              {activity.title}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              {label}
            </span>
            {activity.is_baby_friendly && (
              <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">🍼</span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs mb-2" style={{ color: 'rgba(26,26,46,0.5)' }}>
            {activity.time_slot && (
              <span className="font-mono" style={{ fontFamily: 'var(--font-mono)' }}>{activity.time_slot}</span>
            )}
            {activity.duration_minutes && (
              <>
                {activity.time_slot && <span>·</span>}
                <span className="font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatDuration(activity.duration_minutes)}
                </span>
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
            <p className="text-xs italic line-clamp-2 mb-2" style={{ color: 'rgba(26,26,46,0.4)' }}>
              {activity.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              aria-label="Monter"
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-95 disabled:opacity-25"
              style={{ background: '#F0F4F8', color: '#1A1A2E' }}
            >
              <ArrowUp size={13} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              aria-label="Descendre"
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-95 disabled:opacity-25"
              style={{ background: '#F0F4F8', color: '#1A1A2E' }}
            >
              <ArrowDown size={13} />
            </button>
            <button
              onClick={onMoveToDay}
              aria-label="Déplacer vers un autre jour"
              className="flex items-center justify-center gap-1 h-8 px-2 rounded-lg text-xs font-medium transition-all active:scale-95"
              style={{ background: '#F0F4F8', color: '#1A1A2E' }}
            >
              <MoveRight size={12} />
              <span>Déplacer</span>
            </button>
            <div className="flex-1" />
            <button
              onClick={onEdit}
              aria-label="Modifier l'activité"
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-95"
              style={{ background: 'rgba(0,119,182,0.08)', color: '#0077B6' }}
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={onDelete}
              aria-label="Supprimer l'activité"
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-95"
              style={{ background: 'rgba(231,111,81,0.1)', color: '#E76F51' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
