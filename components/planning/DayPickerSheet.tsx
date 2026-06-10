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
          className="relative w-full bg-white rounded-t-3xl flex flex-col"
          style={{ maxHeight: '75vh' }}
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
          exit={{ y: '100%', transition: { duration: 0.2 } }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-azure-500" />
              <h2 className="font-semibold text-gray-900">
                {title || 'Déplacer vers quel jour ?'}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:bg-gray-200"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {availableDays.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Chargement des jours...</div>
            ) : (
              availableDays.map(day => (
                <button
                  key={day.id}
                  onClick={() => { onSelect(day.id); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-azure-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-2xl w-9 text-center">{day.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{day.label}</div>
                    {day.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{day.description}</div>
                    )}
                  </div>
                  {day.is_arrival && (
                    <span className="text-xs bg-azure-100 text-azure-700 px-2 py-0.5 rounded-full flex-shrink-0">Arrivée</span>
                  )}
                  {day.is_departure && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex-shrink-0">Départ</span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="px-4 pt-3 flex-shrink-0" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-gray-100 text-gray-700 font-medium active:scale-95 transition-transform"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
