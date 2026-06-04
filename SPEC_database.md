# SPEC_database.md — Schéma Supabase

## Vue d'ensemble

Toutes les données sont stockées dans Supabase. Le **Realtime** est activé sur les tables `activities` et `votes_restaurant` pour synchroniser les 4 appareils en temps réel.

---

## Tables SQL à créer

### 1. `days`
Représente chaque jour du voyage.

```sql
CREATE TABLE days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  label TEXT NOT NULL,          -- ex: "Dimanche 28 juin"
  emoji TEXT NOT NULL,          -- ex: "🏖️"
  description TEXT,             -- sous-titre du jour
  is_arrival BOOLEAN DEFAULT false,
  is_departure BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. `activities`
Activités assignées à un jour. C'est la table principale avec Realtime activé.

```sql
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id UUID REFERENCES days(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '📍',
  category TEXT NOT NULL CHECK (category IN (
    'plage', 'restaurant', 'visite', 'day_trip', 'soiree', 'sport', 'shopping', 'libre', 'transport'
  )),
  time_slot TEXT,               -- ex: "09:00", "après-midi", "soirée"
  duration_minutes INTEGER,     -- durée estimée
  location_name TEXT,           -- nom du lieu
  location_url TEXT,            -- lien Google Maps
  notes TEXT,
  is_baby_friendly BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT DEFAULT 'group',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_activities_day_id ON activities(day_id);
CREATE INDEX idx_activities_sort_order ON activities(day_id, sort_order);
```

### 3. `restaurants`
Liste curatée de restaurants avec système de vote.

```sql
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine TEXT,                 -- ex: "Méditerranéen", "Italien", "Français"
  price_range INTEGER CHECK (price_range IN (1, 2, 3)),  -- 1=€, 2=€€, 3=€€€
  address TEXT,
  google_maps_url TEXT,
  image_url TEXT,
  is_baby_friendly BOOLEAN DEFAULT true,
  has_terrace BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. `restaurant_votes`
Votes du groupe sur les restos (Realtime activé).

```sql
CREATE TABLE restaurant_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,     -- prénom du votant
  vote INTEGER CHECK (vote IN (1, 2, 3)),  -- 1=❤️, 2=👍, 3=🤷
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id, voter_name)
);
```

### 5. `game_scores`
Scores des jeux (quiz + vérité ou défi).

```sql
CREATE TABLE game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL CHECK (game_type IN ('quiz', 'truth_dare')),
  player_name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 6. `app_settings`
Paramètres globaux de l'app (noms du groupe, etc.).

```sql
CREATE TABLE app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insérer les settings par défaut
INSERT INTO app_settings (key, value) VALUES
  ('group_members', '["Couple 1", "Couple 2"]'::jsonb),
  ('trip_name', '"Menton 2026 🌊"'::jsonb),
  ('accommodation_address', '""'::jsonb);
```

---

## Données initiales — Jours du voyage

```sql
INSERT INTO days (date, label, emoji, description, is_arrival, is_departure, sort_order) VALUES
  ('2026-06-27', 'Samedi 27 juin', '✈️', 'Arrivée & installation', true, false, 1),
  ('2026-06-28', 'Dimanche 28 juin', '🏖️', 'Découverte de Menton', false, false, 2),
  ('2026-06-29', 'Lundi 29 juin', '🎰', 'Day trip Monaco + Eze', false, false, 3),
  ('2026-06-30', 'Mardi 30 juin', '🌊', 'Plage & farniente', false, false, 4),
  ('2026-07-01', 'Mercredi 1er juillet', '🌆', 'Day trip Nice', false, false, 5),
  ('2026-07-02', 'Jeudi 2 juillet', '🍋', 'Menton authentique', false, false, 6),
  ('2026-07-03', 'Vendredi 3 juillet', '🌅', 'Dernière journée', false, false, 7),
  ('2026-07-04', 'Samedi 4 juillet', '👋', 'Départ', false, true, 8);
```

---

## Activation du Realtime Supabase

Dans le dashboard Supabase > Database > Replication, activer Realtime sur :
- `activities` (INSERT, UPDATE, DELETE)
- `restaurant_votes` (INSERT, UPDATE, DELETE)

---

## Variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Client Supabase (`lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## Hook Realtime (`hooks/useRealtime.ts`)

```typescript
// S'abonner aux changements en temps réel sur activities
const channel = supabase
  .channel('activities-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'activities' },
    (payload) => {
      // Mettre à jour le store Zustand
      planningStore.handleRealtimeChange(payload)
    }
  )
  .subscribe()
```

---

## Politique RLS (Row Level Security)

Pour simplicité (app privée groupe), désactiver RLS ou créer une politique permissive :

```sql
-- Option simple : accès public en lecture/écriture (app privée)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON activities FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON days FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON restaurants FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE restaurant_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON restaurant_votes FOR ALL USING (true) WITH CHECK (true);
```
