alter table public.experiment_rows drop constraint if exists experiment_rows_glass_result_check;
alter table public.experiment_rows drop constraint if exists experiment_rows_rubber_result_check;

update public.experiment_rows
set
  glass_result = case
    when glass_result = '1' then '相互排斥'
    when glass_result = '0' then '相互吸引'
    else glass_result
  end,
  rubber_result = case
    when rubber_result = '1' then '相互排斥'
    when rubber_result = '0' then '相互吸引'
    else rubber_result
  end;

insert into public.experiment_rows (group_no, charged_object, glass_result, rubber_result, updated_at)
values
  (1, '毛皮摩擦过的PVC管', null, null, null),
  (2, '头发摩擦过的气球', null, null, null),
  (3, '纸巾摩擦过的吸管', null, null, null),
  (4, '毛皮摩擦过的笔', null, null, null),
  (5, '棉手套摩擦过的杯子', null, null, null),
  (6, '毛衣摩擦过的刻度尺', null, null, null),
  (7, '丝绸摩擦过的塑料盒', null, null, null),
  (8, '塑料袋摩擦过的桶', null, null, null),
  (9, '白色布摩擦过的板子', null, null, null),
  (10, '绝缘手套摩擦过的刻度尺', null, null, null),
  (11, '毛巾摩擦过的试管', null, null, null)
on conflict (group_no) do update
set charged_object = excluded.charged_object;

alter table public.experiment_rows
  add constraint experiment_rows_glass_result_check
  check (glass_result in ('相互排斥', '相互吸引'));

alter table public.experiment_rows
  add constraint experiment_rows_rubber_result_check
  check (rubber_result in ('相互排斥', '相互吸引'));
