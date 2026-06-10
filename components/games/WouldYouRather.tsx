'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Shuffle } from 'lucide-react'
import { shuffleArray } from '@/lib/utils'
import { WOULD_YOU_RATHER } from '@/data/games'

const MAX_VOTERS = 4

export function WouldYouRather({ onBack }: { onBack: () => void }) {
  const [questions] = useState(() => shuffleArray(WOULD_YOU_RATHER))
  const [qIndex, setQIndex] = useState(0)
  const [votes, setVotes] = useState({ a: 0, b: 0 })
  const [totalVotes, setTotalVotes] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const q = questions[qIndex]
  const pctA = totalVotes > 0 ? Math.round((votes.a / totalVotes) * 100) : 50
  const pctB = 100 - pctA

  function vote(choice: 'a' | 'b') {
    if (revealed) return
    const next = totalVotes + 1
    setVotes(prev => ({ ...prev, [choice]: prev[choice] + 1 }))
    setTotalVotes(next)
    if (next >= MAX_VOTERS) setRevealed(true)
  }

  function next() {
    setQIndex(i => (i + 1) % questions.length)
    setVotes({ a: 0, b: 0 })
    setTotalVotes(0)
    setRevealed(false)
  }

  return (
    <div className="p-4 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-semibold text-xl flex-1">🤔 Tu préfères…</h2>
        <button
          onClick={next}
          aria-label="Passer la question"
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
        >
          <Shuffle size={16} />
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <span className="text-xs font-medium text-azure-600 bg-azure-50 px-3 py-1 rounded-full">
          {revealed ? 'Résultats !' : `${totalVotes}/${MAX_VOTERS} ont voté`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="space-y-3"
        >
          {/* Option A */}
          <button
            onClick={() => vote('a')}
            disabled={revealed}
            className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-azure-500 to-azure-600 text-white shadow-sm active:scale-[0.98] transition-all disabled:cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">A</span>
              <p className="font-semibold text-base leading-snug flex-1">{q.a}</p>
            </div>
            {revealed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                <div className="h-2 rounded-full bg-white/30 overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pctA}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-white/80 text-sm font-medium mt-1.5">{pctA}% — {votes.a} vote{votes.a !== 1 ? 's' : ''}</p>
              </motion.div>
            )}
          </button>

          {/* VS divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 tracking-widest">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Option B */}
          <button
            onClick={() => vote('b')}
            disabled={revealed}
            className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-sm active:scale-[0.98] transition-all disabled:cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">B</span>
              <p className="font-semibold text-base leading-snug flex-1">{q.b}</p>
            </div>
            {revealed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                <div className="h-2 rounded-full bg-white/30 overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pctB}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-white/80 text-sm font-medium mt-1.5">{pctB}% — {votes.b} vote{votes.b !== 1 ? 's' : ''}</p>
              </motion.div>
            )}
          </button>
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          {votes.a === votes.b ? (
            <p className="text-center text-sm text-gray-500 mb-4">⚖️ Égalité parfaite — débat en cours !</p>
          ) : (
            <p className="text-center text-sm text-gray-500 mb-4">
              {votes.a > votes.b ? `🔵 Option A l'emporte ${votes.a} vs ${votes.b}` : `🟠 Option B l'emporte ${votes.b} vs ${votes.a}`}
            </p>
          )}
          <button
            onClick={next}
            className="w-full h-12 rounded-xl bg-gray-900 text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Question suivante
            <ChevronRight size={18} />
          </button>
        </motion.div>
      )}

      {!revealed && (
        <p className="text-center text-xs text-gray-400 mt-6">
          Chaque personne tape son choix à tour de rôle, sans montrer l'écran aux autres 🤫
        </p>
      )}
    </div>
  )
}
