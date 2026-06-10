'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimePayload } from '@/types'

export function useRealtimeSubscription(
  table: string,
  handler: (payload: RealtimePayload) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => handler(payload as RealtimePayload)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, handler])
}
