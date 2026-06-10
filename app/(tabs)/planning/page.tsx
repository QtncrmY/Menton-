'use client'

import { useState, useCallback } from 'react'
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, TouchSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { WaveBackground } from '@/components/WaveBackground'
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
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
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
      const reordered = arrayMove(sameDayActs, activeIndex, overIndex).map((a, i) => ({ ...a, sort_order: i }))
      reorderActivities(selectedDay.id, reordered)
      toast.success('Activité réordonnée ✓')
    } else if (days.some(d => d.id === overId)) {
      const targetDayId = overId
      if (targetDayId !== selectedDay.id) {
        moveActivity(activeId, targetDayId, (activities[targetDayId] || []).length)
        toast.success('Activité déplacée ✓')
      }
    }
  }

  const handleMoveUp = useCallback((activityId: string) => {
    if (!selectedDay) return
    const acts = [...dayActivities]
    const index = acts.findIndex(a => a.id === activityId)
    if (index <= 0) return
    reorderActivities(selectedDay.id, arrayMove(acts, index, index - 1).map((a, i) => ({ ...a, sort_order: i })))
  }, [dayActivities, selectedDay, reorderActivities])

  const handleMoveDown = useCallback((activityId: string) => {
    if (!selectedDay) return
    const acts = [...dayActivities]
    const index = acts.findIndex(a => a.id === activityId)
    if (index >= acts.length - 1) return
    reorderActivities(selectedDay.id, arrayMove(acts, index, index + 1).map((a, i) => ({ ...a, sort_order: i })))
  }, [dayActivities, selectedDay, reorderActivities])

  const handleDelete = useCallback((activityId: string) => {
    deleteActivity(activityId)
    toast.success('Activité supprimée ✓')
  }, [deleteActivity])

  const handleMoveToDay = useCallback((targetDayId: string) => {
    if (!movingActivityId) return
    moveActivity(movingActivityId, targetDayId, (activities[targetDayId] || []).length)
    toast.success('Activité déplacée ✓')
    setMovingActivityId(null)
  }, [movingActivityId, activities, moveActivity])

  if (isLoading) {
    return (
      <div>
        <header className="relative overflow-hidden px-4 py-4" style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}>
          <WaveBackground />
          <h1 className="relative font-display text-2xl font-semibold text-white">📅 Notre Planning</h1>
          <p className="relative text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Menton · 27 juin – 4 juil.</p>
        </header>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-card animate-pulse" style={{ background: '#F0F4F8' }} />)}
        </div>
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div>
        <header className="relative overflow-hidden px-4 py-4" style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}>
          <WaveBackground />
          <h1 className="relative font-display text-2xl font-semibold text-white">📅 Notre Planning</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="text-5xl mb-4 opacity-30">📅</div>
          <p className="font-semibold" style={{ color: '#1A1A2E' }}>Planning en cours de chargement</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(26,26,46,0.4)' }}>Actualise la page si le problème persiste</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <header
        className="relative overflow-hidden px-4 py-4 sticky top-0 z-40"
        style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}
      >
        <WaveBackground />
        <h1 className="relative font-display text-2xl font-semibold text-white">📅 Notre Planning</h1>
        <p className="relative text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Menton · 27 juin – 4 juil.</p>
      </header>

      {/* Day tabs */}
      <div
        className="overflow-x-auto no-scrollbar sticky z-10 snap-x-mandatory"
        style={{ top: '64px', background: 'rgba(250,243,224,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,119,182,0.08)' }}
      >
        <div className="flex px-3 py-2.5 gap-2 min-w-max">
          {days.map((day, index) => {
            const count = (activities[day.id] || []).length
            const isActive = selectedDayIndex === index
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(index)}
                className="flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-card transition-all snap-center relative min-w-[60px]"
                style={isActive
                  ? { background: '#0077B6', color: 'white' }
                  : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }
                }
              >
                <span className="text-base leading-none">{day.emoji}</span>
                <span className="text-[10px] font-semibold mt-0.5 leading-none">
                  {day.label.split(' ')[0].slice(0, 3)}
                </span>
                <span className="text-[10px] leading-none mt-0.5">
                  {day.label.split(' ')[1]}
                </span>
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={isActive
                      ? { background: '#F4D03F', color: '#1A1A2E' }
                      : { background: '#0077B6', color: 'white' }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
              activity={activeActivity} isDragging
              onEdit={() => {}} onDelete={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} onMoveToDay={() => {}}
              isFirst isLast
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* FAB */}
      {selectedDay && (
        <button
          onClick={() => setAddModalDayId(selectedDay.id)}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full text-white flex items-center justify-center active:scale-95 transition-all z-20"
          style={{ background: '#0077B6', boxShadow: '0 4px 20px rgba(0,119,182,0.4)' }}
          aria-label="Ajouter une activité"
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
