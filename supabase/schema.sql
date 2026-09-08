-- ═══════════════════════════════════════════════════════════════
--  CareerAI — Supabase Schema
--  Run this in your Supabase SQL Editor (project > SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────
create table public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  email         text,
  full_name     text,
  avatar_url    text,
  github_id     text,
  linkedin_url  text,
  status        text,   -- undergraduate | fresher | working ...
  field         text,   -- cs | ece | business ...
  region        text,   -- india | usa | uk ...
  gpa           text,
  career_match  text,   -- latest matched career key (synced on each assessment)
  xp            integer default 0,
  level         integer default 1,
  streak        integer default 0,
  last_active   date,
  created_at    timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"  on public.profiles for select using (auth.uid() = id);
create policy "Public leaderboard read"     on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- ─── ASSESSMENTS ────────────────────────────────────────────
create table public.assessments (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade,
  quiz_answers    jsonb,          -- array of chosen indices
  github_repos    jsonb,          -- fetched repo data
  skills          jsonb,          -- {langs, frameworks, tools}
  project_desc    text,
  preferences     jsonb,          -- {workEnv, jobPriority, companyType, extraNotes}
  ai_analysis     jsonb,          -- full OpenAI response
  career_match    text,           -- top career key
  match_score     integer,
  created_at      timestamptz default now()
);

alter table public.assessments enable row level security;
create policy "Users manage own assessments" on public.assessments for all using (auth.uid() = user_id);

-- ─── ROADMAP PROGRESS ───────────────────────────────────────
create table public.roadmap_progress (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade,
  assessment_id   uuid references public.assessments(id) on delete cascade,
  phase           text,           -- early | mid | late
  milestone_index integer,
  milestone_text  text,
  completed       boolean default false,
  completed_at    timestamptz,
  created_at      timestamptz default now()
);

alter table public.roadmap_progress enable row level security;
create policy "Users manage own progress" on public.roadmap_progress for all using (auth.uid() = user_id);

-- ─── BADGES ─────────────────────────────────────────────────
create table public.badges (
  id          uuid default uuid_generate_v4() primary key,
  key         text unique not null,   -- github_active | quiz_master | first_roadmap ...
  name        text not null,
  description text,
  icon        text,
  xp_reward   integer default 50
);

-- Seed default badges
insert into public.badges (key, name, description, icon, xp_reward) values
  ('first_login',       'First Step',         'Logged in for the first time',               '👋', 50),
  ('quiz_complete',     'Self-Aware',          'Completed the career interest quiz',         '🧠', 100),
  ('github_connected',  'Open Source Hero',   'Connected your GitHub profile',              '💻', 75),
  ('first_assessment',  'Career Explorer',    'Completed your first full assessment',       '🗺️', 150),
  ('streak_3',          '3-Day Streak',       'Active 3 days in a row',                     '🔥', 100),
  ('streak_7',          'Week Warrior',       'Active 7 days in a row',                     '⚡', 200),
  ('milestone_1',       'First Step Forward', 'Completed your first roadmap milestone',     '✅', 75),
  ('milestone_5',       'On a Roll',          'Completed 5 roadmap milestones',             '🎯', 150),
  ('milestone_10',      'Dedicated',          'Completed 10 roadmap milestones',            '🏆', 300),
  ('level_5',           'Rising Star',        'Reached Level 5',                            '⭐', 200),
  ('level_10',          'Career Pro',         'Reached Level 10',                           '🌟', 500),
  ('reassessed',        'Growth Mindset',     'Retook the assessment to track growth',      '📈', 100);

-- ─── USER BADGES ────────────────────────────────────────────
create table public.user_badges (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade,
  badge_key   text references public.badges(key),
  earned_at   timestamptz default now(),
  unique(user_id, badge_key)
);

alter table public.user_badges enable row level security;
create policy "Users view own badges" on public.user_badges for select using (auth.uid() = user_id);
create policy "Users insert own badges" on public.user_badges for insert with check (auth.uid() = user_id);

-- ─── LEADERBOARD VIEW ───────────────────────────────────────
create view public.leaderboard as
  select
    p.id,
    p.full_name,
    p.avatar_url,
    p.xp,
    p.level,
    p.streak,
    p.career_match,
    rank() over (order by p.xp desc) as rank
  from public.profiles p
  where p.xp > 0
  order by p.xp desc
  limit 100;

-- ─── TRIGGER: auto-create profile on signup ─────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── FUNCTION: award XP + level up ──────────────────────────
create or replace function public.award_xp(p_user_id uuid, p_xp integer)
returns void as $$
declare
  new_xp integer;
  new_level integer;
begin
  update public.profiles
  set xp = xp + p_xp
  where id = p_user_id
  returning xp into new_xp;

  -- Level formula: level = floor(sqrt(xp / 100)) + 1, cap 20
  new_level := least(20, floor(sqrt(new_xp::float / 100))::integer + 1);

  update public.profiles set level = new_level where id = p_user_id;
end;
$$ language plpgsql security definer;
