# SPEC_planning.md — Planning interactif drag & drop

## Objectif

Page centrale de l'app. Permet de visualiser le voyage jour par jour et de **réorganiser les activités librement** : drag & drop tactile + fallback boutons flèches. Synchronisation temps réel via Supabase entre tous les appareils.

---

## Layout général

### Vue mobile (défaut)
```
┌─────────────────────────────┐
│  📅 Notre Planning           │ ← PageHeader
│  Menton • 27 juin – 4 juil. │
├─────────────────────────────┤
│  [Sam 27] [Dim 28] [Lun 29] │ ← Tabs des jours (scroll horizontal)
│  [Mar 30] [Mer 1] [Jeu 2]   │
│  [Ven 3]  [Sam 4]           │
├─────────────────────────────┤
│                             │
│  ✈️ Samedi 27 juin           │ ← DayColumn actif
│  Arrivée & installation     │
│                             │
│  ┌─────────────────────┐    │
│  │ 🚗 Trajet & arrivée │ ⠿ │ ← ActivityCard (⠿ = drag handle)
│  │ Après-midi          │    │
│  │ [↑][↓]  [✏️] [🗑️]  │    │ ← boutons fallback
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 🛒 Courses & instal.│ ⠿ │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 🍷 Apéro vue mer    │ ⠿ │
│  └─────────────────────┘    │
│                             │
│  [+ Ajouter une activité]   │ ← bouton sticky en bas
└─────────────────────────────┘
```

---

## Composants

### `DayColumn.tsx`
- Affiche le header du jour (emoji + label + description)
- Badge "Arrivée" / "Départ" sur les jours correspondants
- Badge bébé 👶 si toutes les activités sont baby-friendly
- Liste des `ActivityCard` dans un contexte `SortableContext` de dnd-kit
- Bouton sticky "＋ Ajouter" en bas

**Props :**
```typescript
interface DayColumnProps {
  day: Day
  activities: Activity[]
  onAddActivity: (dayId: string) => void
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (activityId: string) => void
  onMoveActivity: (activityId: string, direction: 'up' | 'down' | 'day') => void
}
```

### `ActivityCard.tsx`
Carte d'une activité individuelle.

**Zones visuelles :**
```
┌──────────────────────────────────┐
│ ⠿  🏖️  Plage des Sablettes      │
│     Matin • 2h • 📍 Menton       │
│     "Plage de galets, eau turq..." │
│     [🍼] [↑] [↓] [→ déplacer]   │
│          [✏️ éditer] [🗑️ sup]    │
└──────────────────────────────────┘
```

- `⠿` = drag handle (grip icon) — déclenche le drag & drop
- Badge catégorie coloré (voir design system)
- `[🍼]` badge si baby-friendly
- `[↑][↓]` = monter/descendre dans la journée
- `[→ déplacer]` = ouvre un picker pour choisir un autre jour
- Long press sur mobile = active le mode drag

**Props :**
```typescript
interface ActivityCardProps {
  activity: Activity
  isDragging?: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onMoveToDay: (targetDayId: string) => void
  isFirst: boolean
  isLast: boolean
}
```

### `DraggableActivity.tsx`
Wrapper dnd-kit autour de `ActivityCard`.

```typescript
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function DraggableActivity({ activity, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ActivityCard
        activity={activity}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
        {...props}
      />
    </div>
  )
}
```

### `AddActivityModal.tsx`
Modal en bottom sheet (remonte depuis le bas sur mobile).

**Deux onglets dans la modal :**

#### Onglet 1 : Bibliothèque
```
┌─────────────────────────────┐
│  ← Bibliothèque d'activités │
│  [🏖️ Plage] [🏛️ Visite]    │ ← filtres catégorie
│  [🍽️ Resto] [🚗 Day trip]  │
│  [🌙 Soirée] [⚡ Sport]     │
│                             │
│  ┌──────────────────────┐   │
│  │ 🏖️ Plage des Sablettes│   │
│  │ Plage de galets, eau  │   │
│  │ turquoise, parfaite   │   │
│  │ pour bébé 🍼          │   │
│  │         [+ Ajouter]   │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ 🏖️ Plage de Garavan  │   │
│  │ ...                   │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

#### Onglet 2 : Créer custom
```
┌─────────────────────────────┐
│  ← Créer une activité       │
│                             │
│  Titre *                    │
│  [________________________] │
│                             │
│  Emoji                      │
│  [🏖️] [🍽️] [🏛️] [🚗] [⚡]  │ ← picker rapide
│                             │
│  Catégorie *                │
│  [Plage ▼]                  │
│                             │
│  Créneau horaire            │
│  [Matin ▼]                  │
│                             │
│  Durée estimée              │
│  [2h ▼]                     │
│                             │
│  Notes (optionnel)          │
│  [________________________] │
│                             │
│  Baby-friendly ? [✓]        │
│                             │
│       [Annuler] [Ajouter ✓] │
└─────────────────────────────┘
```

---

## Drag & Drop — Comportement détaillé

### Setup dnd-kit

```typescript
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

