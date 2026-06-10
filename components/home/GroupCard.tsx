export function GroupCard() {
  return (
    <div className="bg-sand-100 rounded-2xl p-4 border border-sand-200">
      <h3 className="font-semibold text-gray-900 mb-3">👨‍👩‍👧 Notre groupe</h3>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-azure-100 flex items-center justify-center text-xl">🙋</div>
          <span className="text-xs text-gray-600 font-medium">Couple 1</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-azure-100 flex items-center justify-center text-xl">🙋</div>
          <span className="text-xs text-gray-600 font-medium">Couple 2</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl">👶</div>
          <span className="text-xs text-gray-600 font-medium">Bébé</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">2 couples · 1 bébé · Menton 2026 🌊</p>
    </div>
  )
}
