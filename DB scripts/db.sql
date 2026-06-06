create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  poc text not null,
  instagram text,
  facebook text,
  linkedin text,
  whatsapp text,
  foundation_date timestamptz,
  created_at timestamptz default now()
);

create table users (
  id uuid primary key,
  name text not null,
  role text default 'admin',
  organization_id uuid references organizations(id),
  created_at timestamptz default now()
);

create table donors (
  id uuid primary key,
  name text not null,
  phone text,
  email text,
  status text default 'activo',
  organization_id uuid references organizations(id),
  created_at timestamptz default now(),
  cancelled_date timestamptz,
  cancelled_reason text
);

create table old_donors (
  id uuid primary key,
  name text not null,
  phone text,
  email text,
  status text default 'activo',
  organization_id uuid references organizations(id),
  created_at timestamptz default now(),
  cancelled_date timestamptz,
  cancelled_reason text
);

create table communications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  status text default 'pending',
  message text not null,
  template text not null,
  send_date timestamptz default now()
);

create table reports_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  status text default 'pending',
  send_date timestamptz default now()
);

/*RLS*/
-- ACTIVAR RLS

alter table organizations enable row level security;
alter table users enable row level security;
alter table donors enable row level security;
alter table old_donors enable row level security;
alter table communications enable row level security;
alter table reports_log enable row level security;

/*FUNCTIONS*/
create or replace function public.current_user_org()
returns uuid
language sql
security definer
set search_path = public
as $$
  select organization_id
  from users
  where id = auth.uid()
  limit 1;
$$;


/*POLICIES*/
create policy "organizations_select"
on organizations
for select
to authenticated
using (
  id = current_user_org()
);

create policy "organizations_update"
on organizations
for update
to authenticated
using (
  id = current_user_org()
  and exists (
    select 1
    from users u
    where u.id = auth.uid()
  )
);

create policy "users_select"
on users
for select
to authenticated
using (
  organization_id = current_user_org()
);

create policy "users_insert"
on users
for insert
to authenticated
with check (
  organization_id = current_user_org()
);

create policy "users_update"
on users
for update
to authenticated
using (
  organization_id = current_user_org()
);

create policy "users_delete"
on users
for delete
to authenticated
using (
  organization_id = current_user_org()
);

create policy "donors_select"
on donors
for select
to authenticated
using (
  organization_id = current_user_org()
);

create policy "donors_insert"
on donors
for insert
to authenticated
with check (
  organization_id = current_user_org()
);

create policy "donors_update"
on donors
for update
to authenticated
using (
  organization_id = current_user_org()
);

create policy "donors_delete"
on donors
for delete
to authenticated
using (
  organization_id = current_user_org()
);

create policy "old_donors_select"
on old_donors
for select
to authenticated
using (
  organization_id = current_user_org()
);

create policy "old_donors_insert"
on old_donors
for insert
to authenticated
with check (
  organization_id = current_user_org()
);

create policy "old_donors_update"
on old_donors
for update
to authenticated
using (
  organization_id = current_user_org()
);

create policy "old_donors_delete"
on old_donors
for delete
to authenticated
using (
  organization_id = current_user_org()
);

create policy "communications_select"
on communications
for select
to authenticated
using (
  organization_id = current_user_org()
);

create policy "communications_insert"
on communications
for insert
to authenticated
with check (
  organization_id = current_user_org()
);

create policy "communications_update"
on communications
for update
to authenticated
using (
  organization_id = current_user_org()
);

create policy "communications_delete"
on communications
for delete
to authenticated
using (
  organization_id = current_user_org()
);

create policy "reports_log_select"
on reports_log
for select
to authenticated
using (
  organization_id = current_user_org()
);

create policy "reports_log_insert"
on reports_log
for insert
to authenticated
with check (
  organization_id = current_user_org()
);

create policy "reports_log_update"
on reports_log
for update
to authenticated
using (
  organization_id = current_user_org()
);

create policy "reports_log_delete"
on reports_log
for delete
to authenticated
using (
  organization_id = current_user_org()
);