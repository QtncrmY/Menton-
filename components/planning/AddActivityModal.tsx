'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { ACTIVITIES_LIBRARY, CATEGORY_LABELS, CATEGORY_STYLES } from '@/data/activities-library'
import type { Activity, ActivityTemplate, Category, NewActivity } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const CATEGORY_FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'plage', label: '🏖️ Plage' },
  { key: 'visite', label: '🏛️ Visite' },
  { key: 'day_trip', label: '🎰 Day trip' },
  { key: 'soiree', label: '🌙 Soirée' },
  { key: 'sport', label: '⚡ Sport' },
  { key: 'shopping', label: '🛍️ Shopping' },
]

const EMOJI_PICKER = ['🏖️', '🍽️', '🏛️', '🚗', '⚡', '🎮', '🥂', '📍', '🌅', '🍋']

const TIME_SLOTS = ['Matin', 'Après-midi', 'Soirée', 'Journée', 'Matin-Après-midi', 'Fin d\'après-midi']

const DURATIONS = [
  { label: '30 min', value: 30 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
  { label: '3h', value: 180 },
  { label: 'Demi-journée', value: 240 },
  { label: 'Journée', value: 480 },
]

const CATEGORIES: Category[] = ['plage', 'restaurant', 'visite', 'day_trip', 'soiree', 'sport', 'shopping', 'libre', 'transport']

interface AddActivityModalProps {
  dayId: string
  onAdd: (dayId: string, activity: NewActivity) => void
  onClose: () => void
  editActivity?: Activity
  onUpdate?: (activity: Activity) => void
}

export function AddActivityModal({ dayId, onAdd, onClose, editActivity, onUpdate }: AddActivityModalProps) {
  const [tab, setTab] = useState<'library' | 'custom'>(editActivity ? 'custom' : 'library')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [babyFilter, setBabyFilter] = useState(false)

  const [title, setTitle] = useState(editActivity?.title || '')
  const [emoji, setEmoji] = useState(editActivity?.emoji || '📍')
  const [category, setCategory] = useState<Category>(editActivity?.category || 'libre')
  const [timeSlot, setTimeSlot] = useState(editActivity?.time_slot || '')
  const [duration, setDuration] = useState<number>(editActivity?.duration_minutes || 60)
  const [notes, setNotes] = useState(editActivity?.notes || '')
  const [isBabyFriendly, setIsBabyFriendly] = useState(editActivity?.is_baby_friendly ?? true)

  const filteredLibrary = ACTIVITIES_LIBRARY.filter(a => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false
    if (babyFilter && !a.is_baby_friendly) return false
    return true
  })

  function addFromLibrary(template: ActivityTemplate) {
    const activity: NewActivity = {
      title: template.title,
      description: template.description,
      emoji: template.emoji,
      category: template.category,
      time_slot: template.suggested_time_slot,
      duration_minutes: template.duration_minutes,
      location_name: template.location_name,
      location_url: template.location_url,
      is_baby_friendly: template.is_baby_friendly,
      notes: '',
      sort_order: 0,
      created_by: 'group',
      day_id: dayId,
    }
    onAdd(dayId, activity)
    toast.success('Activité ajoutée ✓')
    onClose()
  }

  function handleCustomSubmit() {
    if (!title.trim()) {
      toast.error('Le titre est obligatoire')
      return
    }

    if (editActivity && onUpdate) {
      onUpdate({
        ...editActivity,
        title: title.trim(),
        emoji,
        category,
        time_slot: timeSlot || undefined,
        duration_minutes: duration,
        notes: notes || undefined,
        is_baby_friendly: isBabyFriendly,
      })
      toast.success('Activité modifiée ✓')
    } else {
      const activity: NewActivity = {
        title: title.trim(),
        emoji,
        category,
        time_slot: timeSlot || undefined,
        duration_minutes: duration,
        notes: notes || undefined,
        is_baby_friendly: isBabyFriendly,
        sort_order: 0,
        created_by: 'group',
        day_id: dayId,
      }
      onAdd(dayId, activity)
      toast.success('Activité ajoutée ✓')
    }
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <motion.div
          className="relative w-full bg-white rounded-t-3xl flex flex-col"
          style={{ maxHeight: '92vh' }}
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
          exit={{ y: '100%', transition: { duration: 0.2 } }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <h2 className="font-semibold text-gray-900">
              {editActivity ? 'Modifier l\'activité' : 'Ajouter une activité'}
            </h2>
            <button onClick={onClose} aria-label="Fermer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
              <X size={16} />
            </button>
          </div>

          {!editActivity && (
            <div className="flex border-b border-gray-100 flex-shrink-0">
              <button
                onClick={() => setTab('library')}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium transition-colors',
                  tab === 'library' ? 'text-azure-600 border-b-2 border-azure-500' : 'text-gray-500'
                )}
              >
                Bibliothèque
              </button>
              <button
                onClick={() => setTab('custom')}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium transition-colors',
                  tab === 'custom' ? 'text-azure-600 border-b-2 border-azure-500' : 'text-gray-500'
                )}
              >
                Créer
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {tab === 'library' && (
              <div>
                <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
                  {CATEGORY_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setCategoryFilter(f.key)}
                      className={cn(
                        'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                        categoryFilter === f.key
                          ? 'bg-azure-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setBabyFilter(!babyFilter)}
                    className={cn(
                      'flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      babyFilter ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    🍼 Bébé
                  </button>
                </div>

                <div className="px-4 pb-4 space-y-3">
                  {filteredLibrary.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">Aucune activité pour ce filtre</p>
                  ) : (
                    filteredLibrary.map(template => (
                      <div key={template.id} className="bg-sand-50 rounded-xl p-3 border border-sand-200">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xl">{template.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm">{template.title}</div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{template.description}</p>
                          </div>
                          {template.is_baby_friendly && <span className="text-sm">🍼</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {template.tags?.map(tag => (
                            <span key={tag} className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">{tag}</span>
                          ))}
                        </div>
                        <button
                          onClick={() => addFromLibrary(template)}
                          className="w-full h-9 rounded-lg bg-azure-500 text-white text-sm font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                        >
                          <Plus size={14} />
                          Ajouter
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'custom' && (
              <div className="px-4 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex : Plage des Sablettes"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azure-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Emoji</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOJI_PICKER.map(e => (
                      <button
                        key={e}
                        onClick={() => setEmoji(e)}
                        className={cn(
                          'w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all',
                          emoji === e ? 'bg-azure-100 ring-2 ring-azure-400' : 'bg-gray-100'
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Category)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-azure-300"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Créneau horaire</label>
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-azure-300"
                  >
                    <option value="">Non défini</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Durée estimée</label>
                  <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-azure-300"
                  >
                    {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optionnel)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Infos pratiques, liens, remarques..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azure-300 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-gray-700">Baby-friendly 🍼</span>
                  <button
                    onClick={() => setIsBabyFriendly(!isBabyFriendly)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      isBabyFriendly ? 'bg-azure-500' : 'bg-gray-200'
                    )}
                    aria-label={isBabyFriendly ? 'Baby-friendly activé' : 'Baby-friendly désactivé'}
                  >
                    <div className={cn(
                      'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                      isBabyFriendly ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {tab === 'custom' && (
            <div className="flex gap-3 px-4 py-4 border-t border-gray-100 flex-shrink-0" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-medium active:scale-95 transition-transform"
              >
                Annuler
              </button>
              <button
                onClick={handleCustomSubmit}
                className="flex-1 h-12 rounded-xl bg-azure-500 text-white font-medium active:scale-95 transition-transform"
              >
                {editActivity ? 'Modifier ✓' : 'Ajouter ✓'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
