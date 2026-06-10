'use client'

import { useEffect } from 'react'
import { usePlanningStore } from '@/store/planningStore'
import { supabase } from '@/lib/supabase'

export function usePlanning() {
  const store = usePlanningStore()

  useEffect(() => {
    store.fetchAll()

    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          store.handleRealtimeChange(payload as Parameters<typeof store.handleRealtimeChange>[0])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return store
}
