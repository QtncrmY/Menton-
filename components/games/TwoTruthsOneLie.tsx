'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLAYERS = ['Mathilde', 'Alexandre', 'Quentin', 'Sophie']
const AVATAR_COLORS: Record<string, string> = {
  Mathilde: 'bg-pink-400',
  Alexandre: 'bg-blue-400',
  Quentin: 'bg-emerald-400',
  Sophie: 'bg-amber-400',
}

type Phase = 'pass' | 'input' | 'guess-pass' | 'guess' | 'results'

interface RoundData {
  player: string
  statements: string[]
  lieIndex: number
}

export function TwoTruthsOneLie({ onBack }: { onBack: () => void }) {
  const [playerIdx, setPlayerIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('pass')
  const [inputs, setInputs] = useState(['', '', ''])
  const [lieInput, setLieInput] = useState<0 | 1 | 2>(2)
  const [round, setRound] = useState<RoundData | null>(null)
  const [guessed, setGuessed] = useState<number | null>(null)
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PLAYERS.map(p => [p, 0]))
  )
  const [completedCount, setCompletedCount] = useState(0)

  const currentPlayer = PLAYERS[playerIdx]

  function startInput() {
    setInputs(['', '', ''])
    setLieInput(2)
    setPhase('input')
  }

  function submitStatements() {
    if (inputs.some(s => !s.trim())) return
    const indexed = inputs.map((s, i) => ({ text: s.trim(), isLie: i === lieInput }))
    const shuffled = [...indexed].sort(() => Math.random() - 0.5)
    setRound({
      player: currentPlayer,
      statements: shuffled.map(s => s.text),
      lieIndex: shuffled.findIndex(s => s.isLie),
    })
    setGuessed(null)
    setPhase('guess-pass')
  }

  function handleGuess(idx: number) {
    if (guessed !== null || !round) return
    setGuessed(idx)
    if (idx !== round.lieIndex) {
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }))
    }
  }

  function nextPlayer() {
    const next = completedCount + 1
    setCompletedCount(next)
    if (next >= PLAYERS.length) {
      setPhase('results')
    } else {
      setPlayerIdx(i => (i + 1) % PLAYERS.length)
      setPhase('pass')
    }
  }

  function reset() {
    setPlayerIdx(0)
    setPhase('pass')
    setInputs(['', '', ''])
    setLieInput(2)
    setRound(null)
    setGuessed(null)
    setScores(Object.fromEntries(PLAYERS.map(p => [p, 0])))
    setCompletedCount(0)
  }

  if (phase === 'results') {
    const sorted = [...PLAYERS].sort((a, b) => scores[b] - scores[a])
    const medals = ['🥇', '🥈', '🥉', '4️⃣']
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-semibold text-xl">🤥 Résultats</h2>
        </div>
        <p className="text-gray-500 text-sm text-center mb-5">Qui a le mieux trompé le groupe ?</p>
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
              <span className="font-bold text-azure-600">{scores[player]} pt{scores[player] !== 1 ? 's' : ''}</span>
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

  if (phase === 'pass') {
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-semibold text-xl">🤥 2 vérités, 1 mensonge</h2>
        </div>

        <div className="flex justify-center gap-1.5 mb-8">
          {PLAYERS.map((p, i) => (
            <div
              key={p}
              className={cn(
                'h-2 rounded-full transition-all',
                i < completedCount ? 'bg-azure-500 w-6' : i === playerIdx ? 'bg-azure-300 w-6' : 'bg-gray-200 w-2'
              )}
            />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <div className={cn('w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4', AVATAR_COLORS[currentPlayer])}>
            {currentPlayer[0]}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentPlayer}</h3>
          <p className="text-gray-500 text-sm mb-8">Passe le téléphone à {currentPlayer} 📱</p>
          <button
            onClick={startInput}
            className="w-full h-12 rounded-xl bg-azure-500 text-white font-medium active:scale-95 transition-transform"
          >
            C'est bon, c'est moi 👋
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'input') {
    const placeholders = [
      "Ex: J'ai déjà sauté en parachute",
      "Ex: Je parle 3 langues couramment",
      "Ex: J'ai rencontré une célébrité",
    ]
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setPhase('pass')} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-semibold text-xl">✍️ Tes affirmations</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Écris 3 affirmations sur toi. <span className="font-medium text-gray-700">2 vraies, 1 fausse.</span> Marque laquelle est le mensonge — le groupe devra deviner !
        </p>

        <div className="space-y-4 mb-6">
          {inputs.map((val, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-gray-700">Affirmation {i + 1}</span>
                <button
                  onClick={() => setLieInput(i as 0 | 1 | 2)}
                  className={cn(
                    'ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium border transition-colors',
                    lieInput === i
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  )}
                >
                  {lieInput === i ? '🤥 Mensonge' : 'C\'est le mensonge ?'}
                </button>
              </div>
              <textarea
                value={val}
                onChange={e => setInputs(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                placeholder={placeholders[i]}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azure-300 resize-none text-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={submitStatements}
          disabled={inputs.some(s => !s.trim())}
          className="w-full h-12 rounded-xl bg-azure-500 text-white font-medium disabled:opacity-50 active:scale-95 transition-transform"
        >
          Valider mes affirmations ✓
        </button>
      </div>
    )
  }

  if (phase === 'guess-pass') {
    return (
      <div className="p-4 pb-24 flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
        <div className="text-5xl mb-4">🤫</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentPlayer} a validé !</h3>
        <p className="text-gray-500 text-sm mb-8">Repasse le téléphone au groupe pour deviner le mensonge 📱</p>
        <button
          onClick={() => setPhase('guess')}
          className="w-full h-12 rounded-xl bg-azure-500 text-white font-medium active:scale-95 transition-transform"
        >
          On est prêts ! 👀
        </button>
      </div>
    )
  }

  if (phase === 'guess' && round) {
    return (
      <div className="p-4 pb-24">
        <h2 className="font-semibold text-lg mb-1">
          Trouvez le mensonge de {round.player}
        </h2>
        <p className="text-sm text-gray-500 mb-5">Laquelle de ces affirmations est fausse ?</p>

        <div className="space-y-3 mb-4">
          {round.statements.map((statement, i) => (
            <button
              key={i}
              onClick={() => handleGuess(i)}
              disabled={guessed !== null}
              className={cn(
                'w-full text-left p-4 rounded-2xl border-2 transition-all',
                guessed === null
                  ? 'border-gray-200 bg-white active:scale-[0.98]'
                  : i === round.lieIndex
                  ? 'border-emerald-500 bg-emerald-50'
                  : guessed === i
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-100 bg-gray-50 opacity-40'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5',
                  guessed !== null && i === round.lieIndex ? 'bg-emerald-500 text-white' :
                  guessed === i && i !== round.lieIndex ? 'bg-red-400 text-white' :
                  'bg-gray-100 text-gray-600'
                )}>
                  {guessed !== null && i === round.lieIndex ? '✓' : guessed === i ? '✗' : i + 1}
                </div>
                <p className="text-sm text-gray-900 leading-snug">{statement}</p>
              </div>
            </button>
          ))}
        </div>

        {guessed !== null && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className={cn(
              'p-4 rounded-xl text-center font-semibold text-sm',
              guessed === round.lieIndex
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-orange-100 text-orange-700'
            )}>
              {guessed === round.lieIndex
                ? '🎉 Bien joué ! Vous avez trouvé le mensonge !'
                : `😏 Raté ! ${round.player} vous a bien eu — +1 point pour lui/elle !`
              }
            </div>
            <button
              onClick={nextPlayer}
              className="w-full h-12 rounded-xl bg-azure-500 text-white font-medium active:scale-95 transition-transform"
            >
              {completedCount + 1 >= PLAYERS.length ? 'Voir les résultats 🏆' : 'Joueur suivant →'}
            </button>
          </motion.div>
        )}
      </div>
    )
  }

  return null
}
