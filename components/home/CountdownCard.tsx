'use client'

import { motion } from 'framer-motion'
import { getDaysUntil } from '@/lib/utils'

const DEPARTURE = '2026-06-27'
const ARRIVAL_END = '2026-07-04'

export function CountdownCard() {
  const daysUntil = getDaysUntil(DEPARTURE)
  const daysUntilEnd = getDaysUntil(ARRIVAL_END)
  const isOnVoyage = daysUntil <= 0 && daysUntilEnd >= 0
  const isAfter = daysUntilEnd < 0

  let gradient = 'from-azure-600 to-azure-400'
  let emoji = '✈️'
  let label = ''
  let number = 0
  let sublabel = ''

  if (isAfter) {
    gradient = 'from-purple-600 to-purple-400'
    emoji = '💭'
    label = 'Un souvenir inoubliable'
    sublabel = 'Menton 2026 — 27 juin au 4 juillet'
  } else if (isOnVoyage) {
    gradient = 'from-emerald-600 to-emerald-400'
    emoji = '🌊'
    const dayNumber = Math.abs(daysUntil) + 1
    number = dayNumber
    label = `Jour ${dayNumber} du voyage`
    sublabel = 'On est à Menton ! 🎉'
  } else {
    number = daysUntil
    label = `jour${daysUntil > 1 ? 's' : ''} avant le départ`
    sublabel = '📅 Samedi 27 juin 2026'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          {isAfter ? (
            <div className="font-display text-2xl">{label}</div>
          ) : (
            <>
              <div className="text-sm font-medium text-white/80 mb-1">{emoji} {isOnVoyage ? '' : 'Départ dans'}</div>
              <div className="font-display text-6xl font-normal leading-none">{number}</div>
              <div className="text-lg font-medium mt-1">{label}</div>
            </>
          )}
          <div className="text-sm text-white/70 mt-2">{sublabel}</div>
        </div>
        <div className="text-5xl opacity-80">{emoji}</div>
      </div>
    </motion.div>
  )
}
