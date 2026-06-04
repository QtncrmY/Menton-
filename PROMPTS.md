# PROMPTS — Menton Diary · Séquence de développement

Prompts à utiliser dans l'ordre avec Claude Code pour construire l'app complète.

---

## PROMPT 1 — Setup & Structure de base

```
Tu vas construire une PWA Next.js 14 appelée "Menton Diary" — un carnet de voyage interactif pour un groupe (2 couples + 1 bébé) partant à Menton du 27 juin au 4 juillet 2026.

STACK : Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React.

ÉTAPE 1 : Crée la structure de base complète du projet.

1. Crée `app/globals.css` avec :
   - Import Tailwind directives (@tailwind base/components/utilities)
   - Variable CSS pour safe-area-inset-bottom (iPhone)
   - Classe `.pb-safe` = padding-bottom: env(safe-area-inset-bottom)

2. Crée `tailwind.config.js` avec l'extension de couleurs suivante :
   - azure (50 à 900) : palette sky/azure — azure-500 = #0ea5e9, azure-600 = #0284c7
   - citron (50, 100, 300, 400, 500) : palette jaune — citron-400 = #facc15
   - sand (50, 100, 200, 300) : palette sable — sand-100 = #f5f0e8
   - coral (400, 500) : palette corail — coral-500 = #f43f5e
   - Activer la font-family : display (variable --font-display) et body (variable --font-body)

3. Crée `app/layout.tsx` (root layout) :
   - Importer Instrument_Serif (weight 400, italic) et DM_Sans depuis next/font/google
   - Variables CSS : --font-display et --font-body
   - Providers : Toaster (Sonner, position top-center)
   - Classe body : font-body bg-sand-50 text-gray-900

4. Crée `app/page.tsx` : redirect vers /home (utiliser redirect() de next/navigation)

5. Crée `app/(tabs)/layout.tsx` avec le BottomNav :
   - 6 onglets : Home, Planning, Activités, Jeux, Restos, Infos
   - Position : fixed bottom-0 z-50, hauteur 64px + pb-safe
   - Background : white/95 backdrop-blur-md border-t border-gray-100
   - Onglet actif : text-azure-500, point citron-400 sous l'icône
   - Touch target minimum 44×44px
   - Utiliser usePathname() pour détecter l'onglet actif
   - Icônes Lucide : Home, Calendar, MapPin, Gamepad2, UtensilsCrossed, Info
   - Labels : Accueil, Planning, Activités, Jeux, Restos, Infos
   - Main content : pb-[80px] pour le safe area + nav height
   - Le layout wrappe les pages avec un <main> scrollable

6. Crée `components/layout/PageHeader.tsx` :
   - Props : title (string), subtitle? (string), variant: 'primary' | 'white'
   - Primary : gradient from-azure-700 to-azure-500, texte blanc
   - White : bg-white border-b, texte gray-900
   - Hauteur : h-14 (56px), sticky top-0 z-40
   - Titre en font-display text-xl

7. Crée `types/index.ts` avec tous les types TypeScript :
   - Category, Day, Activity, NewActivity, ActivityTemplate
   - Restaurant, RestaurantVote, QuizQuestion, GameCard, GameLevel, RealtimePayload
   (voir SPEC_setup.md pour les types complets)

8. Crée les 6 pages placeholder dans app/(tabs)/ :
   - home/page.tsx, planning/page.tsx, activities/page.tsx
   - games/page.tsx, restaurants/page.tsx, info/page.tsx
   - Chaque page retourne juste un <div> avec le PageHeader et "Coming soon"

RÈGLES :
- Mobile-first absolu (tester mentalement sur iPhone 14 Pro 390×844)
- Pas de <form> HTML natif
- Touch targets ≥ 44×44px
```

---

## PROMPT 2 — Configuration Supabase & Données

