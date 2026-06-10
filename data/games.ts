import type { QuizQuestion, GameCard } from '@/types'

export const MOST_LIKELY_QUESTIONS: string[] = [
  'Qui serait le plus susceptible de se perdre dans une ville inconnue ?',
  'Qui commande toujours le plat le plus cher au restaurant ?',
  "Qui s'endort en premier le soir ?",
  'Qui prendrait 10 valises pour un week-end ?',
  "Qui est le plus à cheval sur l'heure des repas ?",
  "Qui oublie toujours quelque chose dans la chambre d'hôtel ?",
  'Qui prend le plus de photos pendant le voyage ?',
  'Qui rentrerait avec le souvenir le plus ridicule ?',
  'Qui se plaindrait le plus de la chaleur ?',
  'Qui goûterait en premier un plat bizarre ?',
  'Qui serait le dernier prêt le matin ?',
  'Qui est le plus difficile quand il faut choisir un restaurant ?',
  'Qui dormirait le plus longtemps en vacances ?',
  'Qui ferait la plus grosse dépense impulsive ?',
  'Qui parlerait le plus fort dans un musée ?',
  'Qui flipperait le plus sur une route de montagne ?',
  'Qui ferait le plus attention à son budget ?',
  'Qui organise le mieux les sorties ?',
  'Qui changerait le plus souvent d\'avis sur les plans de la journée ?',
  'Qui est le plus susceptible de tomber amoureux de Menton et de vouloir y habiter ?',
  'Qui finit toujours son assiette en premier ?',
  'Qui serait le chef de groupe officiel en cas de désaccord ?',
]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "Quelle ville française est la plus proche de l'Italie sur la Côte d'Azur ?",
    options: ['Nice', 'Cannes', 'Antibes', 'Menton'],
    correct: 3,
    explanation: 'Menton est à seulement 2km de la frontière italienne !',
  },
  {
    id: 'q2',
    question: 'Quel fruit est le symbole de Menton ?',
    options: ['Orange', 'Citron', 'Pamplemousse', 'Bergamote'],
    correct: 1,
    explanation: 'Le citron de Menton est AOC depuis 2015. La Fête du Citron a lieu chaque février !',
  },
  {
    id: 'q3',
    question: "À quelle altitude se trouve le village perché d'Eze ?",
    options: ['127m', '247m', '427m', '627m'],
    correct: 2,
    explanation: '427 mètres au-dessus de la Méditerranée — la vue est à couper le souffle !',
  },
  {
    id: 'q4',
    question: 'Quel artiste célèbre est associé à la ville de Menton ?',
    options: ['Pablo Picasso', 'Henri Matisse', 'Jean Cocteau', 'Marc Chagall'],
    correct: 2,
    explanation: "Jean Cocteau a décoré la salle des mariages de l'Hôtel de Ville et un musée lui est dédié !",
  },
  {
    id: 'q5',
    question: "Comment s'appelle le boulevard longeant la mer à Nice ?",
    options: ['Promenade des Anglais', 'Promenade du Soleil', 'Boulevard de la Croisette', 'Promenade de la Mer'],
    correct: 0,
    explanation: "La Promenade des Anglais — construite au XIXe siècle grâce aux touristes britanniques !",
  },
  {
    id: 'q6',
    question: 'Quelle est la superficie de la Principauté de Monaco ?',
    options: ['0.5 km²', '2.02 km²', '5.5 km²', '12 km²'],
    correct: 1,
    explanation: 'Monaco est le 2ème plus petit État du monde (après le Vatican) avec seulement 2.02 km² !',
  },
  {
    id: 'q7',
    question: 'La spécialité niçoise "la socca" est une galette à base de...',
    options: ['Farine de blé', 'Farine de pois chiches', 'Farine de maïs', 'Farine de riz'],
    correct: 1,
    explanation: 'La socca est une galette de farine de pois chiches cuite au four à bois. À essayer !',
  },
  {
    id: 'q8',
    question: 'Quel Grand Prix de Formule 1 se déroule dans les rues de Monaco ?',
    options: ["GP d'Italie", 'GP de France', 'GP de Monaco', 'GP de Méditerranée'],
    correct: 2,
    explanation: "Le Grand Prix de Monaco, organisé depuis 1929, est l'un des plus prestigieux du calendrier !",
  },
  {
    id: 'q9',
    question: 'Quelle ligne de train côtière relie Menton à Nice en longeant la mer ?',
    options: ["TGV Côte d'Azur", 'TER Marseille-Vintimille', 'Train des Merveilles', 'Omnibus Riviera'],
    correct: 1,
    explanation: "Le TER Marseille-Vintimille longe la côte. Menton → Nice en ~40 min pour ~5€ !",
  },
  {
    id: 'q10',
    question: 'La pissaladière est une spécialité de quelle ville ?',
    options: ['Menton', 'Cannes', 'Monaco', 'Nice'],
    correct: 3,
    explanation: "La pissaladière niçoise — tarte à l'oignon confit, anchois et olives — emblème de Nice !",
  },
  {
    id: 'q11',
    question: 'Quelle parfumerie mythique se trouve à Eze ?',
    options: ['Chanel', 'Dior', 'Fragonard', 'Guerlain'],
    correct: 2,
    explanation: 'La Parfumerie Fragonard à Eze propose des visites gratuites de ses ateliers !',
  },
  {
    id: 'q12',
    question: 'En quelle année Menton a-t-elle été rattachée à la France ?',
    options: ['1793', '1848', '1860', '1918'],
    correct: 2,
    explanation: "En 1860, après un référendum, Menton et Roquebrune rejoignent la France !",
  },
]

