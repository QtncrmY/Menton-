'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuizGame } from '@/components/games/QuizGame'
import { TruthOrDare } from '@/components/games/TruthOrDare'

type GameView = 'menu' | 'quiz' | 'truthdare'

export default function GamesPage() {
  const [view, setView] = useState<GameView>('menu')

  if (view === 'quiz') return <QuizGame onBack={() => setView('menu')} />
  if (view === 'truthdare') return <TruthOrDare onBack={() => setView('menu')} />

  return (
    <div>
      <PageHeader title="🎮 Jeux" subtitle="Pour animer les soirées" />

      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-500">Deux jeux pour animer vos soirées à Menton !</p>

        <button
          onClick={() => setView('quiz')}
          className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
        >
          <div className="text-4xl mb-3">🧠</div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">Quiz Côte d&apos;Azur</h3>
          <p className="text-sm text-gray-500 mb-3">
            10 questions sur Menton, Monaco, Nice et la gastronomie locale. Jusqu&apos;à 6 joueurs. Timer 15s par question.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-azure-100 text-azure-700 px-2 py-1 rounded-full">2-6 joueurs</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">10 questions</span>
            <span className="text-xs bg-citron-100 text-citron-500 px-2 py-1 rounded-full">15s/question</span>
          </div>
        </button>

        <button
          onClick={() => setView('truthdare')}
          className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
        >
          <div className="text-4xl mb-3">🎭</div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">Vérité ou Défi</h3>
          <p className="text-sm text-gray-500 mb-3">
            Roulette virtuelle, cartes adaptées aux couples. Deux niveaux : Soft 🐥 et Medium 🌶️
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">4 joueurs</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Soft & Medium</span>
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Soirée</span>
          </div>
        </button>
      </div>
    </div>
  )
}
