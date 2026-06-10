-- Tables
CREATE TABLE IF NOT EXISTS days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  label TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT,
  is_arrival BOOLEAN DEFAULT false,
  is_departure BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id UUID REFERENCES days(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '📍',
  category TEXT NOT NULL CHECK (category IN (
    'plage','restaurant','visite','day_trip','soiree','sport','shopping','libre','transport'
  )),
  time_slot TEXT,
  duration_minutes INTEGER,
  location_name TEXT,
  location_url TEXT,
  notes TEXT,
  is_baby_friendly BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by TEXT DEFAULT 'group',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_sort_order ON activities(day_id, sort_order);

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine TEXT,
  price_range INTEGER CHECK (price_range IN (1,2,3)),
  address TEXT,
  google_maps_url TEXT,
  image_url TEXT,
  is_baby_friendly BOOLEAN DEFAULT true,
  has_terrace BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS restaurant_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,
  vote INTEGER CHECK (vote IN (1,2,3)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(restaurant_id, voter_name)
);

CREATE TABLE IF NOT EXISTS game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type TEXT NOT NULL CHECK (game_type IN ('quiz','truth_dare')),
  player_name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default settings
INSERT INTO app_settings (key, value) VALUES
  ('group_members', '["Couple 1 A","Couple 1 B","Couple 2 A","Couple 2 B"]'::jsonb),
  ('trip_name', '"Menton 2026 🌊"'::jsonb),
  ('accommodation_address', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Days
INSERT INTO days (date, label, emoji, description, is_arrival, is_departure, sort_order) VALUES
  ('2026-06-27','Samedi 27 juin','✈️','Arrivée & installation',true,false,1),
  ('2026-06-28','Dimanche 28 juin','🏖️','Découverte de Menton',false,false,2),
  ('2026-06-29','Lundi 29 juin','🎰','Day trip Monaco + Eze',false,false,3),
  ('2026-06-30','Mardi 30 juin','🌊','Plage & farniente',false,false,4),
  ('2026-07-01','Mercredi 1er juillet','🌆','Day trip Nice',false,false,5),
  ('2026-07-02','Jeudi 2 juillet','🍋','Menton authentique',false,false,6),
  ('2026-07-03','Vendredi 3 juillet','🌅','Dernière journée',false,false,7),
  ('2026-07-04','Samedi 4 juillet','👋','Départ',false,true,8)
ON CONFLICT (date) DO NOTHING;

-- RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public access" ON activities FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE days ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public access" ON days FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public access" ON restaurants FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE restaurant_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public access" ON restaurant_votes FOR ALL USING (true) WITH CHECK (true);