export const VERITE_SOFT: GameCard[] = [
  { id: 'vs1', text: "Quel est ton souvenir de voyage le plus mémorable ?" },
  { id: 'vs2', text: "Si tu pouvais vivre dans une ville de la Côte d'Azur, laquelle choisirais-tu ?" },
  { id: 'vs3', text: "Quelle activité de ce voyage tu attendais le plus ?" },
  { id: 'vs4', text: "Quel est le plat ou boisson que tu veux absolument goûter ce voyage ?" },
  { id: 'vs5', text: "Décris ton partenaire en 3 mots." },
  { id: 'vs6', text: "Quel est ton souvenir de voyage le plus gênant ?" },
  { id: 'vs7', text: "Si tu gagnais 1 million€ demain, qu'est-ce que tu ferais en premier ?" },
  { id: 'vs8', text: "Quelle est la chose que tu préfères chez ton partenaire ?" },
  { id: 'vs9', text: "Quel est ton péché mignon inavouable ?" },
  { id: 'vs10', text: "Si tu devais choisir une activité de cette semaine à refaire à l'infini, laquelle ?" },
]

export const DEFI_SOFT: GameCard[] = [
  { id: 'ds1', text: "Imite quelqu'un du groupe pendant 30 secondes sans dire qui tu imites." },
  { id: 'ds2', text: "Dis un compliment sincère à chaque personne du groupe." },
  { id: 'ds3', text: "Prends la plus belle selfie de groupe possible en 60 secondes." },
  { id: 'ds4', text: "Chante le refrain d'une chanson française sans t'arrêter." },
  { id: 'ds5', text: "Fais rire quelqu'un du groupe sans dire un mot." },
  { id: 'ds6', text: "Décris ton voyage idéal en 30 secondes chrono." },
  { id: 'ds7', text: "Danse 30 secondes sur la dernière chanson écoutée sur ton téléphone." },
  { id: 'ds8', text: "Envoie un message vocal ridicule à un ami (pas dans le groupe)." },
  { id: 'ds9', text: "Invente un cocktail avec les ingrédients disponibles et le faire goûter au groupe." },
  { id: 'ds10', text: "Dis 5 choses que tu aimes dans cette destination en 20 secondes." },
]

export const VERITE_MEDIUM: GameCard[] = [
  { id: 'vm1', text: "Quelle est la plus grande bêtise que tu as faite en voyage ?" },
  { id: 'vm2', text: "Quel est ton secret de couple que les autres ne savent pas ?" },
  { id: 'vm3', text: "Quelle est la chose que tu regrettes de ne pas avoir faite dans ta vie ?" },
  { id: 'vm4', text: "Quel est le moment où tu as eu le plus honte de ton partenaire ? (avec amour 😄)" },
  { id: 'vm5', text: "Si tu devais décrire cette semaine de vacances à tes enfants dans 20 ans, que dirais-tu ?" },
]

export const DEFI_MEDIUM: GameCard[] = [
  { id: 'dm1', text: "Appelle quelqu'un au hasard dans tes contacts et dis-lui 'Je pense à toi' avant de raccrocher." },
  { id: 'dm2', text: "Fais un aller-retour en courant jusqu'au bout de la rue." },
  { id: 'dm3', text: "Laisse quelqu'un du groupe envoyer un message depuis ton téléphone à qui il veut." },
  { id: 'dm4', text: "Mange une cuillère de la chose la plus bizarre trouvée dans le frigo." },
  { id: 'dm5', text: "Imite un accent étranger pendant les 5 prochaines minutes." },
]
