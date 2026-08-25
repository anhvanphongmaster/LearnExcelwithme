-- Practice lesson votes (1 vote / browser)
create table if not exists public.practice_votes (
  id bigserial primary key,
  lesson_id text not null,
  lesson_number int,
  lesson_title text,
  vote_type text not null check (vote_type in ('need_guide','need_more_guide')),
  voter_key text not null,
  created_at timestamptz not null default now(),
  unique (lesson_id, voter_key)
);

create index if not exists practice_votes_lesson_idx on public.practice_votes (lesson_id);
create index if not exists practice_votes_created_idx on public.practice_votes (created_at desc);

alter table public.practice_votes enable row level security;

-- anon can insert own vote (no update/delete)
drop policy if exists practice_votes_insert_anon on public.practice_votes;
create policy practice_votes_insert_anon on public.practice_votes
  for insert to anon, authenticated
  with check (true);

-- allow anon to count? better via rpc only
drop policy if exists practice_votes_select_none on public.practice_votes;
-- no direct select for anon

create or replace function public.vote_practice_lesson(
  p_lesson_id text,
  p_lesson_number int,
  p_lesson_title text,
  p_vote_type text,
  p_voter_key text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_lesson_id is null or length(trim(p_lesson_id)) = 0 then
    return json_build_object('ok', false, 'error', 'missing_lesson');
  end if;
  if p_voter_key is null or length(trim(p_voter_key)) < 8 then
    return json_build_object('ok', false, 'error', 'missing_voter');
  end if;
  if p_vote_type not in ('need_guide','need_more_guide') then
    return json_build_object('ok', false, 'error', 'bad_type');
  end if;

  insert into public.practice_votes(lesson_id, lesson_number, lesson_title, vote_type, voter_key)
  values (p_lesson_id, p_lesson_number, p_lesson_title, p_vote_type, p_voter_key)
  on conflict (lesson_id, voter_key) do nothing;

  if not found then
    return json_build_object('ok', false, 'error', 'already_voted');
  end if;

  return json_build_object('ok', true);
end;
$$;

create or replace function public.admin_list_practice_votes()
returns table (
  lesson_id text,
  lesson_number int,
  lesson_title text,
  vote_type text,
  votes bigint
)
language sql
security definer
set search_path = public
as $$
  select lesson_id, lesson_number, max(lesson_title) as lesson_title, vote_type, count(*)::bigint as votes
  from public.practice_votes
  group by lesson_id, lesson_number, vote_type
  order by votes desc, lesson_number nulls last;
$$;

grant execute on function public.vote_practice_lesson(text,int,text,text,text) to anon, authenticated;
grant execute on function public.admin_list_practice_votes() to authenticated;
