-- ============================================================================
-- 04_donors.sql
-- Trae los donantes del panel a Supabase. Correr UNA vez en el SQL Editor.
-- Idempotente (no reinserta si ya existe el email).
--
-- La tabla `donors` ya existía (con id, name, phone, email, status,
-- organization_id, cancelled_date, cancelled_reason, interests,
-- external_reference, mp_subscription_id). Le faltaban las columnas que usa el
-- panel; las agregamos acá. La baja se modela con status='baja' +
-- cancelled_reason. `interests` es texto JSON (ej '[1, 3]'), igual que lo
-- escribe el flujo de Mercado Pago.
-- ============================================================================

alter table donors add column if not exists donation_type  text;        -- 'mensual' | 'unica' | null
alter table donors add column if not exists amount         numeric;     -- ARS del último aporte
alter table donors add column if not exists last_charge_at timestamptz; -- último cobro

-- Seed de los 12 donantes demo, todos en Aprender Juntos (legacy_id = 2).
-- No reinserta si el email ya está cargado.
with org as (
  select id from organizations where legacy_id = 2
)
insert into donors (
  name, email, phone, status, donation_type, amount, last_charge_at,
  cancelled_reason, interests, organization_id
)
select
  d.name, d.email, d.phone, d.status, d.donation_type, d.amount,
  d.last_charge_at::timestamptz, d.cancelled_reason, d.interests, org.id
from org, (values
  ('María González',    'maria.gonzalez@gmail.com',  '1145678901', 'activo',    'mensual', 5000,  '2026-06-01T09:15:00', NULL::text,     '[1, 3]'),
  ('Juan Pérez',        'juanperez@hotmail.com',     '1156789012', 'activo',    'mensual', 3000,  '2026-06-01T10:02:00', NULL,           '[2, 7]'),
  ('Lucía Fernández',   'lucia.fernandez@gmail.com', '1167890123', 'activo',    'unica',   2000,  '2026-05-20T18:40:00', NULL,           '[4]'),
  ('Diego Martínez',    'dmartinez@yahoo.com',       '1178901234', 'inactivo',  'unica',   1000,  '2026-04-12T12:25:00', NULL,           '[8, 10]'),
  ('Sofía Romero',      'sofiaromero@gmail.com',     '1189012345', 'potencial', NULL,      NULL,  NULL,                  NULL,           '[1, 9]'),
  ('Martín Sosa',       'martin.sosa@gmail.com',     '1190123456', 'potencial', NULL,      NULL,  NULL,                  NULL,           '[7, 11]'),
  ('Valentina Díaz',    'valen.diaz@outlook.com',    '1101234567', 'baja',      'mensual', 5000,  '2026-03-01T08:30:00', 'economico',    '[3, 5]'),
  ('Tomás Acosta',      'tomas.acosta@gmail.com',    '1112345678', 'baja',      'mensual', 3000,  '2026-02-15T16:10:00', 'no_interesa',  '[2]'),
  ('Camila Ruiz',       'camila.ruiz@gmail.com',     '1123456780', 'baja',      'mensual', 10000, '2026-01-30T11:45:00', 'desconfianza', '[6, 9]'),
  ('Nicolás Herrera',   'nico.herrera@gmail.com',    '1134567801', 'activo',    'unica',   1500,  '2026-05-28T20:05:00', NULL,           '[10, 12]'),
  ('Florencia Castro',  'flor.castro@gmail.com',     '1145670912', 'activo',    'mensual', 5000,  '2026-06-01T07:50:00', NULL,           '[1, 13]'),
  ('Gabriel Morales',   'gabriel.morales@gmail.com', '1156701234', 'baja',      'unica',   800,   '2026-03-18T14:20:00', 'cambio_causa', '[4, 7]')
) as d(name, email, phone, status, donation_type, amount, last_charge_at, cancelled_reason, interests)
where not exists (
  select 1 from donors existing where existing.email = d.email
);