```
ÉTAPE 2 : Configure Supabase et le schéma de données pour Menton Diary.

1. Crée `.env.local.example` :
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

2. Crée `lib/supabase.ts` :
   - Client Supabase avec createClient
   - Typer avec Database générique pour l'instant (any si pas de types générés)
   - Export default : supabase

3. Crée `lib/utils.ts` :
   - Fonction cn() avec clsx + tailwind-merge
   - Fonction formatDate(date: string): string → "Lundi 29 juin"
   - Fonction getDaysUntil(date: string): number → jours restants avant une date
   - Fonction shuffleArray<T>(array: T[]): T[] → Fisher-Yates shuffle

4. Crée `data/activities-library.ts` avec la bibliothèque complète d'activités :
   Inclure TOUTES ces activités prédéfinies :
   
   PLAGES : Plage des Sablettes (🏖️, baby-friendly), Plage de Garavan (🏝️), 
   Plage des Fossettes (🐠), Plage privée avec transats (🛻), Paddle & Kayak (🏄, non baby-friendly)
   
   VISITES MENTON : Vieille ville & marché (🏘️), Marché des Halles (🍋), 
   Promenade du Soleil (🌴), Musée Jean Cocteau (🎨), Jardin des Serres de la Madone (🌺)
   
   DAY TRIPS : Day trip Monaco (🎰, 480min), Village d'Eze (🏔️), 
   Day trip Nice (🌆), Ventimiglia Italie (🇮🇹)
   
   SOIRÉES : Apéro vue mer (🥂), Soirée jeux (🎮)
   
   Chaque activité a : id (préfixé 'lib-'), title, description, emoji, category, 
   suggested_time_slot, duration_minutes, location_name, location_url, is_baby_friendly, tags[]

5. Crée `data/restaurants.ts` avec au moins 6 restaurants fictifs/réels de Menton :
   - Variation de prix (€, €€, €€€)
   - Certains baby-friendly, certains avec terrasse
   - Cuisines variées : Méditerranéen, Italien, Français, Poissons
   - Champs : id, name, description, cuisine, price_range, address, is_baby_friendly, has_terrace, notes

6. Crée `data/games.ts` avec :
   - QUIZ_QUESTIONS : les 12 questions du quiz Côte d'Azur (voir SPEC_games.md)
   - VERITE_SOFT (10 cartes), DEFI_SOFT (10 cartes)
   - VERITE_MEDIUM (5 cartes), DEFI_MEDIUM (5 cartes)

7. Génère le SQL complet à exécuter dans Supabase (crée le fichier `supabase/schema.sql`) :
   - Toutes les tables : days, activities, restaurants, restaurant_votes, game_scores, app_settings
   - Index sur activities(day_id) et activities(day_id, sort_order)
   - Données initiales : INSERT INTO days pour les 8 jours du voyage
   - INSERT INTO app_settings (group_members, trip_name)
   - Politiques RLS permissives (accès public pour app privée)
   - Activer Realtime sur activities et restaurant_votes

8. Génère aussi `supabase/seed.sql` avec le planning initial préchargé :
   - Activités pour tous les jours du voyage (voir SPEC_activities.md section "Planning initial préchargé")
```

---

## PROMPT 3 — Page Planning (cœur de l'app)

