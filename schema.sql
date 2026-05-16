-- Run this in your Supabase SQL editor

create table classes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  level text,
  size integer,
  vibe text,
  recurring_notes text,
  created_at timestamptz default now()
);

create table generated_sequences (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes on delete cascade not null,
  user_id uuid references auth.users not null,
  theme text,
  intention text,
  sequence_data jsonb not null,
  after_class_notes text,
  generated_at timestamptz default now()
);

alter table classes enable row level security;
alter table generated_sequences enable row level security;

create policy "users own their classes"
  on classes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users own their sequences"
  on generated_sequences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
