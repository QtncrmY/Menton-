'use client'

import { useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { useRestaurants } from '@/hooks/useRestaurants'
import { cn } from '@/lib/utils'
import type { RestaurantVote } from '@/types'

const PRICE: Record<number, string> = { 1: '€', 2: '€€', 3: '€€€' }
const VOTE_LABELS: Record<number, string> = { 1: '❤️ J\'adore', 2: '👍 Ok', 3: '🤷 Bof' }
const VOTE_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700 border-red-200',
  2: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  3: 'bg-gray-100 text-gray-600 border-gray-200',
}
const VOTE_EMOJIS: Record<number, string> = { 1: '❤️', 2: '👍', 3: '🤷' }
const MEMBERS = ['Couple 1 A', 'Couple 1 B', 'Couple 2 A', 'Couple 2 B']

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
      <PageHeader title="🍽️ Nos Restaurants" subtitle="Votez pour vos favoris" />

      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="flex px-4 py-2.5 gap-2 min-w-max">
          {([null, 1, 2, 3] as (number | null)[]).map(p => (
            <button
              key={p ?? 'all'}
              onClick={() => setPriceFilter(p)}
              className={cn(
                'h-8 px-3 rounded-full text-sm font-medium transition-colors',
                priceFilter === p ? 'bg-azure-500 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              {p === null ? 'Tous' : PRICE[p]}
            </button>
          ))}
          <button
            onClick={() => setBabyFilter(!babyFilter)}
            className={cn('h-8 px-3 rounded-full text-sm font-medium transition-colors', babyFilter ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600')}
          >
            🍼 Bébé
          </button>
          <button
            onClick={() => setTerraceFilter(!terraceFilter)}
            className={cn('h-8 px-3 rounded-full text-sm font-medium transition-colors', terraceFilter ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600')}
          >
            🏡 Terrasse
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="bg-azure-50 rounded-xl p-3 border border-azure-100">
          <p className="text-xs font-medium text-azure-700 mb-2">Mon prénom pour voter :</p>
          <div className="flex gap-2 flex-wrap">
            {MEMBERS.map(m => (
              <button
                key={m}
                onClick={() => setMyName(m)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  myName === m ? 'bg-azure-500 text-white' : 'bg-white border border-azure-200 text-azure-700'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-4">
        {filtered.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-medium text-gray-500">{restaurant.cuisine}</span>
                    <span className="text-xs font-bold text-emerald-600">{PRICE[restaurant.price_range]}</span>
                    {restaurant.is_baby_friendly && <span className="text-xs">🍼</span>}
                    {restaurant.has_terrace && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">🏡 Terrasse</span>
                    )}
                  </div>
                </div>
              </div>

              {restaurant.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
              )}

              {restaurant.notes && (
                <p className="text-xs text-gray-400 italic mb-3">{restaurant.notes}</p>
              )}

              <div className="border-t border-gray-50 pt-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Votes du groupe :</p>
                <div className="flex gap-3 flex-wrap mb-3">
                  {MEMBERS.map(member => {
                    const vote = getVoteForMember(restaurant.id, member)
                    return (
                      <div key={member} className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{member.split(' ').slice(-1)[0]}</span>
                        {vote ? (
                          <span className="text-base">{VOTE_EMOJIS[vote.vote]}</span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
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
                          className={cn(
                            'flex-1 h-9 rounded-xl text-xs font-medium border transition-all active:scale-95',
                            isSelected ? VOTE_COLORS[v] : 'bg-gray-50 text-gray-600 border-gray-200'
                          )}
                        >
                          {VOTE_LABELS[v]}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-1">Sélectionne ton prénom ci-dessus pour voter</p>
                )}
              </div>

              {restaurant.google_maps_url && (
                <a
                  href={restaurant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full h-9 mt-3 rounded-xl bg-gray-50 text-gray-600 text-sm border border-gray-200 active:scale-95 transition-transform"
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
