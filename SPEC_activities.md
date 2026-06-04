# SPEC_activities.md — Bibliothèque d'activités & Carte

## Bibliothèque d'activités prédéfinies

Fichier : `data/activities-library.ts`

Ces activités servent de suggestions dans le picker. L'utilisateur peut les ajouter en 1 tap ou les modifier avant d'ajouter.

```typescript
export const ACTIVITIES_LIBRARY: ActivityTemplate[] = [

  // ── PLAGES ────────────────────────────────────────────────────
  {
    id: 'lib-plage-sablettes',
    title: 'Plage des Sablettes',
    description: 'La plage emblématique de Menton — galets, eau turquoise cristalline, vue sur la vieille ville colorée. Idéale pour bébé (eaux calmes, peu profondes).',
    emoji: '🏖️',
    category: 'plage',
    suggested_time_slot: 'Matin',
    duration_minutes: 180,
    location_name: 'Plage des Sablettes, Menton',
    location_url: 'https://maps.google.com/?q=Plage+des+Sablettes+Menton',
    is_baby_friendly: true,
    tags: ['eau calme', 'famille', 'incontournable'],
  },
  {
    id: 'lib-plage-garavan',
    title: 'Plage de Garavan',
    description: 'Plage de galets proche de la frontière italienne. Cadre plus intime, vue splendide sur la vieille ville. Eaux peu profondes.',
    emoji: '🏝️',
    category: 'plage',
    suggested_time_slot: 'Après-midi',
    duration_minutes: 120,
    location_name: 'Plage de Garavan, Menton',
    location_url: 'https://maps.google.com/?q=Plage+de+Garavan+Menton',
    is_baby_friendly: true,
    tags: ['intime', 'famille', 'italie proche'],
  },
  {
    id: 'lib-plage-fossettes',
    title: 'Plage des Fossettes',
    description: 'Petite plage secrète et moins fréquentée. Parfaite pour observer les petits poissons avec bébé. Atmosphère zen.',
    emoji: '🐠',
    category: 'plage',
    suggested_time_slot: 'Matin',
    duration_minutes: 120,
    location_name: 'Plage des Fossettes, Menton',
    location_url: 'https://maps.google.com/?q=Plage+des+Fossettes+Menton',
    is_baby_friendly: true,
    tags: ['secret', 'calme', 'snorkeling'],
  },
  {
    id: 'lib-plage-privee',
    title: 'Plage privée avec transats',
    description: 'Location transats + parasols sur une plage privée. Confort max pour la journée. Tarif ~30-50€/transat. Réserver à l\'avance en juillet.',
    emoji: '🛻',
    category: 'plage',
    suggested_time_slot: 'Journée',
    duration_minutes: 360,
    location_name: 'Plage privée Menton',
    location_url: 'https://maps.google.com/?q=plage+privée+Menton',
    is_baby_friendly: true,
    tags: ['confort', 'réservation', 'payant'],
  },
  {
    id: 'lib-paddle',
    title: 'Paddle & Kayak',
    description: 'Location de paddles et kayaks au centre nautique. Fun en groupe ! Durée ~1h. Bébé reste à la plage avec l\'autre couple.',
    emoji: '🏄',
    category: 'sport',
    suggested_time_slot: 'Matin',
    duration_minutes: 60,
    location_name: 'Centre Nautique Menton',
    location_url: 'https://maps.google.com/?q=Centre+Nautique+Menton',
    is_baby_friendly: false,
    tags: ['sport', 'nautique', 'fun'],
  },

  // ── VISITES MENTON ────────────────────────────────────────────
  {
    id: 'lib-vieille-ville',
    title: 'Vieille ville & marché',
    description: 'Flâner dans les ruelles colorées de la vieille ville. Façades ocre et citron, escaliers pittoresques, vue panoramique depuis la place Saint-Michel.',
    emoji: '🏘️',
    category: 'visite',
    suggested_time_slot: 'Matin',
    duration_minutes: 90,
    location_name: 'Vieille Ville Menton',
    location_url: 'https://maps.google.com/?q=Vieille+Ville+Menton',
    is_baby_friendly: true,
    tags: ['architecture', 'photos', 'culture'],
  },
  {
    id: 'lib-marche-halles',
    title: 'Marché des Halles',
    description: 'Le marché couvert de Menton — pissaladière, citrons de Menton, produits locaux, fleurs. L\'âme de la ville. Ouvert tous les matins jusqu\'à ~13h.',
    emoji: '🍋',
    category: 'shopping',
    suggested_time_slot: 'Matin',
    duration_minutes: 60,
    location_name: 'Marché des Halles, Menton',
    location_url: 'https://maps.google.com/?q=Marché+des+Halles+Menton',
    is_baby_friendly: true,
    tags: ['gastronomie', 'local', 'incontournable'],
  },
  {
    id: 'lib-promenade-soleil',
    title: 'Promenade du Soleil',
    description: 'Balade le long du front de mer bordé de palmiers. Vue sur la Méditerranée, parfait pour le jogging matinal ou la promenade avec poussette.',
    emoji: '🌴',
    category: 'libre',
    suggested_time_slot: 'Matin',
    duration_minutes: 45,
    location_name: 'Promenade du Soleil, Menton',
    location_url: 'https://maps.google.com/?q=Promenade+du+Soleil+Menton',
    is_baby_friendly: true,
    tags: ['balade', 'mer', 'poussette ok'],
  },
  {
    id: 'lib-cocteau',
    title: 'Musée Jean Cocteau',
    description: 'Musée dédié à l\'artiste Jean Cocteau, emblème de Menton. Architecture contemporaine spectaculaire signée Rudy Ricciotti. Belle collection.',
    emoji: '🎨',
    category: 'visite',
    suggested_time_slot: 'Après-midi',
    duration_minutes: 90,
    location_name: 'Musée Jean Cocteau, Menton',
    location_url: 'https://maps.google.com/?q=Musée+Jean+Cocteau+Menton',
    is_baby_friendly: true,
    tags: ['art', 'culture', 'architecture'],
  },
  {
    id: 'lib-jardin-serres',
    title: 'Jardin des Serres de la Madone',
    description: 'Jardin classé Monument Historique. Plantes méditerranéennes, terrasses en cascade, vue mer époustouflante. Frais et reposant.',
    emoji: '🌺',
    category: 'visite',
    suggested_time_slot: 'Après-midi',
    duration_minutes: 90,
    location_name: 'Jardin Serres de la Madone, Menton',
    location_url: 'https://maps.google.com/?q=Jardin+Serres+Madone+Menton',
    is_baby_friendly: true,
    tags: ['nature', 'jardins', 'frais'],
  },

  // ── DAY TRIPS ─────────────────────────────────────────────────
  {
    id: 'lib-monaco',
    title: 'Day trip Monaco',
    description: '20 min en train depuis Menton (1.60€). Casino de Monte-Carlo, Palais du Prince, Rocher, jardin exotique. Prévoir une journée complète.',
    emoji: '🎰',
    category: 'day_trip',
    suggested_time_slot: 'Journée',
    duration_minutes: 480,
    location_name: 'Monaco',
    location_url: 'https://maps.google.com/?q=Monaco+Monte-Carlo',
    is_baby_friendly: true,
    tags: ['train', 'casino', 'palace', 'incontournable'],
  },
  {
    id: 'lib-eze',
    title: 'Village d\'Eze',
    description: 'Village médiéval perché à 427m. Vue panoramique sur la Méditerranée absolument spectaculaire. Parfumerie Fragonard. 40 min en bus depuis Menton.',
    emoji: '🏔️',
    category: 'day_trip',
    suggested_time_slot: 'Matin',
    duration_minutes: 240,
    location_name: 'Eze Village',
    location_url: 'https://maps.google.com/?q=Eze+Village+France',
    is_baby_friendly: true,
    tags: ['village médiéval', 'vue mer', 'parfumerie'],
  },
  {
    id: 'lib-nice',
    title: 'Day trip Nice',
    description: '40 min en train (TER, ~5€). Vieux-Nice, Promenade des Anglais, marché du Cours Saleya, musée Matisse. Grande ville animée.',
    emoji: '🌆',
    category: 'day_trip',
    suggested_time_slot: 'Journée',
    duration_minutes: 480,
    location_name: 'Nice',
    location_url: 'https://maps.google.com/?q=Nice+Vieux-Nice',
    is_baby_friendly: true,
    tags: ['train', 'grande ville', 'gastronomie', 'musées'],
  },
  {
    id: 'lib-ventimiglia',
    title: 'Ventimiglia (Italie)',
    description: 'Première ville italienne, 10 min en train (3€). Marché du vendredi, gelato, pasta. Charmant et dépaysant. Idéal pour le marché hebdomadaire.',
    emoji: '🇮🇹',
    category: 'day_trip',
    suggested_time_slot: 'Matin',
    duration_minutes: 180,
    location_name: 'Ventimiglia, Italie',
    location_url: 'https://maps.google.com/?q=Ventimiglia+Italy',
    is_baby_friendly: true,
    tags: ['italie', 'marché', 'gelato', 'train'],
  },

  // ── SOIRÉES ───────────────────────────────────────────────────
  {
    id: 'lib-apero-vue-mer',
    title: 'Apéro vue mer',
    description: 'Rosé, chips, coucher de soleil sur la Méditerranée. Trouver un spot en hauteur dans la vieille ville ou sur la promenade.',
    emoji: '🥂',
    category: 'soiree',
    suggested_time_slot: 'Soirée',
    duration_minutes: 90,
    location_name: 'Vieille Ville Menton',
    location_url: 'https://maps.google.com/?q=Menton+Vieille+Ville',
    is_baby_friendly: true,
    tags: ['coucher de soleil', 'rosé', 'romantique'],
  },
  {
    id: 'lib-jeux-soiree',
    title: 'Soirée jeux',
    description: 'Quiz Côte d\'Azur + Vérité ou Défi en mode groupe. Utiliser la section Jeux de l\'app. Prévoir snacks et boissons.',
    emoji: '🎮',
    category: 'soiree',
    suggested_time_slot: 'Soirée',
    duration_minutes: 120,
    location_name: 'Logement',
    location_url: '',
    is_baby_friendly: true,
    tags: ['jeux', 'fun', 'groupe'],
  },
]
```

