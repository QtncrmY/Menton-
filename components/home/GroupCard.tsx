'use client'

const members = [
  { name: 'Mathilde', initial: 'M', bg: '#FDA4AF', text: '#9F1239' },
  { name: 'Alexandre', initial: 'A', bg: '#93C5FD', text: '#1E40AF' },
  { name: 'Quentin', initial: 'Q', bg: '#6EE7B7', text: '#065F46' },
  { name: 'Sophie', initial: 'S', bg: '#FCD34D', text: '#92400E' },
  { name: 'Gabrielle', initial: '👶', bg: '#FDE68A', text: '#78350F', isBaby: true },
]

export function GroupCard() {
  return (
    <div
      className="rounded-card p-4"
      style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,119,182,0.08)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(26,26,46,0.4)' }}>
            Le groupe
          </p>
          <h3 className="font-display text-lg font-semibold" style={{ color: '#1A1A2E' }}>
            Menton 2026 🌊
          </h3>
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,119,182,0.08)', color: '#0077B6' }}
        >
          5 voyageurs
        </span>
      </div>

      <div className="flex items-end gap-2">
        {members.map((m) => (
          <div key={m.name} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm"
              style={{ background: m.bg, color: m.text }}
            >
              {m.isBaby ? '👶' : m.initial}
            </div>
            <span className="text-[10px] font-medium leading-tight text-center" style={{ color: 'rgba(26,26,46,0.6)' }}>
              {m.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,119,182,0.06)' }}>
        <p className="text-xs text-center" style={{ color: 'rgba(26,26,46,0.4)' }}>
          2 couples · bébé Gabrielle · Côte d'Azur
        </p>
      </div>
    </div>
  )
}
