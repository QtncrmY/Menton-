'use client'

import { useState, useEffect } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { WaveBackground } from '@/components/WaveBackground'
import { DayPickerSheet } from '@/components/planning/DayPickerSheet'
import { AddActivityModal } from '@/components/planning/AddActivityModal'
import { ACTIVITIES_LIBRARY } from '@/data/activities-library'
import { usePlanningStore } from '@/store/planningStore'
import type { ActivityTemplate } from '@/types'
import { cn, formatDuration } from '@/lib/utils'
import { toast } from 'sonner'

const CATEGORY_ACCENT: Record<string, string> = {
  plage: '#0077B6', restaurant: '#E76F51', visite: '#7B2D8B',
  day_trip: '#2D8B4A', soiree: '#1A1A2E', sport: '#E76F51',
  shopping: '#F4A261', libre: '#90E0EF', transport: '#6B7280',
}

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'plage', label: '🏖️ Plage' },
  { key: 'visite', label: '🏛️ Visite' },
  { key: 'day_trip', label: '🎰 Day trip' },
  { key: 'soiree', label: '🌙 Soirée' },
  { key: 'sport', label: '⚡ Sport' },
  { key: 'shopping', label: '🛍️ Shopping' },
  { key: 'libre', label: '☀️ Libre' },
]

const MENTON_EMBED = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d23108.246!2d7.5025!3d43.7762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sfr!4v1234567890'

export default function ActivitiesPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [babyFilter, setBabyFilter] = useState(false)
  const [addingTemplateId, setAddingTemplateId] = useState<string | null>(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customDayId, setCustomDayId] = useState<string | null>(null)
  const { days, activities: planningActivities, addActivity, fetchAll } = usePlanningStore()

  useEffect(() => {
    if (days.length === 0) fetchAll()
  }, [])

  const filtered = ACTIVITIES_LIBRARY.filter(a => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false
    if (babyFilter && !a.is_baby_friendly) return false
    return true
  })

  function handleAddToPlanning(template: ActivityTemplate, dayId: string) {
    addActivity(dayId, {
      title: template.title, description: template.description, emoji: template.emoji,
      category: template.category, time_slot: template.suggested_time_slot,
      duration_minutes: template.duration_minutes, location_name: template.location_name,
      location_url: template.location_url, is_baby_friendly: template.is_baby_friendly,
      sort_order: (planningActivities[dayId] || []).length, created_by: 'group', day_id: dayId, notes: '',
    })
    toast.success('Ajouté au planning ✓')
    setAddingTemplateId(null)
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <header
        className="relative overflow-hidden px-4 py-4 sticky top-0 z-40"
        style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}
      >
        <WaveBackground />
        <div className="relative flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">🗺️ Activités</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Idées & bibliothèque</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            {filtered.length} idées
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="overflow-x-auto no-scrollbar" style={{ borderBottom: '1px solid rgba(0,119,182,0.08)', background: 'white' }}>
        <div className="flex px-4 py-2.5 gap-2 min-w-max">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setCategoryFilter(f.key)}
              className="flex-shrink-0 h-8 px-3 rounded-full text-xs font-semibold transition-all"
              style={categoryFilter === f.key
                ? { background: '#0077B6', color: 'white' }
                : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }
              }
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setBabyFilter(!babyFilter)}
            className="flex-shrink-0 h-8 px-3 rounded-full text-xs font-semibold transition-all"
            style={babyFilter
              ? { background: '#F4D03F', color: '#1A1A2E' }
              : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }
            }
          >
            🍼 Bébé
          </button>
        </div>
      </div>

      {/* CTA custom */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setShowCustomModal(true)}
          className="w-full flex items-center gap-3 rounded-card px-4 py-3.5 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)', boxShadow: '0 4px 16px rgba(0,119,182,0.3)' }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <Plus size={20} className="text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm text-white">Créer une activité personnalisée</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Ajoute ta propre idée au planning</div>
          </div>
        </button>
      </div>

      {/* Map */}
      <div className="mx-4 mt-4 rounded-card overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,119,182,0.08)' }}>
        <iframe
          src={MENTON_EMBED}
          width="100%"
          height="180"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Carte de Menton"
        />
      </div>

      <div className="px-4 pt-5 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(26,26,46,0.4)' }}>
          Bibliothèque d'idées
        </p>
      </div>

      <div className="px-4 pb-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2 opacity-30">🔍</div>
            <p className="text-sm" style={{ color: 'rgba(26,26,46,0.4)' }}>Aucune activité pour ce filtre</p>
          </div>
        ) : (
          filtered.map(template => {
            const accent = CATEGORY_ACCENT[template.category] || '#90E0EF'
            return (
              <div
                key={template.id}
                className="bg-white rounded-card p-4 active:scale-[0.99] transition-transform"
                style={{ boxShadow: '0 2px 8px rgba(0,119,182,0.08)', borderLeft: `4px solid ${accent}` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: '#F0F4F8' }}
                  >
                    {template.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{template.title}</span>
                      {template.is_baby_friendly && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">🍼</span>
                      )}
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: 'rgba(26,26,46,0.5)' }}>{template.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs flex-wrap" style={{ color: 'rgba(26,26,46,0.4)' }}>
                      {template.location_name && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {template.location_name}
                        </span>
                      )}
                      {template.duration_minutes && (
                        <>
                          <span>·</span>
                          <span className="font-mono" style={{ fontFamily: 'var(--font-mono)' }}>
                            {formatDuration(template.duration_minutes)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {template.tags && template.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#F0F4F8', color: 'rgba(26,26,46,0.5)', border: '1px solid rgba(26,26,46,0.08)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setAddingTemplateId(template.id)}
                  className="w-full h-10 rounded-xl text-white font-semibold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5"
                  style={{ background: '#F4D03F', color: '#1A1A2E' }}
                >
                  <Plus size={15} />
                  Ajouter au planning
                </button>
              </div>
            )
          })
        )}
      </div>

      {addingTemplateId && (
        <DayPickerSheet
          days={days}
          title="Ajouter à quel jour ?"
          onSelect={(dayId) => {
            const template = ACTIVITIES_LIBRARY.find(a => a.id === addingTemplateId)
            if (template) handleAddToPlanning(template, dayId)
          }}
          onClose={() => setAddingTemplateId(null)}
        />
      )}

      {showCustomModal && !customDayId && (
        <DayPickerSheet
          days={days}
          title="Pour quel jour ?"
          onSelect={(dayId) => setCustomDayId(dayId)}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      {showCustomModal && customDayId && (
        <AddActivityModal
          dayId={customDayId}
          onAdd={(dayId, activity) => { addActivity(dayId, activity); toast.success('Activité ajoutée au planning ✓') }}
          onClose={() => { setShowCustomModal(false); setCustomDayId(null) }}
        />
      )}
    </div>
  )
}
