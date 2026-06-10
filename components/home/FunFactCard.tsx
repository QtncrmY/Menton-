const FUN_FACTS = [
  "Menton est la ville la plus ensoleillée de France avec plus de 316 jours de soleil par an !",
  "Le citron de Menton a obtenu l'IGP (Indication Géographique Protégée). La Fête du Citron attire 240 000 visiteurs chaque année !",
  "Jean Cocteau a décoré la salle des mariages de l'Hôtel de Ville de Menton en 1957. Un musée lui est entièrement dédié.",
  "Monaco est le 2ème plus petit État du monde (2.02 km²), juste après le Vatican. Pourtant, c'est l'un des pays les plus riches !",
  "Le village d'Eze est perché à 427 mètres au-dessus de la Méditerranée. Par temps clair, on peut voir la Corse !",
  "Le TER Marseille-Vintimille est l'une des plus belles lignes de train côtières d'Europe. De Menton à Nice en 40 minutes !",
  "La socca niçoise est faite de farine de pois chiches, d'huile d'olive et d'eau. Cuite dans un four à bois, elle se mange chaude.",
  "Menton a appartenu à la Maison de Savoie jusqu'en 1860, date à laquelle elle a rejoint la France après un référendum.",
]

export function FunFactCard() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const fact = FUN_FACTS[dayOfYear % FUN_FACTS.length]

  return (
    <div className="bg-citron-50 rounded-2xl p-4 border border-citron-100">
      <div className="text-xs font-medium text-citron-500 mb-2">🍋 Le saviez-vous ?</div>
      <p className="text-sm text-gray-700 leading-relaxed">{fact}</p>
    </div>
  )
}
