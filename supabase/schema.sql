-- Perguntas ao vivo: tabelas, seguranca (RLS) e Realtime

create table public.questions (
  id          uuid primary key default gen_random_uuid(),
  text        text not null check (char_length(btrim(text)) between 1 and 200),
  votes_count integer not null default 0,
  created_at  timestamptz not null default now()
);

create table public.votes (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  voter_id    text not null check (char_length(voter_id) between 8 and 64),
  created_at  timestamptz not null default now(),
  unique (question_id, voter_id)
);

create index questions_ranking_idx on public.questions (votes_count desc, created_at);
create index votes_voter_idx on public.votes (voter_id);

-- Cada voto novo soma 1 em questions.votes_count (isso dispara o Realtime)
create function public.incrementar_votos() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.questions set votes_count = votes_count + 1 where id = new.question_id;
  return new;
end;
$$;
revoke execute on function public.incrementar_votos() from public, anon, authenticated;

create trigger votes_incrementa_contador
after insert on public.votes
for each row execute function public.incrementar_votos();

-- Devolve as perguntas em que este navegador ja votou (votes nao e legivel direto)
create function public.meus_votos(p_voter_id text) returns setof uuid
language sql stable security definer set search_path = ''
as $$
  select question_id from public.votes where voter_id = p_voter_id;
$$;
revoke execute on function public.meus_votos(text) from public;
grant execute on function public.meus_votos(text) to anon, authenticated;

-- Seguranca: so leitura de perguntas, insercao de pergunta (texto) e de voto
alter table public.questions enable row level security;
alter table public.votes enable row level security;

revoke all on public.questions from anon, authenticated;
revoke all on public.votes from anon, authenticated;
grant select on public.questions to anon, authenticated;
grant insert (text) on public.questions to anon, authenticated;
grant insert (question_id, voter_id) on public.votes to anon, authenticated;

create policy "Qualquer pessoa le perguntas"
  on public.questions for select to anon, authenticated
  using (true);

create policy "Qualquer pessoa envia pergunta"
  on public.questions for insert to anon, authenticated
  with check (char_length(btrim(text)) between 1 and 200);

create policy "Qualquer pessoa vota"
  on public.votes for insert to anon, authenticated
  with check (char_length(voter_id) between 8 and 64);

-- Realtime na lista de perguntas
alter publication supabase_realtime add table public.questions;
