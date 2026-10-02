-- フリガナ列の追加（既存データは保持したまま追加）
-- Supabase の SQL Editor で一度だけ実行してください。

alter table students add column if not exists furigana text not null default '';

create index if not exists students_furigana_trgm on students using gin (furigana gin_trgm_ops);