```
ÉTAPE 3 : Construis la page Planning — la feature centrale de Menton Diary.
C'est la page la plus complexe. Mobile-first, drag & drop tactile, sync Supabase realtime.

FICHIERS À CRÉER :

1. `store/planningStore.ts` (Zustand) :
   Interface PlanningStore :
   - days: Day[], activities: Record<string, Activity[]>, isLoading: boolean
   - fetchAll(): charge days puis activities depuis Supabase, groupe par day_id
   - addActivity(dayId, activity): optimistic UI → update local → Supabase → rollback si erreur
   - updateActivity(activity): même pattern optimistic
   - deleteActivity(activityId): même pattern optimistic
   - moveActivity(activityId, targetDayId, newOrder): déplace vers un autre jour
   - reorderActivities(dayId, reorderedActivities): réordonne dans un jour
   - handleRealtimeChange(payload): applique INSERT/UPDATE/DELETE au store local
   
   Pattern Optimistic UI obligatoire sur toutes les mutations :
   1. Update store local immédiatement
   2. Appel Supabase en arrière-plan
   3. Rollback + toast.error si échec

2. `hooks/usePlanning.ts` :
   - Initialise le store au mount (fetchAll)
   - S'abonne au channel Supabase Realtime 'activities-changes'
   - Cleanup au unmount
   - Retourne { days, activities, isLoading, ...actions }

3. `hooks/useRealtime.ts` :
   - Hook générique useRealtimeSubscription(table, handler)
   - S'abonne aux postgres_changes sur la table donnée
   - Cleanup au unmount

4. `components/planning/ActivityCard.tsx` :
   Carte visuelle d'une activité avec :
   - Drag handle grip icon (GripVertical de Lucide) côté gauche
   - Badge catégorie coloré (CATEGORY_STYLES selon SPEC_design.md)
   - Emoji + Titre (font-semibold)
   - Ligne infos : time_slot • durée en h/min • 📍 location si défini
   - Badge 🍼 si is_baby_friendly
   - Boutons d'action (visibles en permanence sur mobile) :
     [↑] [↓] désactivés si premier/dernier
     [→] ouvre DayPickerSheet
     [✏️] ouvre modal d'édition
     [🗑️] supprime avec confirm toast
   - État isDragging : opacity-50, ring-2 ring-azure-400, shadow-lg
   - CATEGORY_STYLES : plage=blue, restaurant=orange, visite=purple, day_trip=emerald,
     soiree=indigo, sport=red, shopping=pink, libre=gray, transport=slate
   - Props : activity, isDragging?, onEdit, onDelete, onMoveUp, onMoveDown, onMoveToDay, isFirst, isLast, dragHandleProps?

5. `components/planning/DraggableActivity.tsx` :
   - Wrapper useSortable(@dnd-kit/sortable) autour de ActivityCard
   - Style CSS.Transform + transition + opacity + zIndex pendant drag
   - Passe dragHandleProps au ActivityCard

6. `components/planning/DayColumn.tsx` :
   - Header : emoji + label + description du jour
   - Badge "Arrivée ✈️" / "Départ 👋" sur les jours correspondants
   - Badge "🍼 Tout baby-friendly" si toutes les activités le sont
   - SortableContext (dnd-kit) avec la liste d'activités du jour
   - Liste des DraggableActivity
   - AnimatePresence (Framer Motion) avec layout pour les réordonnages
   - Bouton sticky "＋ Ajouter une activité" (azure-500, 44px min height)
   - Droppable area avec highlight bleu-clair quand une carte survole

7. `components/planning/DayPickerSheet.tsx` :
   - Bottom sheet (animation slide-up Framer Motion)
   - Overlay sombre backdrop
   - Titre "Déplacer vers quel jour ?"
   - Liste de tous les jours avec emoji + label, tap pour sélectionner
   - Bouton Annuler
   - Props : days, onSelect(dayId), onClose, excludeDayId?

8. `components/planning/AddActivityModal.tsx` :
   Bottom sheet modal avec 2 onglets (Bibliothèque / Créer) :
   
   Onglet Bibliothèque :
   - Filtres par catégorie (chips horizontaux scrollables)
   - Filtre "🍼 Baby-friendly"
   - Liste des ActivityTemplate avec description
   - Bouton "+ Ajouter" sur chaque item → ajoute au jour cible + ferme modal
   
   Onglet Créer :
   - Champ titre (obligatoire)
   - Picker emoji (10 emojis rapides)
   - Select catégorie
   - Select créneau horaire : Matin, Après-midi, Soirée, Journée, Matin-Après-midi
   - Select durée : 30min, 1h, 1h30, 2h, 3h, Demi-journée, Journée
   - Textarea notes (optionnel)
   - Toggle baby-friendly (coché par défaut)
   - Boutons [Annuler] [Ajouter ✓]
   - Validation : titre obligatoire, catégorie obligatoire

9. `app/(tabs)/planning/page.tsx` :
   - DndContext avec sensors tactiles (TouchSensor delay 200ms tolerance 8) + PointerSensor (distance 8)
   - Stratégie closestCorners
   - Tabs des jours (scroll horizontal, 8 onglets, le jour courant actif par défaut)
   - DayColumn pour le jour sélectionné
   - DragOverlay avec ActivityCard fantôme (opacity 50)
   - Handler onDragEnd : détecte même jour (réordonnage) vs jour différent (déplacement)
   - Intégration usePlanning pour les données
   - Toast succès sur toutes les actions

RÈGLES :
- Long press 200ms pour déclencher le drag sur mobile
- Feedback visuel immédiat (optimistic UI)
- Toast "Activité déplacée ✓" à chaque action
- Jamais de <form> HTML, toujours des handlers React
```

