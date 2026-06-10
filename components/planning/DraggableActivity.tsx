'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActivityCard } from './ActivityCard'
import type { Activity } from '@/types'

interface DraggableActivityProps {
  activity: Activity
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onMoveToDay: () => void
  isFirst: boolean
  isLast: boolean
}

export function DraggableActivity({ activity, ...props }: DraggableActivityProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
  } as React.CSSProperties

  return (
    <div ref={setNodeRef} style={style}>
      <ActivityCard
        activity={activity}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        {...props}
      />
    </div>
  )
}
