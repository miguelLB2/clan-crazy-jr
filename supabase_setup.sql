-- ============================================================
--  CRAZY JUNIOR CLAN - Script de creación de tablas
--  Pega esto completo en Supabase > SQL Editor > Run
-- ============================================================

-- 1. Configuración general del clan
CREATE TABLE IF NOT EXISTS clan_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  clan_name TEXT NOT NULL DEFAULT 'CRAZY JUNIOR',
  motto TEXT DEFAULT '¡Dominando las salas con pura adrenalina y honor!',
  logo_url TEXT DEFAULT '/assets/logo.png',
  whatsapp_url TEXT DEFAULT '',
  discord_url TEXT DEFAULT '',
  requirements TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Miembros del clan
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  game_id TEXT DEFAULT '',
  role TEXT DEFAULT 'Miembro',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Semanas de honores
CREATE TABLE IF NOT EXISTS weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  is_current BOOLEAN DEFAULT FALSE,
  records JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Muro de premios
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  winner_name TEXT DEFAULT '',
  icon TEXT DEFAULT 'Trophy',
  date_or_period TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  Seguridad: Lectura pública / Escritura solo con sesión
-- ============================================================
ALTER TABLE clan_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Lectura pública para todos
CREATE POLICY "Lectura pública clan_settings" ON clan_settings FOR SELECT USING (true);
CREATE POLICY "Lectura pública members"       ON members       FOR SELECT USING (true);
CREATE POLICY "Lectura pública weeks"         ON weeks         FOR SELECT USING (true);
CREATE POLICY "Lectura pública awards"        ON awards        FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (admin / decanos)
CREATE POLICY "Escritura autenticada clan_settings" ON clan_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escritura autenticada members"       ON members       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escritura autenticada weeks"         ON weeks         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Escritura autenticada awards"        ON awards        FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
--  Datos de ejemplo iniciales
-- ============================================================
INSERT INTO clan_settings (id, clan_name, motto, logo_url, requirements)
VALUES (
  'general',
  'CRAZY JUNIOR',
  '¡Dominando las salas con pura adrenalina y honor!',
  '/assets/logo.png',
  'Nivel 50+, actividad constante en salas de clan los fines de semana, cumplir con los honores semanales y respeto mutuo.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO members (name, game_id, role) VALUES
  ('CJ_APOCALIPSIS', '2984719284', 'Líder'),
  ('CJ_VULCANO',     '3819284751', 'Sublíder'),
  ('CJ_VALKIRIA',    '4729183920', 'Sublíder'),
  ('CJ_SHADOW',      '1928374650', 'Miembro'),
  ('CJ_KRAKEN',      '5829104829', 'Miembro'),
  ('CJ_INFERNO',     '6920194827', 'Miembro'),
  ('CJ_TITAN',       '8492019482', 'Miembro'),
  ('CJ_VIPER',       '7482910492', 'Miembro'),
  ('CJ_PHANTOM',     '9182736450', 'Miembro'),
  ('CJ_BLAZE',       '4019284756', 'Miembro')
ON CONFLICT DO NOTHING;
