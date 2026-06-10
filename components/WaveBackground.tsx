import { cn } from '@/lib/utils'

export function WaveBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <svg
        viewBox="0 0 2880 60"
        preserveAspectRatio="none"
        className="absolute bottom-0 wave-animate"
        style={{ height: '60px', opacity: 0.08 }}
        aria-hidden="true"
      >
        <path
          d="M0,30 C480,50 960,10 1440,30 C1920,50 2400,10 2880,30 L2880,60 L0,60 Z"
          fill="#0077B6"
        />
      </svg>
    </div>
  )
}
