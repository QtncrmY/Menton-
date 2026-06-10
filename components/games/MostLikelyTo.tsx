'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, ChevronRight } from 'lucide-react'
import { shuffleArray } from '@/lib/utils'
import { MOST_LIKELY_QUESTIONS } from '@/data/games'
import { cn } from '@/lib/utils'

const PLAYERS = ['Mathilde', 'Alexandre', 'Quentin', 'Sophie']
const AVATAR_COLORS: Record<string, string> = {
  Mathilde: 'bg-pink-400',
  Alexandre: 'bg-blue-400',
  Quentin: 'bg-emerald-400',
  Sophie: 'bg-amber-400',
}

export function MostLikelyTo({ onBack }: { onBack: () => void }) {
  const [questions] = useState(() => shuffleArray(MOST_LIKELY_QUESTIONS).slice(0, 10))
  const [qIndex, setQIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PLAYERS.map(p => [p, 0]))
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function vote(player: string) {
    if (selected) return
    setSelected(player)
    setScores(prev => ({ ...prev, [player]: prev[player] + 1 }))
  }

  function next() {
    if (qIndex >= questions.length - 1) {
      setDone(true)
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
    }
  }

  function reset() {
    setQIndex(0)
    setScores(Object.fromEntries(PLAYERS.map(p => [p, 0])))
    setSelected(null)
    setDone(false)
  }

  if (done) {
    const sorted = [...PLAYERS].sort((a, b) => scores[b] - scores[a])
    const medals = ['🥇', '🥈', '🥉', '4️⃣']
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-semibold text-xl">👆 Résultats</h2>
        </div>
        <p className="text-gray-500 text-sm text-center mb-5">Le plus souvent désigné par le groupe</p>
        <div className="space-y-3 mb-6">
          {sorted.map((player, i) => (
            <motion.div
              key={player}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{medals[i]}</span>
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0', AVATAR_COLORS[player])}>
                {player[0]}
              </div>
              <span className="flex-1 font-semibold text-gray-900">{player}</span>
              <span className="font-bold text-azure-600">{scores[player]} fois</span>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ArrowLeft size={16} /> Retour
          </button>
          <button onClick={reset} className="flex-1 h-12 rounded-xl bg-azure-500 text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <RotateCcw size={16} /> Rejouer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-semibold text-xl">👆 Qui dans le groupe ?</h2>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-azure-500 rounded-full transition-all duration-300"
            style={{ width: `${(qIndex / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{qIndex + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="bg-gradient-to-br from-azure-50 to-white rounded-2xl p-5 border border-azure-100 mb-5 min-h-[100px] flex items-center justify-center"
        >
          <p className="text-lg font-semibold text-gray-900 leading-snug text-center">{questions[qIndex]}</p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {PLAYERS.map(player => (
          <button
            key={player}
            onClick={() => vote(player)}
            disabled={!!selected}
            className={cn(
              'flex items-center gap-2.5 p-4 rounded-2xl border-2 transition-all',
              selected === player
                ? 'border-azure-500 bg-azure-50 scale-95'
                : selected
                ? 'border-gray-100 bg-gray-50 opacity-40'
                : 'border-gray-200 bg-white active:scale-95'
            )}
          >
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0', AVATAR_COLORS[player])}>
              {player[0]}
            </div>
            <span className="font-medium text-gray-900 text-sm">{player}</span>
            {selected === player && <span className="ml-auto">👈</span>}
          </button>
        ))}
      </div>

      {selected && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={next}
          className="w-full h-12 rounded-xl bg-azure-500 text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {qIndex >= questions.length - 1 ? 'Voir les résultats 🏆' : 'Question suivante'}
          <ChevronRight size={18} />
        </motion.button>
      )}
    </div>
  )
}
