-- ============================================================================
-- 02_orgs_and_categories.sql
-- Migra las ONGs (antes en src/data/ongs.ts) y el catálogo de rubros (antes en
-- src/data/organization-types.ts) a Supabase. Correr UNA vez en el SQL Editor,
-- después de 01 (db.sql). Idempotente (usa IF NOT EXISTS / ON CONFLICT).
--
-- Decisiones (ver conversación):
--   - Campañas y donantes SIGUEN estáticos por ahora.
--   - Rubros: catálogo org_types + join org_categories (many-to-many).
--   - El sitio público lee organizations/org_types/org_categories vía rol anon.
--   - ONGs demo seedeadas con description/poc placeholder (redes en null).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Ajustes a organizations
-- ---------------------------------------------------------------------------
-- `category` (texto único) lo reemplaza el join org_categories.
alter table organizations alter column category drop not null;

-- Campos que usa la UI pública y puente al id numérico de las campañas estáticas.
alter table organizations add column if not exists scope            text;
alter table organizations add column if not exists active_campaigns integer not null default 0;
alter table organizations add column if not exists legacy_id        integer unique;

-- ---------------------------------------------------------------------------
-- 2) Catálogo de rubros (espejo de src/data/organization-types.ts)
-- ---------------------------------------------------------------------------
create table if not exists org_types (
  id   integer primary key,
  name text not null
);

create table if not exists org_categories (
  organization_id uuid    not null references organizations(id) on delete cascade,
  org_type_id     integer not null references org_types(id)     on delete cascade,
  primary key (organization_id, org_type_id)
);

create index if not exists org_categories_org_type_idx on org_categories (org_type_id);

-- ---------------------------------------------------------------------------
-- 3) RLS — lectura pública (rol anon) de los datos del sitio público
-- ---------------------------------------------------------------------------
alter table org_types      enable row level security;
alter table org_categories enable row level security;

-- organizations ya tiene RLS activo (01). Sumamos SELECT para anon; las policies
-- por rol se combinan con OR, así que esto no afecta el acceso authenticated.
drop policy if exists organizations_public_select on organizations;
create policy organizations_public_select
  on organizations for select to anon using (true);

drop policy if exists org_types_public_select on org_types;
create policy org_types_public_select
  on org_types for select to anon, authenticated using (true);

drop policy if exists org_categories_public_select on org_categories;
create policy org_categories_public_select
  on org_categories for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- 4) Seed — rubros (20)
-- ---------------------------------------------------------------------------
insert into org_types (id, name) values
  (1,  'Asistencia alimentaria'),
  (2,  'Educación'),
  (3,  'Infancia y adolescencia'),
  (4,  'Salud'),
  (5,  'Discapacidad'),
  (6,  'DDHH'),
  (7,  'Ambientales'),
  (8,  'Protección animal'),
  (9,  'Género y diversidad'),
  (10, 'Desarrollo comunitario'),
  (11, 'Vivienda y hábitat'),
  (12, 'Empleo y capacitación laboral'),
  (13, 'Apoyo a personas mayores'),
  (14, 'Cultura y patrimonio'),
  (15, 'Deporte social'),
  (16, 'Migrantes y refugiados'),
  (17, 'Economía social y cooperativismo'),
  (18, 'Asistencia en emergencias y desastres'),
  (19, 'Investigación y políticas públicas'),
  (20, 'Religión')
on conflict (id) do update set name = excluded.name;

-- ---------------------------------------------------------------------------
-- 5) Seed — ONGs demo (placeholders en description/poc; redes en null)
-- ---------------------------------------------------------------------------
insert into organizations (legacy_id, name, scope, active_campaigns, description, poc) values
  (1, 'Manos a la Olla',    'Buenos Aires, Argentina', 5, 'Descripción pendiente.', 'Pendiente'),
  (2, 'Aprender Juntos',    'Catamarca, Argentina',    3, 'Descripción pendiente.', 'Pendiente'),
  (3, 'Salud Sin Fronteras','Región Noroeste, Argentina', 8, 'Descripción pendiente.', 'Pendiente'),
  (4, 'Tierra Viva',        'Argentina',               4, 'Descripción pendiente.', 'Pendiente'),
  (5, 'Voces Iguales',      'Buenos Aires, Argentina', 2, 'Descripción pendiente.', 'Pendiente'),
  (6, 'Techo y Hogar',      'Córdoba, Argentina',      6, 'Descripción pendiente.', 'Pendiente'),
  (7, 'Cancha Abierta',     'Rosario, Argentina',      3, 'Descripción pendiente.', 'Pendiente'),
  (8, 'Raíces Culturales',  'Argentina',               1, 'Descripción pendiente.', 'Pendiente')
on conflict (legacy_id) do update set
  name = excluded.name,
  scope = excluded.scope,
  active_campaigns = excluded.active_campaigns;

-- ---------------------------------------------------------------------------
-- 6) Seed — rubros por ONG (join), resuelto por legacy_id
-- ---------------------------------------------------------------------------
insert into org_categories (organization_id, org_type_id)
select o.id, v.org_type_id
from organizations o
join (values
  (1, 1), (1, 3), (1, 10),
  (2, 2), (2, 3), (2, 12),
  (3, 4), (3, 5), (3, 13), (3, 18),
  (4, 7), (4, 8),
  (5, 6), (5, 9), (5, 16),
  (6, 11), (6, 10), (6, 17),
  (7, 15), (7, 3), (7, 2),
  (8, 14), (8, 19), (8, 20)
) as v(legacy_id, org_type_id) on v.legacy_id = o.legacy_id
on conflict do nothing;
