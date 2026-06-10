'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Calendar, MapPin, Gamepad2, UtensilsCrossed, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'home',        icon: Home,            label: 'Accueil',   href: '/home' },
  { id: 'planning',    icon: Calendar,        label: 'Planning',  href: '/planning' },
  { id: 'activities',  icon: MapPin,          label: 'Activités', href: '/activities' },
  { id: 'games',       icon: Gamepad2,        label: 'Jeux',      href: '/games' },
  { id: 'restaurants', icon: UtensilsCrossed, label: 'Restos',    href: '/restaurants' },
  { id: 'info',        icon: Info,            label: 'Infos',     href: '/info' },
]

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-sand-50">
      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ id, icon: Icon, label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={id}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-150',
                  isActive ? 'text-azure-500' : 'text-gray-400 active:scale-95'
                )}
                aria-label={label}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn(isActive && 'text-azure-500')}
                />
                <span className={cn(
                  'text-[10px] font-medium leading-none',
                  isActive ? 'text-azure-500' : 'text-gray-400'
                )}>
                  {label}
                </span>
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-citron-400" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
