create table if not exists public.experiment_rows (
  group_no integer primary key,
  charged_object text not null,
  glass_result text check (glass_result in ('0', '1')),
  rubber_result text check (rubber_result in ('0', '1')),
  updated_at timestamptz
);

insert into public.experiment_rows (group_no, charged_object, glass_result, rubber_result, updated_at)
values
  (1, '毛皮摩擦过的梳子', null, null, null),
  (2, '梳子摩擦过的毛皮', null, null, null),
  (3, '干毛巾摩擦过的吸管', null, null, null),
  (4, '塑料袋摩擦过的气球', null, null, null),
  (5, '头皮摩擦过的塑料尺', null, null, null),
  (6, '绒布摩擦过的塑料衣架', null, null, null),
  (7, '毛衣摩擦过的泡沫塑料', null, null, null),
  (8, '毛巾摩擦过的塑料餐盒', null, null, null)
on conflict (group_no) do update
set charged_object = excluded.charged_object;

alter table public.experiment_rows enable row level security;

drop policy if exists "public read experiment rows" on public.experiment_rows;
create policy "public read experiment rows"
on public.experiment_rows
for select
to anon, authenticated
using (true);

alter publication supabase_realtime add table public.experiment_rows;

