export type Category =
  | 'plage' | 'restaurant' | 'visite' | 'day_trip'
  | 'soiree' | 'sport' | 'shopping' | 'libre' | 'transport'

export interface Day {
  id: string
  date: string
  label: string
  emoji: string
  description?: string
  is_arrival: boolean
  is_departure: boolean
  sort_order: number
}

export interface Activity {
  id: string
  day_id: string
  title: string
  description?: string
  emoji: string
  category: Category
  time_slot?: string
  duration_minutes?: number
  location_name?: string
  location_url?: string
  notes?: string
  is_baby_friendly: boolean
  sort_order: number
  created_by: string
  created_at: string
  updated_at: string
}

export type NewActivity = Omit<Activity, 'id' | 'created_at' | 'updated_at'>

export interface ActivityTemplate extends Omit<Activity, 'id' | 'day_id' | 'created_at' | 'updated_at' | 'sort_order' | 'created_by'> {
  id: string
  suggested_time_slot?: string
  tags?: string[]
}

export interface Restaurant {
  id: string
  name: string
  description?: string
  cuisine?: string
  price_range: 1 | 2 | 3
  address?: string
  google_maps_url?: string
  image_url?: string
  is_baby_friendly: boolean
  has_terrace: boolean
  notes?: string
}

export interface RestaurantVote {
  id: string
  restaurant_id: string
  voter_name: string
  vote: 1 | 2 | 3
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

export interface GameCard {
  id: string
  text: string
}

export type GameLevel = 'soft' | 'medium' | 'hot'

export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown>
  old: Record<string, unknown>
  table: string
}
