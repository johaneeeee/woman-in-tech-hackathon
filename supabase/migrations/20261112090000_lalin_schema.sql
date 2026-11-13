-- Lalin shared data. Anonymous, nickname only. No free text between users.

create table if not exists public.quests (
  id text primary key,
  world text not null check (world in ('body','mind','glow','learn')),
  moon_phase text not null check (moon_phase in ('new','waxing','full','waning')),
  title text not null,
  description text not null,
  xp int not null default 10,
  kind text not null default 'simple'
);

create table if not exists public.myth_cards (
  id text primary key,
  category text not null,
  statement text not null,
  is_myth boolean not null,
  explanation text not null
);

create table if not exists public.run_scores (
  id uuid primary key default gen_random_uuid(),
  player_id text not null check (char_length(player_id) between 8 and 64),
  nickname text not null check (char_length(nickname) between 1 and 16),
  avatar text not null check (avatar in ('pearl','honey','peach','lagoon','mist')),
  level int not null check (level between 1 and 6),
  score int not null check (score between 0 and 100000),
  stars int not null check (stars between 0 and 3),
  plastic_collected int not null check (plastic_collected between 0 and 1000),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists run_scores_created_idx on public.run_scores (created_at desc);

create table if not exists public.circles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z]{6}$'),
  name text not null check (char_length(name) between 1 and 24),
  created_at timestamptz not null default now()
);

create table if not exists public.circle_members (
  circle_id uuid not null references public.circles(id) on delete cascade,
  player_id text not null,
  nickname text not null check (char_length(nickname) between 1 and 16),
  avatar text not null,
  last_quest_date date,
  joined_at timestamptz not null default now(),
  primary key (circle_id, player_id)
);

create table if not exists public.encouragements (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles(id) on delete cascade,
  from_player_id text not null,
  from_nickname text not null,
  to_player_id text not null,
  to_nickname text not null,
  message_key text not null check (message_key in ('proud','keep_going','thinking','bravo')),
  created_at timestamptz not null default now()
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  goal int not null,
  location text not null,
  event_date timestamptz not null,
  active boolean not null default true
);

create table if not exists public.mission_signups (
  mission_id uuid not null references public.missions(id) on delete cascade,
  player_id text not null,
  nickname text not null,
  created_at timestamptz not null default now(),
  primary key (mission_id, player_id)
);

alter table public.quests enable row level security;
alter table public.myth_cards enable row level security;
alter table public.run_scores enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.encouragements enable row level security;
alter table public.missions enable row level security;
alter table public.mission_signups enable row level security;

create policy "read quests" on public.quests for select using (true);
create policy "read myth cards" on public.myth_cards for select using (true);
create policy "read missions" on public.missions for select using (true);

create policy "read run scores" on public.run_scores for select using (true);
create policy "add run score" on public.run_scores for insert with check (is_demo = false);

create policy "read circles" on public.circles for select using (true);
create policy "read circle members" on public.circle_members for select using (true);
create policy "update own member" on public.circle_members for update using (true) with check (true);
create policy "leave circle" on public.circle_members for delete using (true);

create policy "read encouragements" on public.encouragements for select using (true);
create policy "send encouragement" on public.encouragements for insert with check (
  exists (select 1 from public.circle_members m where m.circle_id = encouragements.circle_id and m.player_id = encouragements.from_player_id)
  and exists (select 1 from public.circle_members m where m.circle_id = encouragements.circle_id and m.player_id = encouragements.to_player_id)
);

create policy "read signups" on public.mission_signups for select using (true);
create policy "sign up" on public.mission_signups for insert with check (true);
create policy "cancel signup" on public.mission_signups for delete using (true);

-- Community plastic total
create or replace function public.community_plastic()
returns bigint language sql stable security definer set search_path = public as $$
  select coalesce(sum(plastic_collected), 0)::bigint from public.run_scores;
$$;

-- Top 10 this week: sum of best stars per level, then plastic
create or replace function public.weekly_leaderboard()
returns table (player_id text, nickname text, avatar text, stars bigint, plastic bigint)
language sql stable security definer set search_path = public as $$
  with week as (
    select * from public.run_scores where created_at > now() - interval '7 days'
  ), best as (
    select player_id, level, max(stars) as stars from week group by player_id, level
  ), latest as (
    select distinct on (player_id) player_id, nickname, avatar from week order by player_id, created_at desc
  )
  select l.player_id, l.nickname, l.avatar,
    coalesce((select sum(b.stars) from best b where b.player_id = l.player_id), 0)::bigint as stars,
    coalesce((select sum(w.plastic_collected) from week w where w.player_id = l.player_id), 0)::bigint as plastic
  from latest l
  order by stars desc, plastic desc
  limit 10;
$$;

-- Create a circle with a fresh 6-letter code and join it
create or replace function public.create_circle(p_name text, p_player_id text, p_nickname text, p_avatar text)
returns public.circles language plpgsql security definer set search_path = public as $$
declare
  v_code text;
  v_circle public.circles;
  v_letters text := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
begin
  loop
    v_code := '';
    for i in 1..6 loop
      v_code := v_code || substr(v_letters, 1 + floor(random() * length(v_letters))::int, 1);
    end loop;
    exit when not exists (select 1 from public.circles where code = v_code);
  end loop;
  insert into public.circles (code, name) values (v_code, p_name) returning * into v_circle;
  insert into public.circle_members (circle_id, player_id, nickname, avatar)
    values (v_circle.id, p_player_id, p_nickname, p_avatar);
  return v_circle;
end;
$$;

-- Join by code, max 5 members
create or replace function public.join_circle(p_code text, p_player_id text, p_nickname text, p_avatar text)
returns public.circles language plpgsql security definer set search_path = public as $$
declare
  v_circle public.circles;
  v_count int;
begin
  select * into v_circle from public.circles where code = upper(p_code);
  if v_circle.id is null then
    raise exception 'not_found';
  end if;
  if exists (select 1 from public.circle_members where circle_id = v_circle.id and player_id = p_player_id) then
    return v_circle;
  end if;
  select count(*) into v_count from public.circle_members where circle_id = v_circle.id;
  if v_count >= 5 then
    raise exception 'full';
  end if;
  insert into public.circle_members (circle_id, player_id, nickname, avatar)
    values (v_circle.id, p_player_id, p_nickname, p_avatar);
  return v_circle;
end;
$$;

grant execute on function public.community_plastic() to anon, authenticated;
grant execute on function public.weekly_leaderboard() to anon, authenticated;
grant execute on function public.create_circle(text, text, text, text) to anon, authenticated;
grant execute on function public.join_circle(text, text, text, text) to anon, authenticated;
