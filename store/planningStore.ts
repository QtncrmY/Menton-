import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Day, Activity, NewActivity, RealtimePayload } from '@/types'
import { toast } from 'sonner'

interface PlanningStore {
  days: Day[]
  activities: Record<string, Activity[]>
  isLoading: boolean
  fetchAll: () => Promise<void>
  addActivity: (dayId: string, activity: NewActivity) => Promise<void>
  updateActivity: (activity: Activity) => Promise<void>
  deleteActivity: (activityId: string) => Promise<void>
  moveActivity: (activityId: string, targetDayId: string, newOrder: number) => Promise<void>
  reorderActivities: (dayId: string, reorderedActivities: Activity[]) => Promise<void>
  handleRealtimeChange: (payload: RealtimePayload) => void
}

export const usePlanningStore = create<PlanningStore>((set, get) => ({
  days: [],
  activities: {},
  isLoading: false,

  fetchAll: async () => {
    set({ isLoading: true })
    try {
      const [{ data: days }, { data: activities }] = await Promise.all([
        supabase.from('days').select('*').order('sort_order'),
        supabase.from('activities').select('*').order('sort_order'),
      ])

      const grouped: Record<string, Activity[]> = {}
      if (days) {
        days.forEach(d => { grouped[d.id] = [] })
      }
      if (activities) {
        activities.forEach(a => {
          if (!grouped[a.day_id]) grouped[a.day_id] = []
          grouped[a.day_id].push(a as Activity)
        })
      }

      set({ days: (days as Day[]) || [], activities: grouped, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addActivity: async (dayId, activity) => {
    const tempId = `temp-${Date.now()}`
    const dayActivities = get().activities[dayId] || []
    const newOrder = dayActivities.length

    const tempActivity: Activity = {
      ...activity,
      id: tempId,
      day_id: dayId,
      sort_order: newOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    set(state => ({
      activities: {
        ...state.activities,
        [dayId]: [...(state.activities[dayId] || []), tempActivity],
      },
    }))

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({ ...activity, day_id: dayId, sort_order: newOrder })
        .select()
        .single()

      if (error) throw error

      set(state => ({
        activities: {
          ...state.activities,
          [dayId]: state.activities[dayId].map(a =>
            a.id === tempId ? (data as Activity) : a
          ),
        },
      }))
    } catch {
      set(state => ({
        activities: {
          ...state.activities,
          [dayId]: state.activities[dayId].filter(a => a.id !== tempId),
        },
      }))
      toast.error('Erreur de synchronisation')
    }
  },

  updateActivity: async (activity) => {
    const prevActivities = { ...get().activities }

    set(state => ({
      activities: Object.fromEntries(
        Object.entries(state.activities).map(([dayId, acts]) => [
          dayId,
          acts.map(a => a.id === activity.id ? { ...activity, updated_at: new Date().toISOString() } : a),
        ])
      ),
    }))

    try {
      const { error } = await supabase
        .from('activities')
        .update({ ...activity, updated_at: new Date().toISOString() })
        .eq('id', activity.id)

      if (error) throw error
    } catch {
      set({ activities: prevActivities })
      toast.error('Erreur de synchronisation')
    }
  },

  deleteActivity: async (activityId) => {
    const prevActivities = { ...get().activities }

    set(state => ({
      activities: Object.fromEntries(
        Object.entries(state.activities).map(([dayId, acts]) => [
          dayId,
          acts.filter(a => a.id !== activityId),
        ])
      ),
    }))

    try {
      const { error } = await supabase.from('activities').delete().eq('id', activityId)
      if (error) throw error
    } catch {
      set({ activities: prevActivities })
      toast.error('Erreur de synchronisation')
    }
  },

  moveActivity: async (activityId, targetDayId, newOrder) => {
    const prevActivities = { ...get().activities }
    let movedActivity: Activity | undefined

    const updatedActivities = Object.fromEntries(
      Object.entries(get().activities).map(([dayId, acts]) => {
        const found = acts.find(a => a.id === activityId)
        if (found) movedActivity = found
        return [dayId, acts.filter(a => a.id !== activityId)]
      })
    )

    if (movedActivity) {
      const updated = { ...movedActivity, day_id: targetDayId, sort_order: newOrder }
      updatedActivities[targetDayId] = [
        ...(updatedActivities[targetDayId] || []),
        updated,
      ].sort((a, b) => a.sort_order - b.sort_order)
    }

    set({ activities: updatedActivities })

    try {
      const { error } = await supabase
        .from('activities')
        .update({ day_id: targetDayId, sort_order: newOrder, updated_at: new Date().toISOString() })
        .eq('id', activityId)

      if (error) throw error
    } catch {
      set({ activities: prevActivities })
      toast.error('Erreur de synchronisation')
    }
  },

  reorderActivities: async (dayId, reorderedActivities) => {
    const prevActivities = { ...get().activities }

    set(state => ({
      activities: { ...state.activities, [dayId]: reorderedActivities },
    }))

    try {
      await Promise.all(
        reorderedActivities.map((a, i) =>
          supabase.from('activities').update({ sort_order: i, updated_at: new Date().toISOString() }).eq('id', a.id)
        )
      )
    } catch {
      set({ activities: prevActivities })
      toast.error('Erreur de synchronisation')
    }
  },

  handleRealtimeChange: (payload) => {
    const { eventType, new: newRow, old: oldRow } = payload

    set(state => {
      const activities = { ...state.activities }

      if (eventType === 'INSERT') {
        const a = newRow as unknown as Activity
        if (!activities[a.day_id]) activities[a.day_id] = []
        const exists = activities[a.day_id].some(x => x.id === a.id)
        if (!exists) {
          activities[a.day_id] = [...activities[a.day_id], a].sort((x, y) => x.sort_order - y.sort_order)
          toast('Planning mis à jour par le groupe 🔄', { icon: '🔄' })
        }
      } else if (eventType === 'UPDATE') {
        const a = newRow as unknown as Activity
        Object.keys(activities).forEach(dayId => {
          activities[dayId] = activities[dayId].filter(x => x.id !== a.id)
        })
        if (!activities[a.day_id]) activities[a.day_id] = []
        activities[a.day_id] = [...activities[a.day_id], a].sort((x, y) => x.sort_order - y.sort_order)
      } else if (eventType === 'DELETE') {
        const id = (oldRow as { id: string }).id
        Object.keys(activities).forEach(dayId => {
          activities[dayId] = activities[dayId].filter(x => x.id !== id)
        })
      }

      return { activities }
    })
  },
}))
