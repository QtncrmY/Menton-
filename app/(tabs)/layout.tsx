'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen bg-warm">
      <main className="pb-[88px]">
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        style={{ background: 'rgba(26,26,46,0.96)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center justify-around px-1" style={{ height: '68px' }}>
          {tabs.map(({ id, icon: Icon, label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={id}
                href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 touch-feedback"
                aria-label={label}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2 : 1.5}
                  color={isActive ? '#F4D03F' : 'rgba(255,255,255,0.5)'}
                />
                <span
                  className="text-[10px] font-medium leading-none"
                  style={{ color: isActive ? '#F4D03F' : 'rgba(255,255,255,0.5)' }}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: '#F4D03F' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
