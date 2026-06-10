-- Seed initial activities for each day

-- Samedi 27 juin (Arrivée)
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, notes, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-06-27'),'Trajet & arrivée','🚗','transport','Après-midi',120,1,'S''installer, découvrir le logement',true),
  ((SELECT id FROM days WHERE date='2026-06-27'),'Courses essentielles','🛒','shopping','Fin d''après-midi',60,2,'Supermarché pour les premiers jours',true),
  ((SELECT id FROM days WHERE date='2026-06-27'),'Apéro vue mer','🥂','soiree','Soirée',90,3,'Premier verre sur la Côte d''Azur 🥂',true);

-- Dimanche 28 juin
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-06-28'),'Marché des Halles','🍋','shopping','Matin',60,1,true),
  ((SELECT id FROM days WHERE date='2026-06-28'),'Plage des Sablettes','🏖️','plage','Matin-Après-midi',240,2,true),
  ((SELECT id FROM days WHERE date='2026-06-28'),'Vieille ville','🏘️','visite','Fin d''après-midi',90,3,true),
  ((SELECT id FROM days WHERE date='2026-06-28'),'Dîner terrasse','🍽️','restaurant','Soirée',120,4,true);

-- Lundi 29 juin
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, notes, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-06-29'),'Train Menton → Monaco','🚂','transport','Matin',20,1,'TER ~1.60€, départ ~9h',true),
  ((SELECT id FROM days WHERE date='2026-06-29'),'Monaco : Rocher & Palais','🏰','day_trip','Matin',120,2,NULL,true),
  ((SELECT id FROM days WHERE date='2026-06-29'),'Monaco : Casino Monte-Carlo','🎰','day_trip','Après-midi',60,3,'Photos extérieures, jardins',true),
  ((SELECT id FROM days WHERE date='2026-06-29'),'Eze Village','🏔️','day_trip','Fin d''après-midi',120,4,'Bus depuis Monaco',true),
  ((SELECT id FROM days WHERE date='2026-06-29'),'Retour + dîner léger','🚂','transport','Soirée',60,5,NULL,true);

-- Mardi 30 juin
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-06-30'),'Plage tranquille','🌊','plage','Matin',180,1,true),
  ((SELECT id FROM days WHERE date='2026-06-30'),'Paddle & Kayak','🏄','sport','Matin',60,2,false),
  ((SELECT id FROM days WHERE date='2026-06-30'),'Sieste & plage','😴','libre','Après-midi',120,3,true),
  ((SELECT id FROM days WHERE date='2026-06-30'),'Soirée jeux','🎮','soiree','Soirée',120,4,true);

-- Mercredi 1er juillet
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, notes, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-07-01'),'Train Menton → Nice','🚂','transport','Matin',40,1,'TER ~5€',true),
  ((SELECT id FROM days WHERE date='2026-07-01'),'Vieux-Nice & Cours Saleya','🛍️','visite','Matin',120,2,NULL,true),
  ((SELECT id FROM days WHERE date='2026-07-01'),'Promenade des Anglais','🌴','visite','Après-midi',90,3,NULL,true),
  ((SELECT id FROM days WHERE date='2026-07-01'),'Dîner à Nice ou retour','🍽️','restaurant','Soirée',120,4,NULL,true);

-- Jeudi 2 juillet
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-07-02'),'Marché des Halles (bis)','🍋','shopping','Matin',60,1,true),
  ((SELECT id FROM days WHERE date='2026-07-02'),'Plage de Garavan','🏝️','plage','Matin-Après-midi',240,2,true),
  ((SELECT id FROM days WHERE date='2026-07-02'),'Musée Jean Cocteau','🎨','visite','Après-midi',90,3,true),
  ((SELECT id FROM days WHERE date='2026-07-02'),'Soirée quiz & vérité-défi','🎮','soiree','Soirée',120,4,true);

-- Vendredi 3 juillet
INSERT INTO activities (day_id, title, emoji, category, time_slot, duration_minutes, sort_order, is_baby_friendly) VALUES
  ((SELECT id FROM days WHERE date='2026-07-03'),'Dernière plage','🌅','plage','Matin',180,1,true),
  ((SELECT id FROM days WHERE date='2026-07-03'),'Souvenirs & shopping','🛍️','shopping','Après-midi',60,2,true),
  ((SELECT id FROM days WHERE date='2026-07-03'),'Dîner d''adieu','🥂','restaurant','Soirée',150,3,true);
