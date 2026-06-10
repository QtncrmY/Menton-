'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuizGame } from '@/components/games/QuizGame'
import { MostLikelyTo } from '@/components/games/MostLikelyTo'
import { TwoTruthsOneLie } from '@/components/games/TwoTruthsOneLie'
import { BingoMenton } from '@/components/games/BingoMenton'

type GameView = 'menu' | 'quiz' | 'mostlikely' | 'twotruths' | 'bingo'

const GAMES = [
  {
    id: 'quiz' as GameView,
    emoji: '🧠',
    title: 'Quiz Côte d\'Azur',
    description: '10 questions sur Menton, Monaco, Nice et la gastronomie locale. Qui sera le champion ?',
    tags: ['2-6 joueurs', '10 questions', '15s/question'],
    tagColors: ['bg-azure-100 text-azure-700', 'bg-purple-100 text-purple-700', 'bg-yellow-100 text-yellow-700'],
  },
  {
    id: 'mostlikely' as GameView,
    emoji: '👆',
    title: 'Qui dans le groupe ?',
    description: 'Une question, tout le monde vote. Qui est le plus susceptible de… ? Hilarant et révélateur !',
    tags: ['4 joueurs', '10 rounds', 'Sans timer'],
    tagColors: ['bg-pink-100 text-pink-700', 'bg-emerald-100 text-emerald-700', 'bg-orange-100 text-orange-700'],
  },
  {
    id: 'twotruths' as GameView,
    emoji: '🤥',
    title: '2 vérités, 1 mensonge',
    description: 'Chacun écrit 2 vérités et 1 mensonge. Le groupe doit trouver lequel est faux. Qui trompe le mieux ?',
    tags: ['4 joueurs', 'Tour par tour', 'Bluff'],
    tagColors: ['bg-red-100 text-red-700', 'bg-blue-100 text-blue-700', 'bg-gray-100 text-gray-600'],
  },
  {
    id: 'bingo' as GameView,
    emoji: '🎯',
    title: 'Bingo de Menton',
    description: '16 cases à cocher pendant le séjour. Socca, Monaco, selfie de groupe, sieste à la plage… Faites Bingo !',
    tags: ['Tout le voyage', '4×4 grille', 'Persistant'],
    tagColors: ['bg-citron-100 text-citron-600', 'bg-azure-100 text-azure-700', 'bg-sand-200 text-sand-700'],
  },
]

export default function GamesPage() {
  const [view, setView] = useState<GameView>('menu')

  if (view === 'quiz') return <QuizGame onBack={() => setView('menu')} />
  if (view === 'mostlikely') return <MostLikelyTo onBack={() => setView('menu')} />
  if (view === 'twotruths') return <TwoTruthsOneLie onBack={() => setView('menu')} />
  if (view === 'bingo') return <BingoMenton onBack={() => setView('menu')} />

  return (
    <div className="pb-28">
      <PageHeader title="🎮 Jeux" subtitle="Pour animer les soirées" />

      <div className="px-4 pt-4 space-y-3">
        <p className="text-sm text-gray-500 mb-1">4 jeux pour égayer les soirées à Menton !</p>

        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setView(game.id)}
            className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
          >
            <div className="text-4xl mb-3">{game.emoji}</div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{game.title}</h3>
            <p className="text-sm text-gray-500 mb-3 leading-snug">{game.description}</p>
            <div className="flex gap-2 flex-wrap">
              {game.tags.map((tag, i) => (
                <span key={tag} className={`text-xs px-2 py-1 rounded-full font-medium ${game.tagColors[i]}`}>
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
