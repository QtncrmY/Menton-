'use client'

import { useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { WaveBackground } from '@/components/WaveBackground'
import { useRestaurants } from '@/hooks/useRestaurants'
import { cn } from '@/lib/utils'
import type { RestaurantVote } from '@/types'

const PRICE: Record<number, string> = { 1: '€', 2: '€€', 3: '€€€' }
const VOTE_LABELS: Record<number, string> = { 1: '❤️ J\'adore', 2: '👍 Ok', 3: '🤷 Bof' }
const VOTE_BG: Record<number, string> = {
  1: 'rgba(231,111,81,0.12)',
  2: 'rgba(0,119,182,0.1)',
  3: 'rgba(107,114,128,0.1)',
}
const VOTE_COLOR: Record<number, string> = { 1: '#E76F51', 2: '#0077B6', 3: '#6B7280' }
const VOTE_EMOJIS: Record<number, string> = { 1: '❤️', 2: '👍', 3: '🤷' }
const MEMBERS = ['Mathilde', 'Alexandre', 'Quentin', 'Sophie']

export default function RestaurantsPage() {
  const { restaurants, votes, voteForRestaurant } = useRestaurants()
  const [priceFilter, setPriceFilter] = useState<number | null>(null)
  const [babyFilter, setBabyFilter] = useState(false)
  const [terraceFilter, setTerraceFilter] = useState(false)
  const [myName, setMyName] = useState<string>('')

  const filtered = restaurants.filter(r => {
    if (priceFilter && r.price_range !== priceFilter) return false
    if (babyFilter && !r.is_baby_friendly) return false
    if (terraceFilter && !r.has_terrace) return false
    return true
  })

  function getVoteForMember(restaurantId: string, memberName: string): RestaurantVote | undefined {
    return votes.find(v => v.restaurant_id === restaurantId && v.voter_name === memberName)
  }

  return (
    <div>
      {/* Header */}
      <header
        className="relative overflow-hidden px-4 py-4 sticky top-0 z-40"
        style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}
      >
        <WaveBackground />
        <div className="relative">
          <h1 className="font-display text-2xl font-semibold text-white">🍽️ Restaurants</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Votez pour vos favoris</p>
        </div>
      </header>

      {/* Filters */}
      <div className="overflow-x-auto no-scrollbar bg-white" style={{ borderBottom: '1px solid rgba(0,119,182,0.08)' }}>
        <div className="flex px-4 py-2.5 gap-2 min-w-max">
          {([null, 1, 2, 3] as (number | null)[]).map(p => (
            <button
              key={p ?? 'all'}
              onClick={() => setPriceFilter(p)}
              className="h-8 px-3 rounded-full text-xs font-semibold transition-all"
              style={priceFilter === p
                ? { background: '#0077B6', color: 'white' }
                : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }
              }
            >
              {p === null ? 'Tous' : PRICE[p]}
            </button>
          ))}
          <button
            onClick={() => setBabyFilter(!babyFilter)}
            className="h-8 px-3 rounded-full text-xs font-semibold transition-all"
            style={babyFilter ? { background: '#F4D03F', color: '#1A1A2E' } : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }}
          >
            🍼 Bébé
          </button>
          <button
            onClick={() => setTerraceFilter(!terraceFilter)}
            className="h-8 px-3 rounded-full text-xs font-semibold transition-all"
            style={terraceFilter ? { background: '#2D8B4A', color: 'white' } : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }}
          >
            🌿 Terrasse
          </button>
        </div>
      </div>

      {/* Voter selector */}
      <div className="px-4 py-3">
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(0,119,182,0.05)', border: '1px solid rgba(0,119,182,0.1)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#0077B6' }}>
            Mon prénom pour voter
          </p>
          <div className="flex gap-2 flex-wrap">
            {MEMBERS.map(m => (
              <button
                key={m}
                onClick={() => setMyName(m)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={myName === m
                  ? { background: '#0077B6', color: 'white' }
                  : { background: 'white', color: '#0077B6', border: '1.5px solid rgba(0,119,182,0.3)' }
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-4">
        {filtered.map(restaurant => (
          <div
            key={restaurant.id}
            className="bg-white rounded-card overflow-hidden"
            style={{ boxShadow: '0 2px 8px rgba(0,119,182,0.08)' }}
          >
            {/* Top accent bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: 'linear-gradient(90deg, #0077B6, #90E0EF)' }}
            />

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold" style={{ color: '#1A1A2E' }}>{restaurant.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>{restaurant.cuisine}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(45,139,74,0.1)', color: '#2D8B4A' }}
                    >
                      {PRICE[restaurant.price_range]}
                    </span>
                    {restaurant.is_baby_friendly && <span className="text-xs">🍼</span>}
                    {restaurant.has_terrace && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(45,139,74,0.1)', color: '#2D8B4A' }}
                      >
                        🌿 Terrasse
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {restaurant.description && (
                <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgba(26,26,46,0.6)' }}>
                  {restaurant.description}
                </p>
              )}

              <div className="pt-3" style={{ borderTop: '1px solid rgba(0,119,182,0.06)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(26,26,46,0.4)' }}>
                  Votes du groupe
                </p>
                <div className="flex gap-3 flex-wrap mb-3">
                  {MEMBERS.map(member => {
                    const vote = getVoteForMember(restaurant.id, member)
                    return (
                      <div key={member} className="flex items-center gap-1">
                        <span className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>{member.split(' ')[0]}</span>
                        {vote ? (
                          <span className="text-base">{VOTE_EMOJIS[vote.vote]}</span>
                        ) : (
                          <span className="text-xs" style={{ color: 'rgba(26,26,46,0.2)' }}>—</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {myName ? (
                  <div className="flex gap-2">
                    {([1, 2, 3] as const).map(v => {
                      const myVote = getVoteForMember(restaurant.id, myName)
                      const isSelected = myVote?.vote === v
                      return (
                        <button
                          key={v}
                          onClick={() => voteForRestaurant(restaurant.id, myName, v)}
                          className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all active:scale-95"
                          style={isSelected
                            ? { background: VOTE_BG[v], color: VOTE_COLOR[v], border: `1.5px solid ${VOTE_COLOR[v]}40` }
                            : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)', border: '1.5px solid transparent' }
                          }
                        >
                          {VOTE_LABELS[v]}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-center py-1" style={{ color: 'rgba(26,26,46,0.35)' }}>
                    Sélectionne ton prénom ci-dessus pour voter
                  </p>
                )}
              </div>

              {restaurant.google_maps_url && (
                <a
                  href={restaurant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full h-9 mt-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ background: 'rgba(0,119,182,0.06)', color: '#0077B6', border: '1px solid rgba(0,119,182,0.15)' }}
                >
                  <MapPin size={13} />
                  Voir sur Maps
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
