'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { ACTIVITIES_LIBRARY, CATEGORY_LABELS } from '@/data/activities-library'
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

const CATEGORY_ACCENT: Record<string, string> = {
  plage: '#0077B6', restaurant: '#E76F51', visite: '#7B2D8B',
  day_trip: '#2D8B4A', soiree: '#1A1A2E', sport: '#E76F51',
  shopping: '#F4A261', libre: '#90E0EF', transport: '#6B7280',
}

const EMOJI_PICKER = ['🏖️', '🍽️', '🏛️', '🚗', '⚡', '🎮', '🥂', '📍', '🌅', '🍋', '🎨', '🛥️']

const TIME_SLOTS = ['Matin', 'Après-midi', 'Soirée', 'Journée', 'Matin-Après-midi', 'Fin d\'après-midi']

const DURATIONS = [
  { label: '30 min', value: 30 }, { label: '1h', value: 60 }, { label: '1h30', value: 90 },
  { label: '2h', value: 120 }, { label: '3h', value: 180 }, { label: 'Demi-journée', value: 240 },
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
    onAdd(dayId, {
      title: template.title, description: template.description, emoji: template.emoji,
      category: template.category, time_slot: template.suggested_time_slot,
      duration_minutes: template.duration_minutes, location_name: template.location_name,
      location_url: template.location_url, is_baby_friendly: template.is_baby_friendly,
      notes: '', sort_order: 0, created_by: 'group', day_id: dayId,
    })
    toast.success('Activité ajoutée ✓')
    onClose()
  }

  function handleCustomSubmit() {
    if (!title.trim()) { toast.error('Le titre est obligatoire'); return }
    if (editActivity && onUpdate) {
      onUpdate({ ...editActivity, title: title.trim(), emoji, category, time_slot: timeSlot || undefined, duration_minutes: duration, notes: notes || undefined, is_baby_friendly: isBabyFriendly })
      toast.success('Activité modifiée ✓')
    } else {
      onAdd(dayId, { title: title.trim(), emoji, category, time_slot: timeSlot || undefined, duration_minutes: duration, notes: notes || undefined, is_baby_friendly: isBabyFriendly, sort_order: 0, created_by: 'group', day_id: dayId })
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
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <motion.div
          className="relative w-full bg-white flex flex-col"
          style={{ maxHeight: '85dvh', borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
          exit={{ y: '100%', transition: { duration: 0.2 } }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(26,26,46,0.15)' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,119,182,0.08)' }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: '#1A1A2E' }}>
              {editActivity ? 'Modifier l\'activité' : 'Ajouter une activité'}
            </h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ background: '#F0F4F8', color: '#1A1A2E' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Tab switcher (pill style) */}
          {!editActivity && (
            <div className="flex gap-2 px-4 py-3 flex-shrink-0">
              {(['library', 'custom'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 text-sm font-semibold rounded-full transition-all"
                  style={tab === t
                    ? { background: '#0077B6', color: '#fff' }
                    : { background: 'transparent', color: 'rgba(26,26,46,0.5)' }
                  }
                >
                  {t === 'library' ? 'Bibliothèque' : 'Créer'}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {/* Library tab */}
            {tab === 'library' && (
              <div>
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                  {CATEGORY_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setCategoryFilter(f.key)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={categoryFilter === f.key
                        ? { background: '#0077B6', color: '#fff' }
                        : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }
                      }
                    >
                      {f.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setBabyFilter(!babyFilter)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={babyFilter
                      ? { background: '#F4D03F', color: '#1A1A2E' }
                      : { background: '#F0F4F8', color: 'rgba(26,26,46,0.6)' }
                    }
                  >
                    🍼 Bébé
                  </button>
                </div>

                <div className="px-4 pb-6 space-y-2">
                  {filteredLibrary.length === 0 ? (
                    <p className="text-center py-8 text-sm" style={{ color: 'rgba(26,26,46,0.4)' }}>Aucune activité pour ce filtre</p>
                  ) : (
                    filteredLibrary.map(template => {
                      const accent = CATEGORY_ACCENT[template.category] || '#90E0EF'
                      return (
                        <div
                          key={template.id}
                          className="rounded-xl p-3 flex items-start gap-3"
                          style={{ background: '#F0F4F8' }}
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ background: '#FAF3E0' }}
                          >
                            {template.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{template.title}</p>
                                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'rgba(26,26,46,0.5)' }}>
                                  {template.description}
                                </p>
                              </div>
                              <button
                                onClick={() => addFromLibrary(template)}
                                className="flex-shrink-0 flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold transition-all active:scale-95"
                                style={{ border: `1.5px solid ${accent}`, color: accent, background: 'white' }}
                              >
                                <Plus size={12} />
                                Ajouter
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* Custom tab */}
            {tab === 'custom' && (
              <div className="px-4 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,26,46,0.5)' }}>Titre *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex : Plage des Sablettes"
                    className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#F0F4F8', color: '#1A1A2E', border: '2px solid transparent' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(0,119,182,0.3)')}
                    onBlur={e => (e.target.style.borderColor = 'transparent')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,26,46,0.5)' }}>Emoji</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOJI_PICKER.map(e => (
                      <button
                        key={e}
                        onClick={() => setEmoji(e)}
                        className="w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all active:scale-95"
                        style={emoji === e
                          ? { background: 'rgba(0,119,182,0.1)', outline: '2px solid #0077B6' }
                          : { background: '#F0F4F8' }
                        }
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,26,46,0.5)' }}>Catégorie</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Category)}
                    className="w-full h-12 px-4 rounded-xl text-sm outline-none appearance-none"
                    style={{ background: '#F0F4F8', color: '#1A1A2E', border: 'none' }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,26,46,0.5)' }}>Créneau horaire</label>
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-sm outline-none appearance-none"
                    style={{ background: '#F0F4F8', color: '#1A1A2E', border: 'none' }}
                  >
                    <option value="">Non défini</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,26,46,0.5)' }}>Durée</label>
                  <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl text-sm outline-none appearance-none"
                    style={{ background: '#F0F4F8', color: '#1A1A2E', border: 'none' }}
                  >
                    {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,26,46,0.5)' }}>Notes (optionnel)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Infos pratiques, liens, remarques..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                    style={{ background: '#F0F4F8', color: '#1A1A2E', border: 'none' }}
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>Baby-friendly 🍼</span>
                  <button
                    onClick={() => setIsBabyFriendly(!isBabyFriendly)}
                    className="w-12 h-6 rounded-full transition-colors relative"
                    style={{ background: isBabyFriendly ? '#0077B6' : '#E2E8F0' }}
                    aria-label={isBabyFriendly ? 'Baby-friendly activé' : 'Baby-friendly désactivé'}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                      style={{ transform: isBabyFriendly ? 'translateX(1.5rem)' : 'translateX(0.125rem)' }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {tab === 'custom' && (
            <div
              className="flex gap-3 px-4 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(0,119,182,0.08)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: '#F0F4F8', color: '#1A1A2E' }}
              >
                Annuler
              </button>
              <button
                onClick={handleCustomSubmit}
                className="flex-1 h-12 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                style={{ background: '#0077B6' }}
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
