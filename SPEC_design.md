# SPEC_design.md — Design System "Menton Diary"

## Identité visuelle

**Concept :** Carnet de voyage moderne — comme un carnet Moleskine premium rencontrant une app mobile élégante. Côte d'Azur vibes : bleu méditerranée, blanc soleil, touches citron et or.

**Mood :** Léger, estival, joyeux, sans être enfantin. Premium mais accessible.

---

## Palette de couleurs

```typescript
// tailwind.config.js — extend colors

colors: {
  // Primaires
  azure: {
    50:  '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',   // ← couleur principale
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Accent citron (signature Menton)
  citron: {
    50:  '#fefce8',
    100: '#fef9c3',
    300: '#fde047',
    400: '#facc15',   // ← accent principal
    500: '#eab308',
  },
  // Sable
  sand: {
    50:  '#faf9f7',
    100: '#f5f0e8',
    200: '#ede4d3',
    300: '#d9c9a8',
  },
  // Corail (erreurs, alertes)
  coral: {
    400: '#fb7185',
    500: '#f43f5e',
  }
}
```

---

## Typographie

```typescript
// next.config.js + layout.tsx

import { Instrument_Serif, DM_Sans } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

// Utilisation :
// Titres pages    : font-display text-3xl font-normal (Instrument Serif)
// Sous-titres     : font-body text-lg font-semibold (DM Sans 600)
// Corps texte     : font-body text-base font-normal (DM Sans 400)
// Labels/UI       : font-body text-sm font-medium (DM Sans 500)
// Petits textes   : font-body text-xs font-normal (DM Sans 400)
```

---

## Tokens de spacing et layout

```
Base unit : 4px
Spacing scale : 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

Radius :
  sm : 8px
  md : 12px
  lg : 16px
  xl : 20px
  2xl: 24px
  full: 9999px

Safe area bottom : pb-safe (pour iPhone notch)
Bottom nav height : 64px
Top header height : 56px
```

---

## Composants UI clés

### BottomNav
```tsx
// 6 onglets, icônes Lucide + labels
// Position : fixed bottom-0, hauteur 64px + safe area
// Background : white/95 avec backdrop-blur-md
// Onglet actif : couleur azure-500, underline citron-400
// Touch target : min 44x44px

const tabs = [
  { id: 'home',       icon: Home,      label: 'Accueil',   href: '/home' },
  { id: 'planning',   icon: Calendar,  label: 'Planning',  href: '/planning' },
  { id: 'activities', icon: MapPin,    label: 'Activités', href: '/activities' },
  { id: 'games',      icon: Gamepad2,  label: 'Jeux',      href: '/games' },
  { id: 'restaurants',icon: Utensils,  label: 'Restos',    href: '/restaurants' },
  { id: 'info',       icon: Info,      label: 'Infos',     href: '/info' },
]
```

### ActivityCard — couleurs par catégorie
```typescript
export const CATEGORY_STYLES: Record<Category, { bg: string, text: string, icon: string }> = {
  plage:      { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: '🏖️' },
  restaurant: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🍽️' },
  visite:     { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🏛️' },
  day_trip:   { bg: 'bg-emerald-100',text: 'text-emerald-700',icon: '🚗' },
  soiree:     { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🌙' },
  sport:      { bg: 'bg-red-100',    text: 'text-red-700',    icon: '⚡' },
  shopping:   { bg: 'bg-pink-100',   text: 'text-pink-700',   icon: '🛍️' },
  libre:      { bg: 'bg-gray-100',   text: 'text-gray-600',   icon: '☀️' },
  transport:  { bg: 'bg-slate-100',  text: 'text-slate-600',  icon: '🚂' },
}
```

### PageHeader
```tsx
// Gradient header avec titre en Instrument Serif
// Fond : gradient azure-600 → azure-400 pour pages principales
// Fond : white pour pages secondaires
// Height : 56px
// Shadow : shadow-sm

<header className="sticky top-0 z-40 bg-gradient-to-r from-azure-700 to-azure-500">
  <div className="px-4 h-14 flex items-center justify-between">
    <h1 className="font-display text-xl text-white">Planning</h1>
    <div className="flex gap-2">
      {/* actions contextuelles */}
    </div>
  </div>
</header>
```

### Bottom Sheet Modal
```tsx
// Remonte depuis le bas avec animation
// Overlay sombre semi-transparent
// Drag handle en haut (petite barre grise)
// Border radius top-left/right : 20px
// Hauteur : 85vh max, scroll interne

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0, 
    transition: { type: 'spring', damping: 30, stiffness: 300 }
  },
  exit: { 
    y: '100%',
    transition: { duration: 0.2, ease: 'easeIn' }
  }
}
```

