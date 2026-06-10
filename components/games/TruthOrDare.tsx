'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { VERITE_SOFT, DEFI_SOFT, VERITE_MEDIUM, DEFI_MEDIUM } from '@/data/games'
import { shuffleArray } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { GameCard, GameLevel } from '@/types'

interface TruthOrDareProps {
  onBack: () => void
}

type Phase = 'setup' | 'roulette' | 'card'

export function TruthOrDare({ onBack }: TruthOrDareProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState(['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4'])
  const [level, setLevel] = useState<GameLevel>('soft')
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [cardType, setCardType] = useState<'truth' | 'dare' | null>(null)
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set())
  const [deck, setDeck] = useState<{ truth: GameCard[]; dare: GameCard[] }>({ truth: [], dare: [] })
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayedPlayer, setDisplayedPlayer] = useState('')

  const validPlayers = players.filter(p => p.trim())
  const currentPlayer = validPlayers[currentPlayerIndex] || ''
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  function start() {
    if (validPlayers.length < 2) return
    const initScores: Record<string, number> = {}
    validPlayers.forEach(p => { initScores[p] = 0 })
    setScores(initScores)

    const truthCards = level === 'soft'
      ? shuffleArray([...VERITE_SOFT])
      : shuffleArray([...VERITE_SOFT, ...VERITE_MEDIUM])
    const dareCards = level === 'soft'
      ? shuffleArray([...DEFI_SOFT])
      : shuffleArray([...DEFI_SOFT, ...DEFI_MEDIUM])

    setDeck({ truth: truthCards, dare: dareCards })
    setUsedIds(new Set())
    setCurrentPlayerIndex(0)
    spinRoulette(validPlayers, 0)
  }

  function spinRoulette(playerList: string[], targetIndex: number) {
    setPhase('roulette')
    setCardType(null)
    setCurrentCard(null)
    setIsSpinning(true)

    let count = 0
    const totalSpins = 12 + Math.floor(Math.random() * 8)
    const interval = setInterval(() => {
      count++
      setDisplayedPlayer(playerList[count % playerList.length])
      if (count >= totalSpins) {
        clearInterval(interval)
        setCurrentPlayerIndex(targetIndex)
        setDisplayedPlayer(playerList[targetIndex])
        setIsSpinning(false)
      }
    }, 100)
  }

  function drawCard(type: 'truth' | 'dare') {
    setCardType(type)
    const pool = type === 'truth' ? deck.truth : deck.dare
    const available = pool.filter(c => !usedIds.has(c.id))

    let card: GameCard
    if (available.length === 0) {
      const freshDeck = type === 'truth'
        ? (level === 'soft' ? shuffleArray([...VERITE_SOFT]) : shuffleArray([...VERITE_SOFT, ...VERITE_MEDIUM]))
        : (level === 'soft' ? shuffleArray([...DEFI_SOFT]) : shuffleArray([...DEFI_SOFT, ...DEFI_MEDIUM]))
      card = freshDeck[0]
      setUsedIds(new Set([card.id]))
      setDeck(prev => ({ ...prev, [type]: freshDeck }))
    } else {
      card = available[0]
      setUsedIds(prev => new Set([...prev, card.id]))
    }
    setCurrentCard(card)
    setPhase('card')
  }

  function nextTurn(success?: boolean) {
    if (success && cardType === 'dare') {
      const player = validPlayers[currentPlayerIndex]
      setScores(prev => ({ ...prev, [player]: (prev[player] || 0) + 1 }))
    }
    const nextIndex = (currentPlayerIndex + 1) % validPlayers.length
    spinRoulette(validPlayers, nextIndex)
  }

  if (phase === 'setup') {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-display text-2xl">🎭 Vérité ou Défi</h2>
        </div>

        <div className="space-y-2 mb-5">
          {players.map((p, i) => (
            <input
              key={i}
              type="text"
              value={p}
              onChange={e => setPlayers(prev => prev.map((x, j) => j === i ? e.target.value : x))}
              placeholder={`Joueur ${i + 1}`}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-azure-300"
            />
          ))}
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Niveau</p>
          <div className="flex gap-2">
            {([['soft', '🐥 Soft'], ['medium', '🌶️ Medium']] as [GameLevel, string][]).map(([l, label]) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  'flex-1 h-10 rounded-xl text-sm font-medium transition-colors',
                  level === l ? 'bg-azure-500 text-white' : 'bg-gray-100 text-gray-600'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={start}
          disabled={validPlayers.length < 2}
          className="w-full h-12 rounded-xl bg-azure-500 text-white font-semibold disabled:opacity-50 active:scale-95 transition-transform"
        >
          Commencer 🎡
        </button>
      </div>
    )
  }

  if (phase === 'roulette') {
    return (
      <div className="p-4 flex flex-col items-center min-h-[60vh] justify-center">
        <div className="w-full flex justify-between items-start mb-8">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          {totalScore > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {Object.entries(scores).filter(([, s]) => s > 0).map(([p, s]) => (
                <span key={p} className="text-xs bg-azure-100 text-azure-700 px-2 py-1 rounded-full">{p}: {s}pt</span>
              ))}
            </div>
          )}
        </div>

        <div className="text-5xl mb-3">🎡</div>
        <h3 className="text-base font-medium text-gray-500 mb-6">À qui le tour ?</h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={displayedPlayer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="font-display text-4xl text-gray-900 mb-10 text-center min-h-[56px] flex items-center justify-center"
          >
            {displayedPlayer}
          </motion.div>
        </AnimatePresence>

        {!isSpinning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 w-full max-w-xs"
          >
            <button
              onClick={() => drawCard('truth')}
              className="flex-1 h-14 rounded-2xl bg-azure-500 text-white font-semibold text-base active:scale-95 transition-transform shadow-md"
            >
              💬 Vérité
            </button>
            <button
              onClick={() => drawCard('dare')}
              className="flex-1 h-14 rounded-2xl bg-orange-500 text-white font-semibold text-base active:scale-95 transition-transform shadow-md"
            >
              ⚡ Défi
            </button>
          </motion.div>
        )}
      </div>
    )
  }

  if (phase === 'card' && currentCard) {
    const isDefi = cardType === 'dare'
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">{currentPlayer}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-2xl p-5 mb-6 shadow-md',
            isDefi ? 'bg-orange-50 border-2 border-orange-200' : 'bg-azure-50 border-2 border-azure-200'
          )}
        >
          <div className={cn('text-lg font-bold mb-4', isDefi ? 'text-orange-600' : 'text-azure-600')}>
            {isDefi ? '⚡ DÉFI' : '💬 VÉRITÉ'}
          </div>
          <p className="font-display text-xl text-gray-900 leading-snug mb-4">{currentCard.text}</p>
          <div className="text-sm text-gray-500">⏱️ {currentPlayer} {isDefi ? 'relève le défi...' : 'répond...'}</div>
        </motion.div>

        <div className="flex gap-3">
          {isDefi ? (
            <>
              <button
                onClick={() => nextTurn(false)}
                className="flex-1 h-12 rounded-xl bg-red-50 text-red-600 font-medium border border-red-200 active:scale-95 transition-transform"
              >
                ❌ Raté
              </button>
              <button
                onClick={() => nextTurn(true)}
                className="flex-1 h-12 rounded-xl bg-emerald-500 text-white font-medium active:scale-95 transition-transform"
              >
                ✅ Relevé +1pt
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => nextTurn()}
                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-600 font-medium active:scale-95 transition-transform"
              >
                ⏭️ Passer
              </button>
              <button
                onClick={() => nextTurn()}
                className="flex-1 h-12 rounded-xl bg-azure-500 text-white font-medium active:scale-95 transition-transform"
              >
                ✅ Répondu
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}
