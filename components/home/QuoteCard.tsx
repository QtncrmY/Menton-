const QUOTES = [
  { text: "La mer lave tous les maux de l'homme.", author: "Platon" },
  { text: "Le voyage est la seule chose qu'on achète qui nous rend plus riche.", author: "Anonyme" },
  { text: "On ne voyage pas pour fuir la vie, mais pour que la vie ne nous fuie pas.", author: "Anonyme" },
  { text: "Les meilleurs souvenirs sont ceux qu'on crée ensemble.", author: "Anonyme" },
  { text: "Voyager, c'est découvrir que tout le monde a tort sur les autres pays.", author: "Aldous Huxley" },
  { text: "Le soleil lui-même est un voyageur.", author: "Konrad Gesner" },
  { text: "La Méditerranée, c'est mille ans de civilisation dans une poignée de galets.", author: "Anonyme" },
  { text: "Si tu veux aller vite, marche seul. Si tu veux aller loin, marchons ensemble.", author: "Proverbe africain" },
]

export function QuoteCard() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const quote = QUOTES[dayOfYear % QUOTES.length]

  return (
    <div
      className="rounded-card p-5"
      style={{ background: '#FAF3E0', border: '1px solid rgba(0,119,182,0.08)' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(26,26,46,0.4)' }}>
        💬 Citation du jour
      </p>
      <blockquote
        className="font-display text-xl italic leading-snug mb-3"
        style={{ color: '#1A1A2E' }}
      >
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <div className="text-sm font-medium" style={{ color: 'rgba(26,26,46,0.5)' }}>
        — {quote.author}
      </div>
    </div>
  )
}
