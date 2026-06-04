# SPEC_setup.md — Guide de démarrage

## Étapes de setup (dans l'ordre)

### 1. Créer le projet Next.js

```bash
npx create-next-app@latest menton-diary \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd menton-diary
```

### 2. Installer les dépendances

```bash
# UI & Design
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-sheet
npm install lucide-react class-variance-authority clsx tailwind-merge

# shadcn/ui (setup)
npx shadcn@latest init
npx shadcn@latest add button card dialog sheet tabs badge toast

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Animations
npm install framer-motion

# Supabase
npm install @supabase/supabase-js

# State management
npm install zustand

# Notifications
npm install sonner

# PWA
npm install next-pwa
npm install --save-dev @types/next-pwa

# Fonts (déjà incluses via next/font)
```

### 3. Configurer Supabase

1. Aller sur [supabase.com](https://supabase.com) → New project
2. Nom : `menton-diary`
3. Copier l'URL et la clé anon dans `.env.local`
4. Ouvrir l'éditeur SQL et **exécuter dans l'ordre** :
   - Tout le contenu de `SPEC_database.md` → section "Tables SQL à créer"
   - Les `INSERT INTO days` (données initiales)
   - Les politiques RLS
5. Activer Realtime sur les tables `activities` et `restaurant_votes`

### 4. Variables d'environnement

```bash
# Copier le template
cp .env.local.example .env.local

# Éditer .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[votre-projet].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 5. Lancer le dev

```bash
npm run dev
# → http://localhost:3000
```

---

## Architecture des dossiers — rappel

```
app/
  (tabs)/           ← groupe de routes avec layout partagé
    layout.tsx      ← contient le BottomNav
    home/page.tsx
    planning/page.tsx
    activities/page.tsx
    games/page.tsx
    restaurants/page.tsx
    info/page.tsx
  layout.tsx        ← root layout (fonts, providers)
  page.tsx          ← redirect → /home
  globals.css
```

---

## Types TypeScript (`types/index.ts`)

```typescript
export type Category = 
  | 'plage' | 'restaurant' | 'visite' | 'day_trip' 
  | 'soiree' | 'sport' | 'shopping' | 'libre' | 'transport'

export interface Day {
  id: string
  date: string           // ISO date 'YYYY-MM-DD'
  label: string          // 'Samedi 27 juin'
  emoji: string
  description?: string
  is_arrival: boolean
  is_departure: boolean
  sort_order: number
}

export interface Activity {
  id: string
  day_id: string
  title: string
  description?: string
  emoji: string
  category: Category
  time_slot?: string
  duration_minutes?: number
  location_name?: string
  location_url?: string
  notes?: string
  is_baby_friendly: boolean
  sort_order: number
  created_by: string
  created_at: string
  updated_at: string
}

export type NewActivity = Omit<Activity, 'id' | 'created_at' | 'updated_at'>

export interface ActivityTemplate extends Omit<Activity, 'id' | 'day_id' | 'created_at' | 'updated_at' | 'sort_order' | 'created_by'> {
  id: string             // préfixé 'lib-'
  suggested_time_slot?: string
  tags?: string[]
}

export interface Restaurant {
  id: string
  name: string
  description?: string
  cuisine?: string
  price_range: 1 | 2 | 3
  address?: string
  google_maps_url?: string
  image_url?: string
  is_baby_friendly: boolean
  has_terrace: boolean
  notes?: string
}

export interface RestaurantVote {
  id: string
  restaurant_id: string
  voter_name: string
  vote: 1 | 2 | 3        // 1=❤️ 2=👍 3=🤷
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number        // index 0-3
  explanation?: string
}

export interface GameCard {
  id: string
  text: string
}

export type GameLevel = 'soft' | 'medium' | 'hot'

export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown>
  old: Record<string, unknown>
  table: string
}
```

---

## Ordre de développement recommandé

Claude Code doit développer dans cet ordre :

1. **Setup & Layout** : root layout, BottomNav, PageHeader, globals.css, fonts
2. **Database** : lib/supabase.ts, types, schéma SQL
3. **Page Planning** : c'est le cœur de l'app
   - Store Zustand
   - DayColumn + ActivityCard (sans drag)
   - Drag & Drop dnd-kit
   - Boutons flèches fallback
   - AddActivityModal (library picker + custom form)
   - DayPickerSheet
   - Realtime sync
4. **Page Accueil** : CountdownCard, TodayCard, QuoteCard
5. **Page Activités** : liste avec filtres + carte embed + bouton "ajouter au planning"
6. **Page Restaurants** : liste + système de votes realtime
7. **Page Jeux** : Quiz + Vérité ou Défi
8. **Page Infos** : contenu statique
9. **PWA** : manifest + next-pwa config
10. **Polish** : animations Framer Motion, loading states, empty states

---

## Notes importantes pour Claude Code

- **Ne jamais utiliser `<form>` HTML natif** — toujours des handlers React
- **Optimistic UI partout** — l'UI répond instantanément, Supabase suit
- **Mobile-first** — tester avec DevTools en mode iPhone 14 Pro (390x844)
- **Bottom sheet** sur mobile, jamais de modal centré classique
- **Drag handle visible** sur les ActivityCards — l'utilisateur doit comprendre qu'il peut drag
- **Toasts** pour confirmer toutes les actions (ajout, déplacement, suppression)
- Le jour d'arrivée (27 juin) et départ (4 juillet) : afficher un badge spécial, ne pas permettre de les supprimer