### Toast notifications
```tsx
// Utiliser react-hot-toast ou Sonner
// Position : top-center sur mobile
// Durée : 3s
// Styles :
//   Succès : bg-emerald-50 border-emerald-200 text-emerald-800
//   Erreur : bg-red-50 border-red-200 text-red-800  
//   Info   : bg-azure-50 border-azure-200 text-azure-800
//   Sync   : bg-citron-50 border-citron-200 text-citron-800

toast.success('Activité déplacée ✓')
toast('Planning mis à jour par le groupe 🔄', { icon: '🔄' })
```

---

## Page Accueil — `app/(tabs)/home/page.tsx`

```
┌─────────────────────────────────┐
│  🌊 Menton 2026                 │ ← Header avec photo de fond
│  27 juin – 4 juillet            │   (image Menton en overlay)
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │  ✈️ Départ dans           │  │ ← CountdownCard
│  │     23 jours              │  │   gradient azure
│  │  ─────────────────────    │  │
│  │  📅 Sam 27 juin           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  📋 Aujourd'hui           │  │ ← TodayCard
│  │  Lundi 29 juin            │  │   (pendant le voyage)
│  │  🎰 Day trip Monaco + Eze │  │
│  │  3 activités planifiées   │  │
│  │  [Voir le planning →]     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  👨‍👩‍👧 Le groupe             │  │ ← GroupCard
│  │  🙋 Couple 1    🙋 Couple 2│  │
│  │  👶 + 1 bébé              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  💬 Citation du jour      │  │ ← QuoteCard
│  │  "La mer lave tous les    │  │   (rotation quotidienne)
│  │   maux de l'homme"        │  │
│  │  — Platon                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🍋 Le saviez-vous ?      │  │ ← FunFactCard
│  │  Menton est la ville la   │  │   (rotation quotidienne)
│  │  plus chaude des Alpes-   │  │
│  │  Maritimes !              │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Page Restaurants — `app/(tabs)/restaurants/page.tsx`

```
┌─────────────────────────────────┐
│  🍽️ Nos Restaurants             │
│  [Tous][€][€€][€€€][🍼 Bébé]   │ ← filtres
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ 🌟 Chez Mireille          │  │
│  │ Méditerranéen • €€        │  │
│  │ Terrasse vue mer 🌊       │  │
│  │ Baby-friendly 🍼          │  │
│  │ ─────────────────────     │  │
│  │ Votes du groupe :         │  │
│  │ Sophie ❤️  Robin 👍       │  │
│  │ Valentine ❤️  Toi ?       │  │
│  │ [❤️ J'adore] [👍 Ok] [🤷] │  │
│  │ [📍 Maps] [📞 Réserver]   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Page Infos — `app/(tabs)/info/page.tsx`

Sections :
- 🚂 **Transport** : train Menton-Monaco (20min, 1.60€), Menton-Nice (40min, ~5€), bus 100 (côtier), taxi
- 🏥 **Urgences** : SAMU 15, Pompiers 18, Police 17, hôpital Menton
- 👶 **Bébé** : pharmacies proches, pédiatre, plages adaptées, supermarchés
- 🌡️ **Météo** : lien Météo France Menton
- 📶 **Pratique** : wifi logement, parking, supermarchés
- 💰 **Budget** : récap des coûts moyens

---

## Animations globales

```typescript
// Transition de page (entre onglets)
const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2, ease: 'easeInOut' }
}

// Apparition des cards
const cardEntrance = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: 'easeOut' }
}

// Stagger pour les listes
const listStagger = {
  animate: { transition: { staggerChildren: 0.06 } }
}
```

---

## PWA Config (`next.config.js` avec next-pwa)

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

// manifest.json
{
  "name": "Menton Diary 🌊",
  "short_name": "Menton",
  "description": "Notre carnet de voyage à Menton",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0284c7",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Installer l'app :** Banner "Ajouter à l'écran d'accueil" sur la page Home.

---

## Checklist qualité UI

- [ ] Toutes les touches ≥ 44×44px
- [ ] Contraste texte ≥ 4.5:1
- [ ] Safe area bottom respectée (iPhone)
- [ ] Scroll fluide sur toutes les pages
- [ ] Loading states sur tous les fetches async
- [ ] Empty states visuels (aucune activité, aucun vote...)
- [ ] Animations ≤ 300ms
- [ ] Pas de CLS (layout shift) au chargement
- [ ] Dark mode : non requis pour cette version
