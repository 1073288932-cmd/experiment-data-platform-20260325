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

alter table public.experiment_rows
  add constraint experiment_rows_glass_result_check
  check (glass_result in ('相互排斥', '相互吸引'));

alter table public.experiment_rows
  add constraint experiment_rows_rubber_result_check
  check (rubber_result in ('相互排斥', '相互吸引'));
