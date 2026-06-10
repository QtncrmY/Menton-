'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const SQUARES = [
  { id: 'b1',  emoji: '🏊', text: 'Nagé dans la mer' },
  { id: 'b2',  emoji: '🍋', text: 'Goûté un citron de Menton' },
  { id: 'b3',  emoji: '🌅', text: 'Vu le coucher de soleil' },
  { id: 'b4',  emoji: '🎰', text: 'Visité Monaco' },
  { id: 'b5',  emoji: '🫓', text: 'Mangé une socca' },
  { id: 'b6',  emoji: '🍷', text: 'Bu du rosé en terrasse' },
  { id: 'b7',  emoji: '🤳', text: 'Selfie de groupe' },
  { id: 'b8',  emoji: '🏎️', text: 'Vu une voiture de luxe' },
  { id: 'b9',  emoji: '⭐', text: 'FREE', free: true },
  { id: 'b10', emoji: '🏙️', text: 'Flâné dans la vieille ville' },
  { id: 'b11', emoji: '😴', text: 'Sieste à la plage' },
  { id: 'b12', emoji: '🍦', text: 'Mangé une glace' },
  { id: 'b13', emoji: '🍕', text: 'Pizza côté italien' },
  { id: 'b14', emoji: '🍽️', text: 'Restau trouvé par hasard' },
  { id: 'b15', emoji: '🕶️', text: 'Lunettes de soleil toute la journée' },
  { id: 'b16', emoji: '👶', text: 'Gabrielle a fait rire tout le monde' },
]

function checkBingo(checked: Set<string>): boolean {
  const ids = SQUARES.map(s => s.id)
  const grid = Array.from({ length: 4 }, (_, r) => ids.slice(r * 4, r * 4 + 4))
  for (const row of grid) {
    if (row.every(id => checked.has(id))) return true
  }
  for (let c = 0; c < 4; c++) {
    if (grid.every(row => checked.has(row[c]))) return true
  }
  if ([0, 1, 2, 3].every(i => checked.has(grid[i][i]))) return true
  if ([0, 1, 2, 3].every(i => checked.has(grid[i][3 - i]))) return true
  return false
}

export function BingoMenton({ onBack }: { onBack: () => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set(['b9']))
  const [bingo, setBingo] = useState(false)

  function toggle(id: string) {
    if (id === 'b9') return
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
    if (!bingo && checkBingo(next)) setBingo(true)
  }

  function reset() {
    setChecked(new Set(['b9']))
    setBingo(false)
  }

  const count = checked.size - 1

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} aria-label="Retour" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-semibold text-xl flex-1">🎯 Bingo de Menton</h2>
        <button
          onClick={reset}
          aria-label="Réinitialiser"
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {bingo && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 p-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl text-center shadow-sm"
        >
          <p className="text-2xl font-bold text-white">🎉 BINGO !</p>
          <p className="text-sm text-white/80 mt-0.5">Ligne complète — bien joué !</p>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">Cochez au fur et à mesure du séjour</p>
        <span className="text-xs font-medium text-azure-600 bg-azure-50 px-2 py-0.5 rounded-full">{count}/15</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {SQUARES.map(square => {
          const isChecked = checked.has(square.id)
          const isFree = !!square.free
          return (
            <motion.button
              key={square.id}
              onClick={() => toggle(square.id)}
              whileTap={isFree ? {} : { scale: 0.88 }}
              aria-label={square.text}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-xl p-1 transition-all text-center',
                isFree
                  ? 'bg-gradient-to-br from-azure-400 to-azure-500 cursor-default'
                  : isChecked
                  ? 'bg-azure-500 shadow-sm'
                  : 'bg-white border border-gray-200 active:bg-azure-50'
              )}
            >
              {isFree ? (
                <>
                  <span className="text-lg leading-none">⭐</span>
                  <span className="text-[8px] font-bold text-white leading-tight mt-0.5">FREE</span>
                </>
              ) : (
                <>
                  <span className="text-base leading-none mb-0.5">
                    {isChecked ? '✅' : square.emoji}
                  </span>
                  <span className={cn(
                    'text-[7px] leading-tight font-medium text-center px-0.5',
                    isChecked ? 'text-white' : 'text-gray-600'
                  )}>
                    {square.text}
                  </span>
                </>
              )}
            </motion.button>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">Touchez une case pour la cocher / décocher</p>
    </div>
  )
}
