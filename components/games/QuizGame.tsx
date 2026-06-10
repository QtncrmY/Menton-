'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, RotateCcw, ArrowLeft } from 'lucide-react'
import { QUIZ_QUESTIONS } from '@/data/games'
import { shuffleArray } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/types'

interface QuizGameProps {
  onBack: () => void
}

type Phase = 'setup' | 'playing' | 'result'

export function QuizGame({ onBack }: QuizGameProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<string[]>([''])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentQ = questions[currentQIndex]
  const validPlayers = players.filter(p => p.trim())
  const currentPlayer = validPlayers[currentPlayerIndex] || validPlayers[0]

  useEffect(() => {
    if (phase !== 'playing' || selectedAnswer !== null) return
    setTimeLeft(15)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleAnswer(-1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, currentQIndex, selectedAnswer])

  function startQuiz() {
    if (validPlayers.length === 0) return
    const initScores: Record<string, number> = {}
    validPlayers.forEach(p => { initScores[p] = 0 })
    setScores(initScores)
    setQuestions(shuffleArray(QUIZ_QUESTIONS).slice(0, 10))
    setCurrentQIndex(0)
    setCurrentPlayerIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setPhase('playing')
  }

  function handleAnswer(answerIndex: number) {
    if (selectedAnswer !== null) return
    if (timerRef.current) clearInterval(timerRef.current)
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === currentQ.correct) {
      const player = validPlayers[currentPlayerIndex]
      setScores(prev => ({ ...prev, [player]: (prev[player] || 0) + 1 }))
    }

    setTimeout(() => {
      if (currentQIndex >= questions.length - 1) {
        setPhase('result')
      } else {
        setCurrentQIndex(i => i + 1)
        setCurrentPlayerIndex(i => (i + 1) % validPlayers.length)
        setSelectedAnswer(null)
        setShowExplanation(false)
      }
    }, 2500)
  }

  const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const medals = ['🥇', '🥈', '🥉', '💔']

  if (phase === 'setup') {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display text-2xl">🧠 Quiz Côte d&apos;Azur</h2>
        </div>
        <p className="text-gray-500 text-sm mb-4">10 questions sur Menton, Monaco, Nice et la Côte d&apos;Azur. Qui sera le champion ?</p>

        <div className="space-y-2 mb-4">
          {players.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={p}
                onChange={e => setPlayers(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                placeholder={`Joueur ${i + 1}`}
                className="flex-1 h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-azure-300"
              />
              {players.length > 1 && (
                <button
                  onClick={() => setPlayers(prev => prev.filter((_, j) => j !== i))}
                  aria-label="Supprimer ce joueur"
                  className="w-11 h-11 rounded-xl bg-red-50 text-red-400 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {players.length < 6 && (
          <button
            onClick={() => setPlayers(prev => [...prev, ''])}
            className="w-full h-10 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm flex items-center justify-center gap-1.5 mb-4"
          >
            <Plus size={14} /> Ajouter un joueur
          </button>
        )}

        <button
          onClick={startQuiz}
          disabled={validPlayers.length === 0}
          className="w-full h-12 rounded-xl bg-azure-500 text-white font-semibold disabled:opacity-50 active:scale-95 transition-transform"
        >
          Démarrer le quiz 🧠
        </button>
      </div>
    )
  }

  if (phase === 'playing' && currentQ) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Question {currentQIndex + 1}/10</span>
          <div className={cn('text-lg font-bold tabular-nums', timeLeft <= 5 ? 'text-red-500' : 'text-azure-600')}>
            {timeLeft}s
          </div>
        </div>

        <div className="h-1.5 bg-gray-200 rounded-full mb-4">
          <motion.div
            className="h-full bg-azure-500 rounded-full"
            animate={{ width: `${((currentQIndex) / 10) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="bg-azure-50 rounded-xl p-3 mb-4 flex items-center gap-2">
          <span className="text-sm font-medium text-azure-700">Tour de</span>
          <span className="font-semibold text-azure-900">{currentPlayer}</span>
          <span>🎯</span>
        </div>

        <h3 className="font-display text-xl text-gray-900 mb-5 leading-snug">{currentQ.question}</h3>

        <div className="space-y-2">
          {currentQ.options.map((option, i) => {
            let btnClass = 'bg-white border-gray-200 text-gray-900'
            if (selectedAnswer !== null) {
              if (i === currentQ.correct) btnClass = 'bg-emerald-100 border-emerald-400 text-emerald-900'
              else if (i === selectedAnswer) btnClass = 'bg-red-100 border-red-400 text-red-900'
              else btnClass = 'bg-gray-50 border-gray-200 text-gray-400'
            }
            return (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                whileTap={{ scale: selectedAnswer === null ? 0.97 : 1 }}
                className={cn('w-full min-h-[48px] px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-colors', btnClass)}
              >
                <span className="text-gray-400 mr-2">{['A', 'B', 'C', 'D'][i]}</span>
                {option}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {showExplanation && currentQ.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-sand-100 rounded-xl border border-sand-200"
            >
              <p className="text-sm text-gray-600 italic">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="p-4">
        <h2 className="font-display text-3xl text-center mb-2">🏆 Podium !</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Résultats du Quiz Côte d&apos;Azur</p>

        <div className="space-y-3 mb-6">
          {sortedPlayers.map(([player, score], i) => (
            <motion.div
              key={player}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{medals[i] || '🎮'}</span>
              <span className="flex-1 font-semibold text-gray-900">{player}</span>
              <span className="font-bold text-azure-600 tabular-nums text-lg">{score}/10</span>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <button
            onClick={() => { setPhase('setup'); setPlayers(['']) }}
            className="flex-1 h-12 rounded-xl bg-azure-500 text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <RotateCcw size={16} /> Rejouer
          </button>
        </div>
      </div>
    )
  }

  return null
}
