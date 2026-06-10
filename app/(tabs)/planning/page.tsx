'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { DayColumn } from '@/components/planning/DayColumn'
import { ActivityCard } from '@/components/planning/ActivityCard'
import { AddActivityModal } from '@/components/planning/AddActivityModal'
import { DayPickerSheet } from '@/components/planning/DayPickerSheet'
import { usePlanning } from '@/hooks/usePlanning'
import type { Activity } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function PlanningPage() {
  const { days, activities, isLoading, addActivity, updateActivity, deleteActivity, moveActivity, reorderActivities } = usePlanning()

  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)
  const [addModalDayId, setAddModalDayId] = useState<string | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [movingActivityId, setMovingActivityId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const selectedDay = days[selectedDayIndex]
  const dayActivities = selectedDay ? (activities[selectedDay.id] || []) : []

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string
    const act = Object.values(activities).flat().find(a => a.id === id)
    setActiveActivity(act || null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveActivity(null)
    const { active, over } = event
    if (!over || !selectedDay) return

    const activeId = active.id as string
    const overId = over.id as string

    const sameDayActs = [...dayActivities]
    const activeIndex = sameDayActs.findIndex(a => a.id === activeId)
    const overIndex = sameDayActs.findIndex(a => a.id === overId)

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const reordered = arrayMove(sameDayActs, activeIndex, overIndex).map((a, i) => ({
        ...a,
        sort_order: i,
      }))
      reorderActivities(selectedDay.id, reordered)
      toast.success('Activité réordonnée ✓')
    } else if (days.some(d => d.id === overId)) {
      const targetDayId = overId
      if (targetDayId !== selectedDay.id) {
        const newOrder = (activities[targetDayId] || []).length
        moveActivity(activeId, targetDayId, newOrder)
        toast.success('Activité déplacée ✓')
      }
    }
  }

  const handleMoveUp = useCallback((activityId: string) => {
    if (!selectedDay) return
    const acts = [...dayActivities]
    const index = acts.findIndex(a => a.id === activityId)
    if (index <= 0) return
    const reordered = arrayMove(acts, index, index - 1).map((a, i) => ({ ...a, sort_order: i }))
    reorderActivities(selectedDay.id, reordered)
  }, [dayActivities, selectedDay, reorderActivities])

  const handleMoveDown = useCallback((activityId: string) => {
    if (!selectedDay) return
    const acts = [...dayActivities]
    const index = acts.findIndex(a => a.id === activityId)
    if (index >= acts.length - 1) return
    const reordered = arrayMove(acts, index, index + 1).map((a, i) => ({ ...a, sort_order: i }))
    reorderActivities(selectedDay.id, reordered)
  }, [dayActivities, selectedDay, reorderActivities])

  const handleDelete = useCallback((activityId: string) => {
    deleteActivity(activityId)
    toast.success('Activité supprimée ✓')
  }, [deleteActivity])

  const handleMoveToDay = useCallback((targetDayId: string) => {
    if (!movingActivityId) return
    const newOrder = (activities[targetDayId] || []).length
    moveActivity(movingActivityId, targetDayId, newOrder)
    toast.success('Activité déplacée ✓')
    setMovingActivityId(null)
  }, [movingActivityId, activities, moveActivity])

  if (isLoading) {
    return (
      <div>
        <PageHeader title="📅 Notre Planning" subtitle="Menton • 27 juin – 4 juil." />
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="📅 Notre Planning" subtitle="Menton • 27 juin – 4 juil." />

      {/* Day tabs */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex px-3 py-2 gap-1.5 min-w-max">
          {days.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayIndex(index)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[56px]',
                selectedDayIndex === index
                  ? 'bg-azure-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <span className="text-base">{day.emoji}</span>
              <span className="text-[10px] font-medium leading-none mt-0.5">
                {day.label.split(' ')[0].slice(0, 3)}
              </span>
              <span className="text-[10px] leading-none">
                {day.label.split(' ')[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={selectedDayIndex}
        >
          {selectedDay && (
            <DayColumn
              day={selectedDay}
              activities={dayActivities}
              onAddActivity={(dayId) => setAddModalDayId(dayId)}
              onEditActivity={(activity) => setEditingActivity(activity)}
              onDeleteActivity={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onMoveToDay={(activityId) => setMovingActivityId(activityId)}
            />
          )}
        </motion.div>

        <DragOverlay>
          {activeActivity && (
            <ActivityCard
              activity={activeActivity}
              isDragging
              onEdit={() => {}}
              onDelete={() => {}}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
              onMoveToDay={() => {}}
              isFirst
              isLast
            />
          )}
        </DragOverlay>
      </DndContext>

      {(addModalDayId || editingActivity) && selectedDay && (
        <AddActivityModal
          dayId={addModalDayId || editingActivity?.day_id || selectedDay.id}
          onAdd={addActivity}
          onClose={() => { setAddModalDayId(null); setEditingActivity(null) }}
          editActivity={editingActivity || undefined}
          onUpdate={updateActivity}
        />
      )}

      {movingActivityId && (
        <DayPickerSheet
          days={days}
          onSelect={handleMoveToDay}
          onClose={() => setMovingActivityId(null)}
          excludeDayId={selectedDay?.id}
        />
      )}
    </div>
  )
}