---

## PROMPT 4 — Page Accueil

```
ÉTAPE 4 : Construis la page Accueil de Menton Diary.

Crée ces composants dans `components/home/` et la page `app/(tabs)/home/page.tsx`.

COMPOSANTS :

1. `CountdownCard.tsx` :
   - Si aujourd'hui < 27 juin 2026 : "✈️ Départ dans X jours" avec gradient azure
   - Si dans le voyage (27 juin – 4 juillet) : "🌊 Jour X du voyage" avec gradient vert
   - Si après le 4 juillet : "💭 Un souvenir inoubliable" avec gradient violet
   - Date de départ affichée "Samedi 27 juin 2026"
   - Animation Framer Motion au mount (fadeIn + scale from 0.95)
   - Texte chiffre en font-display text-5xl

2. `TodayCard.tsx` :
   - Affiche le jour courant si on est dans le voyage, sinon le premier jour
   - Emoji + label du jour
   - Nombre d'activités planifiées
   - Liste des 3 premières activités avec emoji
   - Lien "Voir le planning →" (navigue vers /planning)
   - Récupère les données depuis le planningStore

3. `GroupCard.tsx` :
   - Titre "👨‍👩‍👧 Notre groupe"
   - Couple 1 🙋, Couple 2 🙋, Bébé 👶
   - Card background sand-100, border sand-200
   - Texte "2 couples · 1 bébé · Menton 2026"

4. `QuoteCard.tsx` :
   - Citation du jour (rotation basée sur le numéro du jour de l'année % nb citations)
   - 8 citations sur la mer, les voyages, l'été, la Méditerranée
   - Style : italique, font-display, guillemets stylisés
   - Auteur en DM Sans font-medium
   - Exemples : "La mer lave tous les maux de l'homme" — Platon,
     "Le voyage est la seule chose qu'on achète qui nous rend plus riche" — Anonyme,
     "Vivre, c'est voyager" — Victor Hugo

5. `FunFactCard.tsx` :
   - Anecdote du jour sur Menton/Côte d'Azur (rotation quotidienne)
   - Badge "🍋 Le saviez-vous ?" en citron-400
   - 8 fun facts : citron de Menton AOC, Jean Cocteau, Fête du Citron, 
     Monaco 2.02km², village d'Eze 427m, TER côtier, gastronomie niçoise, etc.

PAGE `app/(tabs)/home/page.tsx` :
   - Header hero : titre "🌊 Menton 2026" avec sous-titre sur fond gradient azure ou image
   - Stagger animation sur les cards (staggerChildren 0.06s)
   - Ordre : CountdownCard → TodayCard → GroupCard → QuoteCard → FunFactCard
   - Padding bottom pour la BottomNav
   - Scroll vertical fluide
```

---

## PROMPT 5 — Page Activités

