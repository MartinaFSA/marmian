-- ============================================================================
-- 03_panel_user.sql
-- Vincula al usuario del panel (login placeholder por cookie) con su organización.
-- Correr UNA vez en el SQL Editor, después de 02. Idempotente.
--
-- Contexto: el login todavía NO es Supabase Auth (es una cookie con el email
-- autorizado, ver src/lib/session.ts). Las API routes del panel usan la admin key
-- y resuelven "mi organización" por el email. La tabla `users` no traía columna
-- email, así que la agregamos acá.
-- ============================================================================

alter table users add column if not exists email text unique;

-- Usuario del panel → Aprender Juntos (organizations.legacy_id = 2).
insert into users (id, name, email, role, organization_id)
select gen_random_uuid(), 'Damián', 'larenasdam@gmail.com', 'admin', o.id
from organizations o
where o.legacy_id = 2
on conflict (email) do update set
  organization_id = excluded.organization_id,
  name = excluded.name,
  role = excluded.role;
