-- ==========================================================================
-- A Praça · banco de dados (Supabase / Postgres)
-- Rodar uma vez no SQL Editor do projeto. Idempotente: pode rodar de novo.
-- ==========================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Perfis: um por conta. O apelido é público; "anonimo" esconde o apelido.
-- ---------------------------------------------------------------------------
create table if not exists perfis (
  id          uuid primary key references auth.users(id) on delete cascade,
  apelido     text not null unique check (char_length(apelido) between 2 and 24 and apelido ~ '^[A-Za-zÀ-ÿ0-9_.]+$'),
  anonimo     boolean not null default false,
  pais        text not null default 'Brasil',
  estado      text,
  cidade      text,
  lat         double precision,
  lon         double precision,
  criado_em   timestamptz not null default now(),
  banido_ate  timestamptz
);

-- ---------------------------------------------------------------------------
-- Salas: Mundo, continentes, países, estados, cidades e temas.
-- "caminho" é o endereço legível: mundo / america-do-sul / brasil / ms / corumba
-- ---------------------------------------------------------------------------
create table if not exists salas (
  id        text primary key,            -- ex.: 'mundo', 'brasil', 'ms', 'corumba', 'tema:utero-artificial'
  nome      text not null,
  tipo      text not null check (tipo in ('mundo','continente','pais','estado','cidade','tema')),
  pai       text references salas(id),
  descricao text,
  lat       double precision,
  lon       double precision,
  escala    double precision default 1,
  ordem     int default 0
);

insert into salas (id, nome, tipo, pai, descricao, lat, lon, escala, ordem) values
  ('mundo', 'Mundo', 'mundo', null, 'Todo mundo que está acordado agora', 10, -30, 1, 0),
  ('america-do-sul', 'América do Sul', 'continente', 'mundo', 'Do Caribe à Patagônia', -18, -60, 2.1, 1),
  ('brasil', 'Brasil', 'pais', 'america-do-sul', 'A sala em português', -14, -53, 3.1, 2),
  ('ms', 'Mato Grosso do Sul', 'estado', 'brasil', 'Pantanal, cerrado e fronteira', -20.5, -55, 7, 3),
  ('corumba', 'Corumbá', 'cidade', 'ms', 'A última sala, a mais perto de casa', -19.0, -57.65, 15, 4)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Posts: o que as pessoas dizem. Só entram pela função "falar" (porteiro).
-- ---------------------------------------------------------------------------
create table if not exists posts (
  id            bigint generated always as identity primary key,
  sala          text not null references salas(id),
  autor         uuid not null references perfis(id),
  texto         text not null check (char_length(texto) between 1 and 600),
  responde_a    bigint references posts(id),
  destaque_ate  timestamptz,               -- Megafone: Destaque
  voz           boolean not null default false, -- true = a voz da Praça escreveu
  criado_em     timestamptz not null default now(),
  apagado       boolean not null default false
);
create index if not exists posts_sala_idx on posts (sala, criado_em desc);

-- ---------------------------------------------------------------------------
-- Megafone: manchetes e músicas compradas (quem, quanto, até quando)
-- ---------------------------------------------------------------------------
create table if not exists megafone (
  id          bigint generated always as identity primary key,
  sala        text not null references salas(id),
  autor       uuid not null references perfis(id),
  tipo        text not null check (tipo in ('destaque','manchete','trilha')),
  texto       text,                         -- a manchete, ou o título da música
  youtube     text,                         -- código do vídeo, para a trilha
  valor       numeric(10,2) not null,
  moeda       text not null default 'BRL',
  pagamento   text,                         -- id da cobrança no Mercado Pago / Stripe
  pago        boolean not null default false,
  comeca_em   timestamptz,
  termina_em  timestamptz,
  criado_em   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Denúncias: o botão "isso não devia estar aqui"
-- ---------------------------------------------------------------------------
create table if not exists denuncias (
  id        bigint generated always as identity primary key,
  post      bigint not null references posts(id),
  autor     uuid not null references perfis(id),
  motivo    text,
  criado_em timestamptz not null default now(),
  unique (post, autor)
);

-- ---------------------------------------------------------------------------
-- Segurança (RLS): todo mundo lê; cada um só mexe no que é seu;
-- posts e megafone entram só pelas funções do servidor.
-- ---------------------------------------------------------------------------
alter table perfis    enable row level security;
alter table salas     enable row level security;
alter table posts     enable row level security;
alter table megafone  enable row level security;
alter table denuncias enable row level security;

drop policy if exists "perfis: ler" on perfis;
create policy "perfis: ler" on perfis for select using (true);
drop policy if exists "perfis: criar o seu" on perfis;
create policy "perfis: criar o seu" on perfis for insert with check (auth.uid() = id);
drop policy if exists "perfis: editar o seu" on perfis;
create policy "perfis: editar o seu" on perfis for update using (auth.uid() = id);

drop policy if exists "salas: ler" on salas;
create policy "salas: ler" on salas for select using (true);

drop policy if exists "posts: ler" on posts;
create policy "posts: ler" on posts for select using (not apagado);
-- inserção só via função "falar" (service role); ninguém insere direto

drop policy if exists "megafone: ler" on megafone;
create policy "megafone: ler" on megafone for select using (pago);

drop policy if exists "denuncias: criar" on denuncias;
create policy "denuncias: criar" on denuncias for insert with check (auth.uid() = autor);

-- ---------------------------------------------------------------------------
-- Visão pública dos posts: respeita o anonimato
-- ---------------------------------------------------------------------------
create or replace view posts_publicos as
select p.id, p.sala, p.texto, p.responde_a, p.destaque_ate, p.voz, p.criado_em,
       case when pf.anonimo then 'Anônimo' else pf.apelido end as quem,
       coalesce(pf.cidade, pf.estado, pf.pais) as de
from posts p join perfis pf on pf.id = p.autor
where not p.apagado;

-- tempo real nos posts
do $$ begin
  alter publication supabase_realtime add table posts;
exception when duplicate_object then null; end $$;
