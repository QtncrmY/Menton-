import { PageHeader } from '@/components/layout/PageHeader'
import { CountdownCard } from '@/components/home/CountdownCard'
import { TodayCard } from '@/components/home/TodayCard'
import { GroupCard } from '@/components/home/GroupCard'
import { QuoteCard } from '@/components/home/QuoteCard'
import { FunFactCard } from '@/components/home/FunFactCard'

export default function HomePage() {
  return (
    <div>
      <div className="bg-gradient-to-b from-azure-700 via-azure-500 to-azure-400 px-4 pt-6 pb-8">
        <h1 className="font-display text-3xl text-white mb-1">🌊 Menton 2026</h1>
        <p className="text-azure-100 text-sm">27 juin – 4 juillet · Côte d&apos;Azur</p>
      </div>

      <div className="px-4 -mt-4 pb-6 space-y-3">
        <CountdownCard />
        <TodayCard />
        <GroupCard />
        <QuoteCard />
        <FunFactCard />
      </div>
    </div>
  )
}
