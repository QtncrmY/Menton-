import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  variant?: 'primary' | 'white'
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, variant = 'primary', children }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-14',
        variant === 'primary'
          ? 'bg-gradient-to-r from-azure-700 to-azure-500 shadow-sm'
          : 'bg-white border-b border-gray-100 shadow-sm'
      )}
    >
      <div className="px-4 h-full flex items-center justify-between">
        <div>
          <h1 className={cn(
            'font-display text-xl leading-tight',
            variant === 'primary' ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              'text-xs mt-0.5',
              variant === 'primary' ? 'text-azure-100' : 'text-gray-500'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </header>
  )
}