```
ÉTAPE 5 : Construis la page Activités de Menton Diary.

Fichier : `app/(tabs)/activities/page.tsx`

FONCTIONNALITÉS :

1. Header : "🗺️ Activités" avec PageHeader variant primary

2. Filtres catégorie (chips horizontaux scrollables, sans overflow visible) :
   - [Tout] [🏖️ Plage] [🏛️ Visite] [🎰 Day trip] [🌙 Soirée] [⚡ Sport] [🛍️ Shopping] [☀️ Libre] [🚂 Transport]
   - Chip "🍼 Baby-friendly" comme filtre spécial
   - Chip actif : bg-azure-500 text-white
   - Chip inactif : bg-white border border-gray-200 text-gray-600
   - Min height 36px, px-4, rounded-full

3. Carte Google Maps embed (iframe) :
   - Hauteur 220px, width 100%, border-0
   - URL embed Menton : https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d23108.246!2d7.5025!3d43.7762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sfr
   - loading="lazy", allowFullScreen, referrerPolicy="no-referrer-when-downgrade"
   - Rounded-lg overflow-hidden, border border-gray-100

4. Compteur "Activités (X)" avec le nombre filtré

5. Liste des activités depuis ACTIVITIES_LIBRARY :
   Chaque card :
   - Emoji + Titre en font-semibold
   - Description tronquée à 2 lignes (line-clamp-2)
   - Tags : badge catégorie coloré, badge "🍼 Baby-friendly" si applicable
   - Ligne : 📍 location • durée formatée
   - Bouton "＋ Ajouter au planning" (azure-500, full width, 44px)
     → Ouvre DayPickerSheet pour choisir le jour
     → Ajoute l'activité au jour choisi via planningStore.addActivity
     → Toast succès "Ajouté au planning ✓"

6. Le filtre s'applique en temps réel sur la liste (pas de bouton submit)

7. Animation stagger sur l'apparition des cards (0.04s entre chaque)

8. Empty state si aucune activité correspond aux filtres :
   "🔍 Aucune activité pour ce filtre"
```

---

## PROMPT 6 — Page Restaurants

```
ÉTAPE 6 : Construis la page Restaurants avec le système de votes realtime.

Fichiers : `app/(tabs)/restaurants/page.tsx`, `hooks/useRestaurants.ts`

1. `hooks/useRestaurants.ts` :
   - Charge les restaurants depuis Supabase (ou data/restaurants.ts en fallback)
   - Charge les votes depuis Supabase restaurant_votes
   - Fonction voteForRestaurant(restaurantId, voterName, vote: 1|2|3)
     Pattern optimistic : update local → Supabase UPSERT → rollback si erreur
     (UNIQUE constraint sur restaurant_id + voter_name)
   - Subscription Realtime sur restaurant_votes
   - Retourne { restaurants, votes, voteForRestaurant, isLoading }

2. `app/(tabs)/restaurants/page.tsx` :
   
   Header "🍽️ Nos Restaurants" + filtres :
   - [Tous] [€] [€€] [€€€] [🍼 Bébé] [🏡 Terrasse]
   
   Pour chaque restaurant, une card avec :
   - Nom en font-semibold + badges (prix €/€€/€€€, cuisine)
   - Description
   - Badges : "🍼 Baby-friendly" si applicable, "🏡 Terrasse" si applicable
   - Séparateur
   - Section "Votes du groupe" :
     Afficher le vote de chaque membre si il a voté
     (4 membres : par défaut "Couple 1 A", "Couple 1 B", "Couple 2 A", "Couple 2 B")
     ❤️ = J'adore (1), 👍 = Ok (2), 🤷 = Bof (3)
   - Selector du voter : "Mon prénom :" → 4 boutons chips
   - Boutons de vote : [❤️ J'adore] [👍 Ok] [🤷 Bof]
     Bouton du vote actuel : fond coloré (❤️=red, 👍=green, 🤷=gray)
   - Liens : [📍 Voir sur Maps] si google_maps_url défini
   
   Toast "Vote enregistré ✓" après chaque vote

3. Empty state et loading skeleton (3 cards grises pendant le chargement)
```

---

## PROMPT 7 — Page Jeux

