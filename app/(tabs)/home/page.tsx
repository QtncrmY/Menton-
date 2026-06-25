import { CountdownCard } from '@/components/home/CountdownCard'
import { TodayCard } from '@/components/home/TodayCard'
import { GroupCard } from '@/components/home/GroupCard'
import { QuoteCard } from '@/components/home/QuoteCard'
import { FunFactCard } from '@/components/home/FunFactCard'
import { WaveBackground } from '@/components/WaveBackground'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-5 pt-8 pb-0"
        style={{ background: 'linear-gradient(160deg, #0077B6 0%, #0096C7 60%, #00B4D8 100%)' }}
      >
        <WaveBackground />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Menton · Côte d&apos;Azur
          </p>
          <h1 className="font-display text-4xl font-semibold text-white leading-tight">
            Menton 2026
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
            27 juin – 4 juillet · 8 jours de bonheur
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {['🌊 Mer', '☀️ Soleil', '🍋 Citron', '👶 Gabrielle'].map(tag => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        <CountdownCard />
        <TodayCard />
        <GroupCard />
        <QuoteCard />
        <FunFactCard />
      </div>
    </div>
  )
}
