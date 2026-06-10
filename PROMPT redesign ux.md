# PROMPT — Redesign UX/UI Premium : Menton Diary

## Contexte

Tu vas redesigner visuellement et UX l’application **Menton Diary** — un carnet de voyage interactif pour 2 couples + 1 bébé partant à Menton (Côte d’Azur, France) du 27 juin au 4 juillet 2026.

L’app existe déjà (Next.js 14, Tailwind, Supabase). Le backend et la logique ne changent pas. **Tu touches uniquement au design, aux composants visuels et à l’expérience utilisateur.**

-----

## Identité visuelle à créer

### Concept

**“Carnet de voyage méditerranéen premium”** — comme si Airbnb et un magazine de voyage haut de gamme avaient designé une app ensemble. Chaleur du Sud, lumière de la Côte d’Azur, légèreté estivale. Pas un design “touriste”, un design pour des gens qui voyagent avec goût.

### Palette de couleurs — à implémenter exactement

```
--color-sea:       #0077B6   /* Méditerranée profonde — couleur primaire */
--color-sky:       #90E0EF   /* Ciel clair — accents légers */
--color-sun:       #F4D03F   /* Citron de Menton — signature accent */
--color-sand:      #FAF3E0   /* Sable chaud — fond principal */
--color-dusk:      #1A1A2E   /* Nuit côtière — textes et éléments foncés */
--color-coral:     #E76F51   /* Corail — erreurs, badges urgents */
--color-white:     #FFFFFF
--color-mist:      #F0F4F8   /* Fond secondaire, cards */
```

### Typographie — à installer et implémenter

```
Display face  : "Cormorant Garamond" (Google Fonts) — titres de pages, grands nombres, citations
Body face     : "Plus Jakarta Sans" (Google Fonts) — tout le reste
Code/data     : "JetBrains Mono" — heures, durées, données

Échelle type :
  display-xl : 2.5rem / 700 / letter-spacing -0.02em  (titres pages)
  display-lg : 1.875rem / 600 / italic autorisé       (sous-titres section)  
  body-lg    : 1.125rem / 400                          (texte principal)
  body-md    : 1rem / 400                              (texte standard)
  label      : 0.75rem / 600 / uppercase / ls 0.08em  (badges, labels)
  mono       : 0.875rem / JetBrains Mono               (heures, durées)
```

### Signature unique — L’élément mémorable

