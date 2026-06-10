import { cn } from '@/lib/utils'
import { WaveBackground } from '@/components/WaveBackground'

interface PageHeaderProps {
  title: string
  subtitle?: string
  variant?: 'primary' | 'white' | 'dark'
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, variant = 'primary', children }: PageHeaderProps) {
  if (variant === 'dark') {
    return (
      <header className="relative sticky top-0 z-40 overflow-hidden" style={{ background: '#1A1A2E' }}>
        <WaveBackground />
        <div className="relative px-4 py-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold leading-tight text-white">{title}</h1>
              {subtitle && (
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>
              )}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
          </div>
        </div>
      </header>
    )
  }

  if (variant === 'white') {
    return (
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: 'rgba(0,119,182,0.1)' }}>
        <div className="px-4 h-14 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold leading-tight" style={{ color: '#1A1A2E' }}>{title}</h1>
            {subtitle && <p className="text-xs mt-0.5 text-gray-400">{subtitle}</p>}
          </div>
          {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
      </header>
    )
  }

  // primary (default)
  return (
    <header
      className="relative sticky top-0 z-40 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0077B6 0%, #0096C7 100%)' }}
    >
      <WaveBackground />
      <div className="relative px-4 py-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold leading-tight text-white">{title}</h1>
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</p>
            )}
          </div>
          {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
      </div>
    </header>
  )
}
