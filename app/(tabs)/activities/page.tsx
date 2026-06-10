'use client'

import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DayPickerSheet } from '@/components/planning/DayPickerSheet'
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
    <div>
      <PageHeader title="🗺️ Activités" subtitle="Bibliothèque d'idées" />

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

      <div className="mx-4 mt-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <iframe
          src={MENTON_EMBED}
          width="100%"
          height="200"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Carte de Menton"
        />
      </div>

      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-medium text-gray-500">Activités ({filtered.length})</p>
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
              <div key={template.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl mt-0.5">{template.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-gray-900">{template.title}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', style.bg, style.text)}>
                        {style.icon}
                      </span>
                      {template.is_baby_friendly && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full">🍼</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
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
                  className="w-full h-10 rounded-xl bg-azure-500 text-white font-medium text-sm active:scale-95 transition-transform"
                >
                  ＋ Ajouter au planning
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
    </div>
  )
}