**Une texture de vague SVG animée subtile** en header de chaque page — une sinusoïde lente et douce (#0077B6 à 8% d’opacité) qui ondule en arrière-plan. Rappelle la mer sans être kitsch. Amplitude faible, vitesse lente (20s loop), `prefers-reduced-motion` respecté.

-----

## Redesign page par page

### 1. Layout global & BottomNav

**Avant :** BottomNav générique blanc.

**Après :**

- Fond `--color-dusk` (bleu nuit) avec items en blanc
- Onglet actif : pastille `--color-sun` (citron) sous l’icône + label en `--color-sun`
- Icônes Lucide React taille 22px
- Hauteur 68px + safe-area-inset-bottom
- Backdrop blur sur scroll : `backdrop-filter: blur(20px)` avec fond semi-transparent
- Transition active tab : spring animation Framer Motion (stiffness 400, damping 30)

```tsx
// Structure BottomNav
<nav className="fixed bottom-0 left-0 right-0 z-50"
     style={{ background: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(20px)' }}>
  <div className="flex items-center justify-around px-2 pb-safe"
       style={{ height: '68px' }}>
    {tabs.map(tab => (
      <NavItem key={tab.id} tab={tab} isActive={currentTab === tab.id} />
    ))}
  </div>
</nav>
```

### 2. Page Accueil (`/home`)

**Redesign complet :**

```
┌──────────────────────────────────────┐
│  [photo Menton en fond, overlay      │  ← Hero pleine largeur, 260px
│   gradient dusk→transparent]         │     Photo : /public/menton-hero.jpg
│                                      │     (utiliser une image placeholder
│  Menton 2026          🌊             │      depuis unsplash.com/s/photos/menton)
│  27 juin — 4 juillet                 │
│  ════════════════════════            │  ← divider animé (wave SVG)
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │  DÉPART DANS              23  │  │  ← CountdownCard
│  │  jours                   JOURS│  │     fond: gradient sea→sky
│  │  ─────────────────────────    │  │     "23" en Cormorant 4rem bold
│  │  Sam 27 juin · Vol + route    │  │     sous-texte en Plus Jakarta Sans
│  └────────────────────────────────┘  │
│                                      │
│  AUJOURD'HUI                         │  ← label uppercase JakartaSans
│  ┌────────────────────────────────┐  │
│  │  🎰  Lundi 29 juin             │  │  ← TodayCard (pendant le voyage)
│  │  Day trip Monaco + Eze         │  │     fond: --color-mist
│  │  ● 4 activités · 8h de voyage  │  │     accent line --color-sun à gauche
│  │              [Voir →]          │  │
│  └────────────────────────────────┘  │
│                                      │
│  LE GROUPE                           │
│  ┌─────────┐ ┌─────────┐            │
│  │ 👫 Vous │ │👫 Amis  │  👶        │  ← avatars ronds avec initiales
│  │         │ │         │            │
│  └─────────┘ └─────────┘            │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  " La mer lave tous les maux   │  │  ← QuoteCard
│  │    de l'homme "                │  │     Cormorant Garamond italic
│  │                    — Platon    │  │     fond: --color-sand
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 3. Page Planning (`/planning`) — La plus importante

**Redesign :**

#### Header des jours (tabs horizontaux scrollables)

```
Présentation : scroll horizontal, snap mandatory
Chaque tab :
  - Inactif : fond mist, texte dusk/60, emoji + date courte
  - Actif : fond sea, texte white, emoji + date courte
  - Taille : 72px × auto, border-radius 16px
  - Gap entre tabs : 8px
  - Padding horizontal liste : 16px
  - Snap : scroll-snap-align center
```

#### ActivityCard — redesign complet

```
┌────────────────────────────────────────┐
│  ⠿  ┊  🏖️  Plage des Sablettes        │ ← ⠿ = grip (drag handle), ┊ = accent
│       ┊  Matin · 3h · Plage           │   accent bar couleur catégorie (4px left)
│       ┊  📍 Menton           🍼       │
│       ┊─────────────────────────────  │
│       ┊  [↑] [↓]  [→ Déplacer]  [···]│ ← ··· = menu contextuel (éditer/suppr)
└────────────────────────────────────────┘

Style :
  - fond: white
  - border-radius: 16px
  - shadow: 0 2px 8px rgba(0,119,182,0.08)
  - border-left: 4px solid [couleur catégorie]
  - grip icon: color dusk/20, visible en permanence sur mobile
  - hover/press: shadow monte à 0 4px 16px rgba(0,119,182,0.15)
  - état dragging: scale(1.02), shadow élevée, opacity 0.9
```

#### Couleurs accent par catégorie (border-left)

```typescript
const CATEGORY_ACCENT = {
  plage:      '#0077B6',  // sea
  restaurant: '#E76F51',  // coral
  visite:     '#7B2D8B',  // violet
  day_trip:   '#2D8B4A',  // vert forêt
  soiree:     '#1A1A2E',  // dusk
  sport:      '#E76F51',  // coral
  shopping:   '#F4A261',  // orange doux
  libre:      '#90E0EF',  // sky
  transport:  '#6B7280',  // gris
}
```

#### Bouton “Ajouter une activité”

```
Style : bouton outline dashed, pleine largeur
Fond : transparent
Border : 2px dashed --color-sea/30
Texte : "+ Ajouter une activité" en label uppercase, couleur sea
Icône : Plus (Lucide), 18px
Border-radius : 16px
Hauteur : 52px
Hover/press : fond sea/5, border sea/60
```

#### AddActivityModal — Bottom Sheet

```
Design de la sheet :
  - Drag handle : barre 40×4px, couleur dusk/20, centré en top
  - Fond : white
  - Border-radius top : 24px
  - Shadow : 0 -8px 32px rgba(0,0,0,0.12)
  - Max height : 85dvh
  
Onglets Bibliothèque / Créer :
  - Pill tabs (pas de barre soulignée)
  - Actif : fond sea, texte white, border-radius 999px
  - Inactif : fond transparent, texte dusk/60

Cartes bibliothèque :
  - Liste verticale, chaque carte : fond mist, radius 12px
  - Emoji 32px à gauche dans un carré sand 48×48 radius 10px
  - Titre + description en 2 lignes max
  - Badge catégorie + badge 🍼 si applicable
  - Bouton "+ Ajouter" : compact, en bout de ligne, outline sea

Formulaire custom :
  - Inputs : fond mist, border none, radius 12px, padding 14px
  - Focus : ring sea/30 2px
  - Emoji picker : grille 5×3, taille 32px, tap = sélection
  - Submit btn : pleine largeur, fond sea, text white, radius 12px, height 52px
```

### 4. Page Activités (`/activities`)

```
Header : titre "Activités" + compte "(18)"
Filtres : pill buttons scroll horizontal
  - Actif : fond sea, text white
  - Inactif : fond mist, text dusk/70

Carte Google Maps : radius 16px, overflow hidden, shadow douce

Cards activités :
  - Image placeholder (gradient catégorie) si pas de photo
  - Fond white, radius 16px, shadow légère
  - Bottom : bouton "Ajouter au planning" — fond sun (#F4D03F), text dusk
  - Badge baby-friendly : pill vert doux
```

### 5. Page Jeux (`/games`)

```
Header : fond gradient dusk→sea (ambiance soirée)
Deux cards de sélection :
  ┌─────────────────────┐  ┌─────────────────────┐
  │  🧠                 │  │  🎭                 │
  │  Quiz               │  │  Vérité             │
  │  Côte d'Azur        │  │  ou Défi            │
  │                     │  │                     │
  │  12 questions sur   │  │  Fun en soirée      │
  │  la région          │  │  pour 4 joueurs     │
  │                     │  │                     │
  │  [Jouer →]          │  │  [Jouer →]          │
  └─────────────────────┘  └─────────────────────┘

Cards : fond dusk, text white, radius 20px, 
        accent sun en bas (border-bottom 3px solid sun)
        hover : scale 1.02, shadow élevée

Quiz — carte question :
  - Fond white, radius 20px, padding 24px
  - Question : Cormorant Garamond 1.5rem
  - Timer : barre de progression animée, couleur sea → coral selon urgence
  - Options : boutons outline, radius 12px, 
              correct = fond emerald/10 border emerald
              incorrect = fond red/10 border red
  - Animation reveal : spring (scale + fade)

Vérité ou Défi — carte :
  - Roulette : nom joueur en Cormorant 2rem, 
               animation spin CSS (ease-out, décélération)
  - Carte vérité : fond sky/20, accent left sea
  - Carte défi : fond sun/20, accent left sun
  - Texte : Cormorant italic 1.25rem
```

### 6. Page Restaurants (`/restaurants`)

```
Card restaurant :
  - Fond white, radius 16px, shadow
  - Top : bande couleur (gradient sea→sky) 8px hauteur (pas d'image)
  - Infos : nom bold, cuisine light, price range en pills €
  - Badges : terrasse 🌿, baby 🍼, etc.
  - Section votes : avatars prénoms + icône vote
    ❤️ = coral, 👍 = sea/60, 🤷 = dusk/30
  - Mes boutons vote : 3 pills, tap = sélection animée
  - CTA : [📍 Maps] outline, [📞 Réserver] fond sea
```

-----

## Micro-interactions & Animations

### Règles globales

```
Duration tokens :
  instant  : 100ms  (tap feedback)
  fast     : 150ms  (hovers, toggles)
  normal   : 250ms  (modals, transitions)
  slow     : 400ms  (page transitions, reveals)
  ambient  : 20s    (wave background)

Easing :
  spring   : stiffness 400, damping 30  (drag, modals)
  ease-out : cubic-bezier(0,0,0.2,1)   (entrées)
  ease-in  : cubic-bezier(0.4,0,1,1)   (sorties)
```

### Animations à implémenter

**Page load** : chaque card apparaît en stagger (délai 60ms entre chaque), depuis y+16, opacity 0→1.

**ActivityCard drag** : scale(1.03) + shadow élevée + légère rotation aléatoire (±1.5deg) pendant le drag. La zone de drop cible pulse doucement en sea/10.

**Vote restaurant** : tap sur ❤️ → scale bounce (1→1.3→1) + confetti emoji flottant vers le haut (3 petits ❤️ qui montent et disparaissent).

**Countdown** : le nombre de jours pulse doucement toutes les 5s (scale 1→1.02→1, 400ms).

**Tab switch** : les cards de la nouvelle journée arrivent depuis la droite (ou gauche selon direction), spring animation.

**Quiz timer** : la barre de progression change de couleur progressivement : sea (15s) → orange (8s) → coral (3s) avec légère pulsation sur les 3 dernières secondes.

**Bottom sheet open/close** : spring depuis y+100% à y=0. L’overlay apparaît en fade 200ms.

-----

## Composants à créer / refactoriser

### `WaveBackground.tsx`

```tsx
// SVG animé en fond de header
// Amplitude : 6px, longueur d'onde : 100%, vitesse : 20s
// Couleur : --color-sea à 8% opacité
// prefers-reduced-motion : animation stoppée
export function WaveBackground({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
           className="absolute bottom-0 w-full wave-animate"
           style={{ opacity: 0.08 }}>
        <path d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,60 L0,60 Z"
              fill="#0077B6" />
      </svg>
    </div>
  )
}
// CSS : @keyframes wave { 0%,100% { d: path(...) } 50% { d: path(shifted) } }
```

### `CategoryBadge.tsx`

```tsx
// Pill badge avec couleur catégorie
// Taille : text-xs font-semibold uppercase tracking-wider
// Padding : px-2 py-0.5, radius full
// Fond : couleur catégorie à 12% opacité, text à 100%
```

### `GripHandle.tsx`

```tsx
// Icône de drag toujours visible sur mobile
// 6 points en grille 2×3 (pattern grip)
// Couleur : dusk/25, taille 16×20px
// Touch target étendu : padding 12px invisible autour
```

### `BottomSheet.tsx`

```tsx
// Composant générique réutilisable
// Props : isOpen, onClose, title, children, snapPoints?
// Drag handle en haut
// Overlay click = ferme
// Swipe down = ferme (useGesture de @use-gesture/react)
```

### `PageTransition.tsx`

```tsx
// Wrapper Framer Motion pour transitions de pages
// Détecte la direction du tab switch (gauche/droite)
// Applique la slide animation appropriée
```

-----

## Globals CSS à ajouter

```css
/* globals.css */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --color-sea:   #0077B6;
  --color-sky:   #90E0EF;
  --color-sun:   #F4D03F;
  --color-sand:  #FAF3E0;
  --color-dusk:  #1A1A2E;
  --color-coral: #E76F51;
  --color-white: #FFFFFF;
  --color-mist:  #F0F4F8;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-body);
  background: var(--color-sand);
  color: var(--color-dusk);
  -webkit-font-smoothing: antialiased;
}

.font-display { font-family: var(--font-display); }
.font-mono    { font-family: var(--font-mono); }

/* Wave animation */
@keyframes wave-drift {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.wave-animate {
  animation: wave-drift 20s linear infinite;
  width: 200%;
}
@media (prefers-reduced-motion: reduce) {
  .wave-animate { animation: none; }
}

/* Smooth scrolling snap pour les tabs */
.snap-x-mandatory {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.snap-center { scroll-snap-align: center; }

/* Safe area */
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }

/* Touch feedback */
.touch-feedback {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.touch-feedback:active { opacity: 0.7; transition: opacity 100ms; }
```

-----

## Tailwind config à étendre

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        sea:   '#0077B6',
        sky:   '#90E0EF',
        sun:   '#F4D03F',
        sand:  '#FAF3E0',
        dusk:  '#1A1A2E',
        coral: '#E76F51',
        mist:  '#F0F4F8',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card':    '0 2px 8px rgba(0,119,182,0.08)',
        'card-hover': '0 4px 16px rgba(0,119,182,0.15)',
        'sheet':   '0 -8px 32px rgba(0,0,0,0.12)',
        'nav':     '0 -1px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'card': '16px',
        'sheet': '24px',
      },
      animation: {
        'wave': 'wave-drift 20s linear infinite',
        'pulse-soft': 'pulse 5s ease-in-out infinite',
      }
    }
  }
}
```

-----

## Instructions finales pour Claude Code

1. **Commence par** mettre à jour `globals.css` et `tailwind.config.js` — tout le reste en dépend.
1. **Ensuite** refactorise les composants partagés dans cet ordre :
   `WaveBackground` → `BottomNav` → `PageHeader` → `ActivityCard` → `BottomSheet`
1. **Puis** page par page : Home → Planning → Activities → Games → Restaurants → Info
1. **Principe d’or** : si un élément n’est pas dans cette spec, applique le design token le plus proche. Jamais de couleur hardcodée hors palette.
1. **Teste chaque page** en DevTools mode iPhone 14 Pro (390×844px) avant de passer à la suivante.
1. **Ne touche pas** à la logique Supabase, au store Zustand, ni aux hooks — uniquement le JSX/CSS/Framer Motion.
1. **La vague SVG** en background est la signature. Elle doit apparaître dans le header de chaque page principale, discrète mais présente.