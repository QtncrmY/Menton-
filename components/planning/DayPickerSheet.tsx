'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'
import type { Day } from '@/types'

interface DayPickerSheetProps {
  days: Day[]
  onSelect: (dayId: string) => void
  onClose: () => void
  excludeDayId?: string
  title?: string
}

export function DayPickerSheet({ days, onSelect, onClose, excludeDayId, title }: DayPickerSheetProps) {
  const availableDays = days.filter(d => d.id !== excludeDayId)

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
          style={{ maxHeight: '75vh', borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
          exit={{ y: '100%', transition: { duration: 0.2 } }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(26,26,46,0.15)' }} />
          </div>

          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(0,119,182,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={17} style={{ color: '#0077B6' }} />
              <h2 className="font-display text-lg font-semibold" style={{ color: '#1A1A2E' }}>
                {title || 'Déplacer vers quel jour ?'}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ background: '#F0F4F8', color: '#1A1A2E' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Day list */}
          <div className="overflow-y-auto flex-1">
            {availableDays.length === 0 ? (
              <div className="py-10 text-center text-sm" style={{ color: 'rgba(26,26,46,0.4)' }}>
                Chargement des jours...
              </div>
            ) : (
              availableDays.map(day => (
                <button
                  key={day.id}
                  onClick={() => { onSelect(day.id); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors"
                  style={{ borderBottom: '1px solid rgba(0,119,182,0.06)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(0,119,182,0.04)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'rgba(0,119,182,0.06)' }}
                  >
                    {day.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: '#1A1A2E' }}>{day.label}</div>
                    {day.description && (
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(26,26,46,0.5)' }}>{day.description}</div>
                    )}
                  </div>
                  {day.is_arrival && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(0,119,182,0.1)', color: '#0077B6' }}>
                      Arrivée
                    </span>
                  )}
                  {day.is_departure && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(231,111,81,0.1)', color: '#E76F51' }}>
                      Départ
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="px-4 pt-3 flex-shrink-0" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: '#F0F4F8', color: '#1A1A2E' }}
            >
              Annuler
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
