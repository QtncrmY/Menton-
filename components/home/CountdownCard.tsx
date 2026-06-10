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

  let bg = 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)'
  let emoji = '✈️'
  let topLabel = 'Départ dans'
  let number = daysUntil
  let bottomLabel = `jour${daysUntil > 1 ? 's' : ''}`
  let sublabel = 'Sam 27 juin 2026'

  if (isAfter) {
    bg = 'linear-gradient(135deg, #7B2D8B 0%, #9B59B6 100%)'
    emoji = '💭'
    topLabel = ''
    bottomLabel = ''
    sublabel = 'Menton 2026 — 27 juin au 4 juillet'
  } else if (isOnVoyage) {
    bg = 'linear-gradient(135deg, #2D8B4A 0%, #27AE60 100%)'
    emoji = '🌊'
    const dayNumber = Math.abs(daysUntil) + 1
    number = dayNumber
    topLabel = ''
    bottomLabel = `Jour ${dayNumber} du voyage`
    sublabel = 'On est à Menton ! 🎉'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-card overflow-hidden relative"
      style={{ background: bg, boxShadow: '0 4px 20px rgba(0,119,182,0.25)' }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            {isAfter ? (
              <p className="font-display text-2xl italic font-semibold text-white">Un souvenir inoubliable</p>
            ) : (
              <>
                {topLabel && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">{emoji} {topLabel}</p>
                )}
                <motion.p
                  className="font-display leading-none text-white"
                  style={{ fontSize: '4rem', fontWeight: 600 }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {number}
                </motion.p>
                <p className="text-lg font-semibold text-white mt-1">{bottomLabel}</p>
              </>
            )}
            <p className="text-sm text-white/60 mt-2">{sublabel}</p>
          </div>
          <div className="text-5xl opacity-20">{emoji}</div>
        </div>
      </div>
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '24px', opacity: 0.15 }}>
        <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,12 C100,20 200,4 300,12 C350,16 375,8 400,12 L400,24 L0,24 Z" fill="white" />
        </svg>
      </div>
    </motion.div>
  )
}
