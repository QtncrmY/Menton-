# CLAUDE.md — Menton Diary

## Vue d'ensemble du projet

**Menton Diary** est une Progressive Web App (PWA) de carnet de voyage interactif pour un groupe de 2 couples + 1 bébé partant à Menton du 27 juin au 4 juillet 2026.

L'app doit être **mobile-first**, **ultra user-friendly**, avec un design de type carnet de voyage moderne (Côte d'Azur vibes — bleu méditerranée, blanc, touches dorées/citron).

---

## Stack technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS + shadcn/ui
- **Drag & Drop** : `@dnd-kit/core` + `@dnd-kit/sortable`
- **Base de données** : Supabase (PostgreSQL + Realtime)
- **State management** : Zustand
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **PWA** : next-pwa

---

## Structure des fichiers à générer

```
menton-diary/
├── CLAUDE.md                  ← ce fichier
├── .env.local.example
├── package.json
├── next.config.js
├── tailwind.config.js
├── app/
│   ├── layout.tsx
│   ├── page.tsx               ← redirect vers /home
│   ├── globals.css
│   ├── (tabs)/
│   │   ├── home/page.tsx      ← Accueil
│   │   ├── planning/page.tsx  ← Planning drag & drop
│   │   ├── activities/page.tsx← Activités + carte
│   │   ├── games/page.tsx     ← Jeux
│   │   ├── restaurants/page.tsx
│   │   └── info/page.tsx
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   └── PageHeader.tsx
│   ├── planning/
│   │   ├── DayColumn.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── DraggableActivity.tsx
│   │   ├── AddActivityModal.tsx
│   │   └── ActivityLibraryPicker.tsx
│   ├── home/
│   │   ├── CountdownCard.tsx
│   │   ├── WeatherWidget.tsx
│   │   └── QuoteOfDay.tsx
│   ├── games/
│   │   ├── QuizGame.tsx
│   │   └── TruthOrDare.tsx
│   └── ui/                    ← shadcn components
├── lib/
│   ├── supabase.ts
│   ├── supabase-realtime.ts
│   └── utils.ts
├── hooks/
│   ├── usePlanning.ts
│   ├── useActivities.ts
│   └── useRealtime.ts
├── store/
│   └── planningStore.ts
├── types/
│   └── index.ts
└── data/
    ├── activities-library.ts  ← bibliothèque d'activités prédéfinies
    ├── restaurants.ts
    └── games.ts
```

---

## Règles de développement

1. **Mobile-first absolu** — tout doit fonctionner parfaitement sur iPhone/Android
2. **Touch targets** ≥ 44×44px sur tous les boutons interactifs
3. **Optimistic UI** — les changements s'affichent immédiatement, sync Supabase en arrière-plan
4. **Offline graceful** — si pas de réseau, l'app reste utilisable (lecture seule)
5. **Accessibilité** — aria-labels sur tous les éléments interactifs
6. **Animations** — subtiles (150-300ms), jamais bloquantes
7. **Pas de form HTML natif** — utiliser les handlers React (onClick, onChange)

---

## Commandes de développement

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run start
```

---

## Fichiers de spec détaillés

Lire dans cet ordre :
1. `SPEC_database.md` — schéma Supabase
2. `SPEC_planning.md` — feature planning drag & drop
3. `SPEC_activities.md` — bibliothèque + ajout custom
4. `SPEC_games.md` — jeux quiz + vérité/défi
5. `SPEC_design.md` — design system complet