---

## Page Activités — `app/(tabs)/activities/page.tsx`

### Layout
```
┌─────────────────────────────┐
│  🗺️ Activités               │
│  [Tout][Plage][Visite]      │ ← filtres catégorie
│  [Day trip][Soirée][Sport]  │
│  [🍼 Baby-friendly]         │ ← filtre spécial bébé
├─────────────────────────────┤
│  📍 Carte Google Maps       │ ← iframe embed
│  (hauteur 220px)            │
├─────────────────────────────┤
│  Activités (12)             │
│                             │
│  ┌─────────────────────┐    │
│  │ 🏖️ Plage Sablettes  │    │
│  │ ⭐ Incontournable   │    │
│  │ 🍼 Baby-friendly    │    │
│  │ 📍 Menton • 3h     │    │
│  │ [Ajouter au planning]│   │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### Carte Google Maps
Utiliser un iframe embed simple (pas de clé API nécessaire) :
```typescript
const MENTON_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11554.123456!2d7.5025!3d43.7762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12cdc3b2a0b1e3a5%3A0x3b2a0b1e3a5b2a0!2sMenton!5e0!3m2!1sfr!2sfr!4v1234567890`

<iframe
  src={MENTON_EMBED_URL}
  width="100%"
  height="220"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
```

### Bouton "Ajouter au planning"
Ouvre un **DayPickerSheet** pour choisir le jour, puis ajoute l'activité directement.

