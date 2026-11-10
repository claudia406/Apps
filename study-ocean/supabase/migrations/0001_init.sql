-- Study Ocean: 学習記録と海の状態を管理するスキーマ
-- 単一ユーザー専用の個人アプリであり、anon / authenticated ロールにはポリシーを
-- 一切作成しない（= すべて拒否）。service_role キー（RLSをバイパスする）を使う
-- サーバー側の Route Handler からのみ読み書きする。

create table if not exists study_records (
  record_date date primary key,
  minutes integer not null default 0 check (minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ocean_state (
  id smallint primary key default 1 check (id = 1),
  -- 評価済みの最後の日付(JST)。この日までの結果は health/streak に確定済みで、
  -- 後から過去記録を編集してもこの日付以前の結果は再計算されない。
  last_evaluated_date date,
  health integer not null default 0 check (health between 0 and 60),
  streak_current integer not null default 0 check (streak_current >= 0),
  streak_best integer not null default 0 check (streak_best >= 0),
  miss_streak integer not null default 0 check (miss_streak >= 0),
  health_at_degen_start integer not null default 0,
  total_achieved_days integer not null default 0 check (total_achieved_days >= 0),
  final_form_reached boolean not null default false,
  -- [{ "id": "fish-small-school", "unlockedAt": "2026-01-07" }, ...]
  unlocked jsonb not null default '[]'::jsonb,
  phase text not null default 'growing' check (phase in ('growing', 'recovering', 'degenerating', 'dormant')),
  updated_at timestamptz not null default now()
);

insert into ocean_state (id) values (1) on conflict (id) do nothing;

create table if not exists monthly_goals (
  year_month text primary key check (year_month ~ '^\d{4}-\d{2}$'),
  goal_minutes integer not null check (goal_minutes > 0),
  updated_at timestamptz not null default now()
);

alter table study_records enable row level security;
alter table ocean_state enable row level security;
alter table monthly_goals enable row level security;
-- ポリシーを定義しないことで anon / authenticated からの select/insert/update/delete を
-- すべて拒否する。service_role キーは RLS を自動的にバイパスするため、
-- サーバー側（Route Handler）からの読み書きのみ可能。
