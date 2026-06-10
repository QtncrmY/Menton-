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
import { Plus } from 'lucide-react'
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
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div>
        <PageHeader title="📅 Notre Planning" subtitle="Menton • 27 juin – 4 juil." />
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-semibold text-gray-900 mb-2">Planning en cours de chargement</p>
          <p className="text-sm text-gray-400">Actualise la page si le problème persiste</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-28">
      <PageHeader title="📅 Notre Planning" subtitle="Menton • 27 juin – 4 juil." />

      {/* Day tabs */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto sticky top-14 z-10">
        <div className="flex px-3 py-2 gap-1.5 min-w-max">
          {days.map((day, index) => {
            const count = (activities[day.id] || []).length
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(index)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[56px] relative',
                  selectedDayIndex === index
                    ? 'bg-azure-500 text-white shadow-sm'
                    : 'text-gray-600 active:bg-gray-50'
                )}
              >
                <span className="text-base">{day.emoji}</span>
                <span className="text-[10px] font-medium leading-none mt-0.5">
                  {day.label.split(' ')[0].slice(0, 3)}
                </span>
                <span className="text-[10px] leading-none">
                  {day.label.split(' ')[1]}
                </span>
                {count > 0 && (
                  <span className={cn(
                    'absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center',
                    selectedDayIndex === index ? 'bg-white text-azure-600' : 'bg-azure-500 text-white'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
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
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          key={selectedDayIndex}
          transition={{ duration: 0.2 }}
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

      {/* Floating Add Button */}
      {selectedDay && (
        <button
          onClick={() => setAddModalDayId(selectedDay.id)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-azure-500 text-white shadow-lg flex items-center justify-center active:scale-95 transition-all z-20"
          aria-label="Ajouter une activité"
          style={{ boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)' }}
        >
          <Plus size={26} />
        </button>
      )}

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
