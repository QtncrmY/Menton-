'use client'

import { useState, useEffect } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DayPickerSheet } from '@/components/planning/DayPickerSheet'
import { AddActivityModal } from '@/components/planning/AddActivityModal'
import { ACTIVITIES_LIBRARY, CATEGORY_STYLES } from '@/data/activities-library'
import { usePlanningStore } from '@/store/planningStore'
import type { ActivityTemplate } from '@/types'
import { cn, formatDuration } from '@/lib/utils'
import { toast } from 'sonner'

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
      title: template.title,
      description: template.description,
      emoji: template.emoji,
      category: template.category,
      time_slot: template.suggested_time_slot,
      duration_minutes: template.duration_minutes,
      location_name: template.location_name,
      location_url: template.location_url,
      is_baby_friendly: template.is_baby_friendly,
      sort_order: (planningActivities[dayId] || []).length,
      created_by: 'group',
      day_id: dayId,
      notes: '',
    })
    toast.success('Ajouté au planning ✓')
    setAddingTemplateId(null)
  }

  return (
    <div className="pb-24">
      <PageHeader title="🗺️ Activités" subtitle="Idées & bibliothèque" />

      {/* Filters */}
      <div className="overflow-x-auto border-b border-gray-100 bg-white">
        <div className="flex px-4 py-2.5 gap-2 min-w-max">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setCategoryFilter(f.key)}
              className={cn(
                'flex-shrink-0 h-8 px-3 rounded-full text-sm font-medium transition-colors',
                categoryFilter === f.key ? 'bg-azure-500 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setBabyFilter(!babyFilter)}
            className={cn(
              'flex-shrink-0 h-8 px-3 rounded-full text-sm font-medium transition-colors',
              babyFilter ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'
            )}
          >
            🍼 Bébé
          </button>
        </div>
      </div>

      {/* "Créer une activité" prominent CTA */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setShowCustomModal(true)}
          className="w-full flex items-center gap-3 bg-gradient-to-r from-azure-500 to-azure-600 text-white rounded-2xl px-4 py-3.5 shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Plus size={20} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Créer une activité personnalisée</div>
            <div className="text-xs text-azure-100 mt-0.5">Ajoute ta propre idée au planning</div>
          </div>
        </button>
      </div>

      {/* Map */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
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

      <div className="px-4 pt-5 pb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Bibliothèque d'idées</p>
        <span className="text-xs text-gray-400">{filtered.length} activité{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="px-4 pb-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-gray-400">Aucune activité pour ce filtre</p>
          </div>
        ) : (
          filtered.map(template => {
            const style = CATEGORY_STYLES[template.category] || CATEGORY_STYLES.libre
            return (
              <div key={template.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-2xl">
                    {template.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{template.title}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', style.bg, style.text)}>
                        {style.icon}
                      </span>
                      {template.is_baby_friendly && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">🍼</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 flex-wrap">
                      {template.location_name && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {template.location_name}
                        </span>
                      )}
                      {template.duration_minutes && (
                        <>
                          <span>·</span>
                          <span>{formatDuration(template.duration_minutes)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {template.tags && template.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {template.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setAddingTemplateId(template.id)}
                  className="w-full h-10 rounded-xl bg-azure-500 text-white font-medium text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5"
                >
                  <Plus size={15} />
                  Ajouter au planning
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Day picker for library templates */}
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

      {/* Day picker for custom activity - step 1 */}
      {showCustomModal && !customDayId && (
        <DayPickerSheet
          days={days}
          title="Pour quel jour ?"
          onSelect={(dayId) => setCustomDayId(dayId)}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      {/* Custom activity creation - step 2 */}
      {showCustomModal && customDayId && (
        <AddActivityModal
          dayId={customDayId}
          onAdd={(dayId, activity) => {
            addActivity(dayId, activity)
            toast.success('Activité ajoutée au planning ✓')
          }}
          onClose={() => { setShowCustomModal(false); setCustomDayId(null) }}
        />
      )}
    </div>
  )
}