```
ÉTAPE 7 : Construis la page Jeux avec le Quiz et Vérité ou Défi.

Fichiers à créer :
- `components/games/QuizGame.tsx`
- `components/games/TruthOrDare.tsx`
- `app/(tabs)/games/page.tsx`

1. `components/games/QuizGame.tsx` :
   
   États : 'setup' | 'playing' | 'result'
   State : players (string[]), currentPlayerIndex, currentQuestionIndex, scores (Record<string, number>), selectedAnswer (null|number), showResult (bool), questions (shuffled QUIZ_QUESTIONS)
   
   SETUP :
   - Titre "🧠 Quiz Côte d'Azur"
   - Ajouter jusqu'à 6 joueurs (input + bouton +)
   - Minimum 1 joueur
   - [Démarrer le quiz]
   
   PLAYING (1 question à la fois) :
   - Barre de progression "Question X/10"
   - Timer 15 secondes (barre de progression animée qui se vide)
     Si timer expire → compte comme mauvaise réponse, passe à suivant
   - Nom du joueur actuel "Tour de : Sophie 🎯"
   - Texte de la question (font-display, text-xl, text-center)
   - 4 boutons de réponse (A/B/C/D) :
     Avant réponse : bg-white border-gray-200
     Après réponse : bonne = bg-emerald-100 border-emerald-500, mauvaise = bg-red-100
     La bonne réponse est toujours révélée en vert
   - Animation Framer Motion sur les boutons (spring bounce)
   - Explication de la réponse (text-sm text-gray-600 italic) pendant 2s
   - Auto-avance vers la question suivante après 2.5s
   
   RESULT (podium) :
   - Titre "🏆 Podium !"
   - Classement trié par score décroissant
   - 🥇 🥈 🥉 + emojis pour les suivants
   - Animation stagger sur l'apparition du podium
   - Boutons [🔄 Rejouer] [← Retour]

2. `components/games/TruthOrDare.tsx` :
   
   États : 'setup' | 'roulette' | 'card' | 'end'
   State : players, level ('soft'|'medium'), currentPlayer, cardType ('truth'|'dare'|null), currentCard (GameCard|null), scores, usedCardIds
   
   SETUP :
   - Titre "🎭 Vérité ou Défi"
   - 4 inputs pour les prénoms
   - Selector niveau : [🐥 Soft] [🌶️ Medium] [🔥 Hot] (Hot = same as Medium pour cette version)
   - [Commencer]
   
   ROULETTE :
   - "🎡 À qui le tour ?"
   - Animation : le nom du joueur courant tourne (CSS animation ou Framer Motion)
     Simuler un spin en faisant défiler les noms rapidement (500ms) puis s'arrêter sur le sélectionné
   - Afficher le joueur sélectionné
   - Boutons : [💬 VÉRITÉ] [⚡ DÉFI]
     Ces boutons sont bien espacés, larges, colorés (bleu pour vérité, orange pour défi)
   
   CARD (après choix) :
   - Header "💬 VÉRITÉ" ou "⚡ DÉFI" avec couleur correspondante
   - Texte de la carte en grand (font-display, text-lg)
   - Prénom du joueur en sous-titre
   - Pour DÉFI : [✅ Relevé +1pt] [❌ Raté]
   - Pour VÉRITÉ : [✅ Répondu] [⏭️ Passer]
   - Passe au joueur suivant (rotation)
   - Deck de cartes mélangé (Fisher-Yates) au démarrage, pas de répétition
   - Quand toutes les cartes sont épuisées : mélanger à nouveau
   
   Scoreboard flottant (badge en haut) : affiche les points en temps réel

3. `app/(tabs)/games/page.tsx` :
   - État : 'menu' | 'quiz' | 'truthdare'
   - Page menu : 2 grosses cartes cliquables
     [🧠 Quiz Côte d'Azur] — "10 questions sur la Côte d'Azur"
     [🎭 Vérité ou Défi] — "Le jeu de soirée pour le groupe"
   - Quand un jeu est sélectionné : affiche le composant correspondant avec bouton retour
```

---

## PROMPT 8 — Page Infos (statique)

