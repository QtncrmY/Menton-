'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Day } from '@/types'

interface DayPickerSheetProps {
  days: Day[]
  onSelect: (dayId: string) => void
  onClose: () => void
  excludeDayId?: string
  title?: string
}

export function DayPickerSheet({ days, onSelect, onClose, excludeDayId, title }: DayPickerSheetProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <motion.div
          className="relative w-full bg-white rounded-t-3xl pb-safe overflow-hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }}
          exit={{ y: '100%', transition: { duration: 0.2 } }}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              {title || 'Déplacer vers quel jour ?'}
            </h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {days
              .filter(d => d.id !== excludeDayId)
              .map(day => (
                <button
                  key={day.id}
                  onClick={() => { onSelect(day.id); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-sand-50 active:bg-sand-100 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-2xl">{day.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{day.label}</div>
                    {day.description && (
                      <div className="text-xs text-gray-500">{day.description}</div>
                    )}
                  </div>
                  {day.is_arrival && (
                    <span className="ml-auto text-xs bg-azure-100 text-azure-700 px-2 py-0.5 rounded-full">Arrivée</span>
                  )}
                  {day.is_departure && (
                    <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Départ</span>
                  )}
                </button>
              ))}
          </div>

          <div className="p-4">
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
