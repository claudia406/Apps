-- 生徒情報データベース 初期スキーマ
-- Supabase の SQL Editor で一度だけ実行してください。

create extension if not exists pg_trgm;

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default '',
  postal_code text not null default '',
  address text not null default '',
  school_name text not null default '',
  phone text not null default '',
  email text not null default '',
  guardian_name text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_full_name_trgm on students using gin (full_name gin_trgm_ops);
create index if not exists students_school_name_trgm on students using gin (school_name gin_trgm_ops);
create index if not exists students_email_trgm on students using gin (email gin_trgm_ops);
create index if not exists students_status_idx on students (status);
create index if not exists students_deleted_at_idx on students (deleted_at);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists students_set_updated_at on students;
create trigger students_set_updated_at
before update on students
for each row execute function set_updated_at();

-- 最近開いた生徒（管理者1名を想定した単純な記録）
create table if not exists recent_views (
  student_id uuid primary key references students(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

-- ログイン試行履歴（ブルートフォース対策用）。サーバー側のサービスロールキーのみがアクセスする。
create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  email text not null,
  ip text,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_email_idx on login_attempts (email, created_at desc);

alter table students enable row level security;
alter table recent_views enable row level security;
alter table login_attempts enable row level security;

-- login_attempts にはポリシーを作成しない（anon/authenticated からは常に拒否、サービスロールキーのみ操作可能）

drop policy if exists "authenticated full access" on students;
create policy "authenticated full access" on students
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full access" on recent_views;
create policy "authenticated full access" on recent_views
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
