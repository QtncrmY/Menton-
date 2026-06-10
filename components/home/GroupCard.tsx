'use client'

export function GroupCard() {
  const members = [
    { name: 'Mathilde', emoji: '👩', color: 'from-pink-400 to-rose-400' },
    { name: 'Alexandre', emoji: '👨', color: 'from-blue-400 to-indigo-400' },
    { name: 'Quentin', emoji: '🧔', color: 'from-emerald-400 to-teal-400' },
    { name: 'Sophie', emoji: '👩‍🦰', color: 'from-amber-400 to-orange-400' },
    { name: 'Gabrielle', emoji: '👶', color: 'from-yellow-300 to-amber-300' },
  ]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">👨‍👩‍👧‍👦</span>
        <h3 className="font-semibold text-gray-900">Notre groupe</h3>
        <span className="ml-auto text-xs bg-azure-50 text-azure-600 px-2 py-0.5 rounded-full font-medium">5 voyageurs</span>
      </div>

      <div className="flex items-end gap-2">
        {members.map((m) => (
          <div key={m.name} className="flex flex-col items-center gap-1.5 flex-1">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-xl shadow-sm`}>
              {m.emoji}
            </div>
            <span className="text-[11px] text-gray-600 font-medium leading-tight text-center">{m.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <div className="flex -space-x-1">
          {['💑', '💑'].map((e, i) => (
            <span key={i} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs border border-white">{e}</span>
          ))}
        </div>
        <p className="text-xs text-gray-400">2 couples · bébé Gabrielle · Menton 2026 🌊</p>
      </div>
    </div>
  )
}
