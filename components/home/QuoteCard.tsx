const QUOTES = [
  { text: "La mer lave tous les maux de l'homme.", author: "Platon" },
  { text: "Le voyage est la seule chose qu'on achète qui nous rend plus riche.", author: "Anonyme" },
  { text: "On ne voyage pas pour fuir la vie, mais pour que la vie ne nous fuie pas.", author: "Anonyme" },
  { text: "La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre.", author: "Albert Einstein" },
  { text: "Les meilleurs souvenirs sont ceux qu'on crée ensemble.", author: "Anonyme" },
  { text: "Voyager, c'est découvrir que tout le monde a tort sur les autres pays.", author: "Aldous Huxley" },
  { text: "Le soleil lui-même est un voyageur.", author: "Konrad Gesner" },
  { text: "La Méditerranée, c'est mille ans de civilisation dans une poignée de galets.", author: "Anonyme" },
]

export function QuoteCard() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const quote = QUOTES[dayOfYear % QUOTES.length]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="text-xs font-medium text-azure-500 mb-2">💬 Citation du jour</div>
      <blockquote className="font-display text-lg italic text-gray-800 leading-snug mb-2">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <div className="text-sm text-gray-500 font-medium">— {quote.author}</div>
    </div>
  )
}