---

## Planning initial préchargé

À insérer en base au démarrage (seed SQL) :

```sql
-- Samedi 27 juin (Arrivée)
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, notes) VALUES
  ((SELECT id FROM days WHERE date='2026-06-27'), 'Trajet & arrivée', '🚗', 'transport', 'Après-midi', 120, 1, 'S''installer, découvrir le logement'),
  ((SELECT id FROM days WHERE date='2026-06-27'), 'Courses essentielles', '🛒', 'shopping', 'Fin d''après-midi', 60, 2, 'Supermarché pour les premiers jours'),
  ((SELECT id FROM days WHERE date='2026-06-27'), 'Apéro vue mer', '🥂', 'soiree', 'Soirée', 90, 3, 'Premier verre sur la Côte d''Azur 🥂');

-- Dimanche 28 juin
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-06-28'), 'Marché des Halles', '🍋', 'shopping', 'Matin', 60, 1, true),
  ((SELECT id FROM days WHERE date='2026-06-28'), 'Plage des Sablettes', '🏖️', 'plage', 'Matin-Après-midi', 240, 2, true),
  ((SELECT id FROM days WHERE date='2026-06-28'), 'Vieille ville', '🏘️', 'visite', 'Fin d''après-midi', 90, 3, true),
  ((SELECT id FROM days WHERE date='2026-06-28'), 'Dîner terrasse', '🍽️', 'restaurant', 'Soirée', 120, 4, true);

-- Lundi 29 juin
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, notes) VALUES
  ((SELECT id FROM days WHERE date='2026-06-29'), 'Train Menton → Monaco', '🚂', 'transport', 'Matin', 20, 1, 'TER ~1.60€, départ ~9h'),
  ((SELECT id FROM days WHERE date='2026-06-29'), 'Monaco : Rocher & Palais', '🏰', 'day_trip', 'Matin', 120, 2, NULL),
  ((SELECT id FROM days WHERE date='2026-06-29'), 'Monaco : Casino Monte-Carlo', '🎰', 'day_trip', 'Après-midi', 60, 3, 'Photos extérieures, jardins'),
  ((SELECT id FROM days WHERE date='2026-06-29'), 'Eze Village', '🏔️', 'day_trip', 'Fin d''après-midi', 120, 4, 'Bus depuis Monaco'),
  ((SELECT id FROM days WHERE date='2026-06-29'), 'Retour + dîner légèr', '🚂', 'transport', 'Soirée', 60, 5, NULL);

-- Mardi 30 juin
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order) VALUES
  ((SELECT id FROM days WHERE date='2026-06-30'), 'Plage tranquille', '🌊', 'plage', 'Matin', 180, 1),
  ((SELECT id FROM days WHERE date='2026-06-30'), 'Paddle & Kayak', '🏄', 'sport', 'Matin', 60, 2),
  ((SELECT id FROM days WHERE date='2026-06-30'), 'Sieste & plage', '😴', 'libre', 'Après-midi', 120, 3),
  ((SELECT id FROM days WHERE date='2026-06-30'), 'Soirée jeux', '🎮', 'soiree', 'Soirée', 120, 4);

-- Mercredi 1er juillet
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, notes) VALUES
  ((SELECT id FROM days WHERE date='2026-07-01'), 'Train Menton → Nice', '🚂', 'transport', 'Matin', 40, 1, 'TER ~5€'),
  ((SELECT id FROM days WHERE date='2026-07-01'), 'Vieux-Nice & Cours Saleya', '🛍️', 'visite', 'Matin', 120, 2, NULL),
  ((SELECT id FROM days WHERE date='2026-07-01'), 'Promenade des Anglais', '🌴', 'visite', 'Après-midi', 90, 3, NULL),
  ((SELECT id FROM days WHERE date='2026-07-01'), 'Dîner à Nice ou retour', '🍽️', 'restaurant', 'Soirée', 120, 4, NULL);

-- Jeudi 2 juillet
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order) VALUES
  ((SELECT id FROM days WHERE date='2026-07-02'), 'Marché des Halles (bis)', '🍋', 'shopping', 'Matin', 60, 1),
  ((SELECT id FROM days WHERE date='2026-07-02'), 'Plage de Garavan', '🏝️', 'plage', 'Matin-Après-midi', 240, 2),
  ((SELECT id FROM days WHERE date='2026-07-02'), 'Musée Jean Cocteau', '🎨', 'visite', 'Après-midi', 90, 3),
  ((SELECT id FROM days WHERE date='2026-07-02'), 'Soirée quiz & vérité-défi', '🎮', 'soiree', 'Soirée', 120, 4);

-- Vendredi 3 juillet
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order) VALUES
  ((SELECT id FROM days WHERE date='2026-07-03'), 'Dernière plage', '🌅', 'plage', 'Matin', 180, 1),
  ((SELECT id FROM days WHERE date='2026-07-03'), 'Souvenirs & shopping', '🛍️', 'shopping', 'Après-midi', 60, 2),
  ((SELECT id FROM days WHERE date='2026-07-03'), 'Dîner d''adieu', '🥂', 'restaurant', 'Soirée', 150, 3);
```
