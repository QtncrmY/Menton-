'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RESTAURANTS } from '@/data/restaurants'
import type { Restaurant, RestaurantVote } from '@/types'
import { toast } from 'sonner'

export function useRestaurants() {
  const [restaurants] = useState<Restaurant[]>(RESTAURANTS)
  const [votes, setVotes] = useState<RestaurantVote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVotes()

    const channel = supabase
      .channel('votes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_votes' }, () => {
        loadVotes()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadVotes() {
    setIsLoading(true)
    const { data } = await supabase.from('restaurant_votes').select('*')
    setVotes((data as RestaurantVote[]) || [])
    setIsLoading(false)
  }

  const voteForRestaurant = useCallback(async (
    restaurantId: string,
    voterName: string,
    vote: 1 | 2 | 3
  ) => {
    const prevVotes = [...votes]
    const existing = votes.find(v => v.restaurant_id === restaurantId && v.voter_name === voterName)

    if (existing) {
      setVotes(prev => prev.map(v =>
        v.restaurant_id === restaurantId && v.voter_name === voterName
          ? { ...v, vote }
          : v
      ))
    } else {
      const tempVote: RestaurantVote = {
        id: `temp-${Date.now()}`,
        restaurant_id: restaurantId,
        voter_name: voterName,
        vote,
      }
      setVotes(prev => [...prev, tempVote])
    }

    try {
      const { error } = await supabase
        .from('restaurant_votes')
        .upsert({ restaurant_id: restaurantId, voter_name: voterName, vote }, {
          onConflict: 'restaurant_id,voter_name',
        })

      if (error) throw error
      toast.success('Vote enregistré ✓')
      await loadVotes()
    } catch {
      setVotes(prevVotes)
      toast.error('Erreur lors du vote')
    }
  }, [votes])

  return { restaurants, votes, voteForRestaurant, isLoading }
}