// Configurer les sensors pour mobile ET desktop
const sensors = useSensors(
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,        // long press 200ms pour déclencher
      tolerance: 8,      // tolérance mouvement 8px
    },
  }),
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,       // drag commence après 8px de mouvement
    },
  })
)
```

### Zones de drop
- Chaque `DayColumn` est une zone de drop distincte
- Une activité peut être droppée **dans la même journée** (réordonnage) ou **dans une autre journée** (déplacement)
- Feedback visuel : la zone cible se colore légèrement en bleu clair lors du survol

### Drag Overlay
Pendant le drag, afficher une carte "fantôme" semi-transparente qui suit le doigt :
```typescript
<DragOverlay>
  {activeActivity ? (
    <ActivityCard activity={activeActivity} isDragging={true} />
  ) : null}
</DragOverlay>
```

---

## Fallback — Boutons flèches

Pour les utilisateurs qui ne veulent pas utiliser le drag & drop :

- `[↑]` : déplace l'activité d'une position vers le haut dans la même journée
- `[↓]` : déplace l'activité d'une position vers le bas dans la même journée
- `[→ Déplacer vers...]` : ouvre un **DayPickerSheet** — bottom sheet avec la liste des jours, l'utilisateur tape sur le jour cible

### `DayPickerSheet.tsx`
```
┌─────────────────────────────┐
│  Déplacer vers quel jour ?  │
│  ─────────────────────────  │
│  ✈️  Sam 27 juin — Arrivée  │
│  🏖️  Dim 28 juin            │ ← tap pour déplacer
│  🎰  Lun 29 juin — Monaco   │
│  🌊  Mar 30 juin            │
│  🌆  Mer 1er juillet        │
│  🍋  Jeu 2 juillet          │
│  🌅  Ven 3 juillet          │
│  ─────────────────────────  │
│  [Annuler]                  │
└─────────────────────────────┘
```

---

## Store Zustand (`store/planningStore.ts`)

```typescript
interface PlanningStore {
  days: Day[]
  activities: Record<string, Activity[]>  // clé = day_id
  isLoading: boolean
  
  // Actions
  fetchAll: () => Promise<void>
  addActivity: (dayId: string, activity: NewActivity) => Promise<void>
  updateActivity: (activity: Activity) => Promise<void>
  deleteActivity: (activityId: string) => Promise<void>
  moveActivity: (activityId: string, targetDayId: string, newOrder: number) => Promise<void>
  reorderActivities: (dayId: string, reorderedActivities: Activity[]) => Promise<void>
  
  // Realtime
  handleRealtimeChange: (payload: RealtimePayload) => void
}
```

### Optimistic UI
Toutes les mutations suivent ce pattern :
```typescript
async function moveActivity(activityId, targetDayId, newOrder) {
  // 1. Mise à jour immédiate du store local
  set(state => ({ /* update local state */ }))
  
  // 2. Sync Supabase en arrière-plan
  try {
    await supabase.from('activities').update({
      day_id: targetDayId,
      sort_order: newOrder,
      updated_at: new Date().toISOString()
    }).eq('id', activityId)
  } catch (error) {
    // 3. Rollback si échec
    set(state => ({ /* revert */ }))
    toast.error('Erreur de synchronisation')
  }
}
```

---

## Animations Framer Motion

```typescript
// Apparition d'une activité ajoutée
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, x: -20,
    transition: { duration: 0.15 }
  }
}

// Wrapper liste avec AnimatePresence
<AnimatePresence>
  {activities.map(activity => (
    <motion.div
      key={activity.id}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout  // ← gère le réordonnage automatiquement
    />
  ))}
</AnimatePresence>
```

---

## Gestion des conflits Realtime

Si deux personnes modifient en même temps :
- **Last write wins** — la dernière mise à jour Supabase gagne
- Toast discret : *"Planning mis à jour par le groupe"* lors d'une sync entrante
- Pas de lock optimiste — trop complexe pour cet usage