```
ÉTAPE 8 : Construis la page Infos — contenu statique utile pour le voyage.

Fichier : `app/(tabs)/info/page.tsx`

Page avec sections accordéon (expand/collapse) ou sections fixes :

1. 🚂 TRANSPORT
   - Train Menton → Monaco : 20 min, ~1.60€, TER Marseille-Vintimille
   - Train Menton → Nice : 40 min, ~5€, TER Marseille-Vintimille
   - Bus 100 : longe la côte, moins cher, vue mer
   - Taxi : numéro indicatif + note "plus cher"
   - Ventimiglia (Italie) : 10 min, ~3€

2. 🏥 URGENCES
   - SAMU : 15
   - Pompiers : 18
   - Police : 17 (ou 112 universel)
   - Hôpital de Menton : adresse + numéro indicatif
   - Numéro européen d'urgence : 112

3. 👶 INFOS BÉBÉ
   - Plages recommandées : Sablettes (eaux calmes), Garavan, Fossettes
   - "Éviter les heures chaudes : 12h-16h"
   - Crème solaire indice 50+ obligatoire
   - Pharmacies à Menton (horaires indicatifs)
   - Note : "Consulter un médecin local si nécessaire"

4. 🌡️ MÉTÉO
   - "Menton en juillet : ~28-32°C le jour, 22-24°C la nuit"
   - "Ensoleillement : ~10h par jour"
   - "Mer : ~24-26°C"
   - Lien texte vers Météo France (pas de lien cliquable, juste info)

5. 📶 PRATIQUE
   - WiFi logement : "Voir les codes dans l'app de location"
   - Supermarchés : Carrefour Market, Intermarché (ouverts le dimanche matin)
   - Note parking + horaires indicatifs

6. 💰 BUDGET INDICATIF
   - Table avec estimations : train Monaco A/R (~3.20€/pers), train Nice A/R (~10€/pers),
     plage privée (~30-50€/transat/jour), entrée Musée Cocteau (~10€), apéro terrasse (~15-25€/pers)

DESIGN :
- Sections avec icône + titre en font-semibold
- Cards sand-100 avec border sand-200
- Séparateurs visuels entre sections
- Texte body-sm text-gray-700
- Tags/badges pour les numéros d'urgence (rouge), prix (vert), temps (bleu)
```

---

## PROMPT 9 — PWA & Configuration finale

```
ÉTAPE 9 : Configure la PWA et finalise la configuration Next.js.

1. Crée `public/manifest.json` :
   {
     "name": "Menton Diary 🌊",
     "short_name": "Menton",
     "description": "Notre carnet de voyage à Menton",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#0284c7",
     "orientation": "portrait",
     "icons": [
       { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
       { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
     ]
   }

2. Crée des icônes placeholder dans `public/icons/` :
   - Utiliser un SVG simple converti (fond azure-600, texte "M" blanc)
   - Ou noter que les fichiers PNG doivent être créés

3. Mets à jour `next.config.js` :
   - Configurer next-pwa (dest: 'public', disable en dev)
   - Désactiver React strictMode si ça cause des doubles renders problématiques avec dnd-kit
   - Headers pour manifest et service worker

4. Mets à jour `app/layout.tsx` (root) :
   - <link rel="manifest" href="/manifest.json">
   - <meta name="theme-color" content="#0284c7">
   - <meta name="apple-mobile-web-app-capable" content="yes">
   - <meta name="apple-mobile-web-app-status-bar-style" content="default">
   - <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
     (viewport-fit=cover pour le safe area iPhone)

5. Composant `InstallPrompt` dans la page Home :
   - Détecte si l'app est déjà installée (window.matchMedia('(display-mode: standalone)'))
   - Si non installée et sur mobile : affiche un banner discret en bas
   - "📱 Installer l'app → Ajouter à l'écran d'accueil"
   - Dismiss button × stocké dans localStorage

6. Crée `.env.local.example` final avec toutes les variables nécessaires
```

---

## PROMPT 10 — Polish & Animations

