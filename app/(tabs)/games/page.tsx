'use client'

import { useState } from 'react'
import { WaveBackground } from '@/components/WaveBackground'
import { QuizGame } from '@/components/games/QuizGame'
import { MostLikelyTo } from '@/components/games/MostLikelyTo'
import { TwoTruthsOneLie } from '@/components/games/TwoTruthsOneLie'
import { BingoMenton } from '@/components/games/BingoMenton'
import { WouldYouRather } from '@/components/games/WouldYouRather'

type GameView = 'menu' | 'quiz' | 'mostlikely' | 'twotruths' | 'bingo' | 'wouldyourather'

const GAMES = [
  {
    id: 'quiz' as GameView,
    emoji: '🧠',
    title: 'Quiz Côte d\'Azur',
    description: '10 questions sur Menton, Monaco, Nice et la gastronomie locale.',
    tags: ['2-6 joueurs', '10 questions'],
    accent: '#0077B6',
  },
  {
    id: 'mostlikely' as GameView,
    emoji: '👆',
    title: 'Qui dans le groupe ?',
    description: 'Une question, tout le groupe vote. Qui est le plus susceptible de… ?',
    tags: ['4 joueurs', '10 rounds'],
    accent: '#E76F51',
  },
  {
    id: 'twotruths' as GameView,
    emoji: '🤥',
    title: '2 vérités, 1 mensonge',
    description: 'Chacun écrit ses affirmations. Le groupe doit trouver le mensonge.',
    tags: ['4 joueurs', 'Bluff'],
    accent: '#7B2D8B',
  },
  {
    id: 'wouldyourather' as GameView,
    emoji: '🤔',
    title: 'Tu préfères…',
    description: '25 dilemmes à trancher en groupe. Vote secret, résultats révélés.',
    tags: ['4 joueurs', '25 questions'],
    accent: '#F4A261',
  },
  {
    id: 'bingo' as GameView,
    emoji: '🎯',
    title: 'Bingo de Menton',
    description: '16 cases à cocher pendant le séjour. Socca, Monaco, selfie…',
    tags: ['Tout le voyage', '4×4 grille'],
    accent: '#2D8B4A',
  },
]

export default function GamesPage() {
  const [view, setView] = useState<GameView>('menu')

  if (view === 'quiz') return <QuizGame onBack={() => setView('menu')} />
  if (view === 'mostlikely') return <MostLikelyTo onBack={() => setView('menu')} />
  if (view === 'twotruths') return <TwoTruthsOneLie onBack={() => setView('menu')} />
  if (view === 'bingo') return <BingoMenton onBack={() => setView('menu')} />
  if (view === 'wouldyourather') return <WouldYouRather onBack={() => setView('menu')} />

  return (
    <div className="pb-28">
      {/* Dark header */}
      <header className="relative overflow-hidden px-4 py-5" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
        <WaveBackground />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Soirées & animations
          </p>
          <h1 className="font-display text-2xl font-semibold text-white">🎮 Jeux</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>5 jeux pour animer les soirées</p>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-3">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setView(game.id)}
            className="w-full bg-white text-left active:scale-[0.98] transition-transform"
            style={{
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,119,182,0.08)',
              borderLeft: `4px solid ${game.accent}`,
              borderBottom: `3px solid ${game.accent}20`,
            }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${game.accent}12` }}
                >
                  {game.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base leading-tight mb-1" style={{ color: '#1A1A2E' }}>
                    {game.title}
                  </h3>
                  <p className="text-xs leading-snug mb-2" style={{ color: 'rgba(26,26,46,0.5)' }}>
                    {game.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {game.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: `${game.accent}12`, color: game.accent }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ color: game.accent, opacity: 0.4, fontSize: '18px', marginTop: '2px' }}>›</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