```
ÉTAPE 10 : Polish final — animations, loading states, empty states, et UX details.

1. ANIMATIONS GLOBALES :
   - Créer `lib/animations.ts` avec les variants Framer Motion réutilisables :
     pageTransition: { initial: {opacity:0, x:20}, animate: {opacity:1, x:0}, exit: {opacity:0, x:-20}, transition: {duration:0.2} }
     cardEntrance: { initial: {opacity:0, y:16}, animate: {opacity:1, y:0}, transition: {duration:0.25} }
     listStagger: { animate: { transition: { staggerChildren: 0.06 } } }
     bottomSheet: spring damping:30 stiffness:300
   
   - Wrapper chaque page dans <motion.div> avec pageTransition

2. LOADING STATES :
   Sur chaque page avec données async, ajouter des skeletons :
   - Planning : 3 skeleton cards grises (rounded, animate-pulse)
   - Activités : 4 skeleton cards
   - Restaurants : 3 skeleton cards avec lignes de texte
   - Utiliser la classe Tailwind animate-pulse + bg-gray-200 rounded

3. EMPTY STATES :
   - Planning (jour sans activités) : 
     Illustration simple (emoji 📅), "Aucune activité pour ce jour",
     Bouton "＋ Ajouter une activité" (azure-500)
   - Restaurants (aucun vote) : "Soyez le premier à voter !"
   - Activités filtrées vides : "🔍 Aucune activité pour ce filtre"

4. MICRO-INTERACTIONS :
   - Boutons : scale(0.97) au press (active:scale-95 Tailwind)
   - Cards : hover:shadow-md transition-shadow sur desktop
   - ActivityCard drag handle : cursor-grab, active:cursor-grabbing
   - Tous les boutons interactifs : transition-all duration-150

5. TOAST NOTIFICATIONS COHÉRENTES :
   Vérifier que tous ces toasts existent dans le code :
   - "✓ Activité ajoutée" (succès, emerald)
   - "✓ Activité déplacée" (succès, emerald)
   - "✓ Activité supprimée" (succès, emerald)
   - "🔄 Planning mis à jour par le groupe" (info, citron)
   - "✓ Vote enregistré" (succès, emerald)
   - "⚠️ Erreur de synchronisation" (erreur, red) avec retry automatique

6. PERFORMANCE :
   - Vérifier que les images utilisent next/image
   - Vérifier que les listes longues ont des keys stables (id, pas index)
   - Les abonnements Realtime ont bien un cleanup dans les useEffect return

7. ACCESSIBILITÉ :
   - aria-label sur tous les boutons sans texte (↑, ↓, →, ✏️, 🗑️)
   - role="button" sur les éléments cliquables non-button
   - Focus visible sur tous les éléments interactifs
   - Contrast ratio ≥ 4.5:1 pour tout le texte

8. VÉRIFICATION FINALE :
   - npm run build sans erreur TypeScript
   - Tester navigation entre tous les onglets
   - Tester sur viewport 390×844 (iPhone 14 Pro) dans DevTools
   - Vérifier que le BottomNav ne cache pas le contenu
   - Vérifier safe area sur les pages avec contenu en bas
```

---

## Résumé des fichiers générés

| Étape | Fichiers clés |
|-------|--------------|
| 1 | globals.css, tailwind.config.js, layout.tsx, BottomNav, PageHeader, types/index.ts, 6 pages placeholder |
| 2 | lib/supabase.ts, lib/utils.ts, data/*.ts, supabase/schema.sql, supabase/seed.sql |
| 3 | store/planningStore.ts, hooks/usePlanning.ts, 5 composants planning, app/(tabs)/planning/page.tsx |
| 4 | 5 composants home, app/(tabs)/home/page.tsx |
| 5 | app/(tabs)/activities/page.tsx |
| 6 | hooks/useRestaurants.ts, app/(tabs)/restaurants/page.tsx |
| 7 | QuizGame.tsx, TruthOrDare.tsx, app/(tabs)/games/page.tsx |
| 8 | app/(tabs)/info/page.tsx |
| 9 | manifest.json, next.config.js PWA, InstallPrompt |
| 10 | lib/animations.ts, polish global |
