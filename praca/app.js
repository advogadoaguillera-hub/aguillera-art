/* ==========================================================================
   A Praça · a praça viva
   Fala com o Supabase: conta, perfil, quem está acordado, salas e posts.
   ========================================================================== */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const CFG = window.PRACA_CONFIG;
const supa = createClient(CFG.url, CFG.chave);
const $ = (id) => document.getElementById(id);
const el = (tag, cls, texto) => { const e = document.createElement(tag); if (cls) e.className = cls; if (texto != null) e.textContent = texto; return e; };
const hora = (iso) => { const d = new Date(iso), dif = (Date.now() - d) / 60000; if (dif < 1) return 'agora'; if (dif < 60) return `há ${Math.round(dif)} min`; if (dif < 1440) return `há ${Math.round(dif / 60)} h`; return d.toLocaleDateString('pt-BR'); };

/* ---------------- estado ---------------- */
let usuario = null, perfil = null, salas = [], salaAtual = 'mundo', presencas = {}, canalPosts = null;

/* ---------------- conta ---------------- */
async function carregarSessao() {
  const { data: { session } } = await supa.auth.getSession();
  usuario = session?.user ?? null;
  perfil = null;
  if (usuario) {
    const { data } = await supa.from('perfis').select('*').eq('id', usuario.id).maybeSingle();
    perfil = data;
    if (!perfil) abrirPerfil(true);
  }
  pintarConta();
  anunciarPresenca();
}
supa.auth.onAuthStateChange((_ev, session) => { usuario = session?.user ?? null; carregarSessao(); });

function pintarConta() {
  const b = $('conta');
  if (!usuario) { b.textContent = 'Entrar'; b.onclick = () => $('login').showModal(); return; }
  b.textContent = perfil ? (perfil.anonimo ? 'Anônimo' : perfil.apelido) : 'Seu perfil';
  b.onclick = () => abrirPerfil(false);
}

$('login-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = $('login-email').value.trim();
  $('login-nota').textContent = 'Enviando…';
  const { error } = await supa.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true } });
  if (error) { $('login-nota').textContent = 'Não deu: ' + error.message; return; }
  $('login-passo-1').hidden = true; $('login-passo-2').hidden = false;
  $('login-nota').textContent = 'Mandamos um e-mail para ' + email + '. Abra e clique no link, ou digite aqui o código que veio nele.';
});
$('codigo-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = $('login-email').value.trim(), token = $('login-codigo').value.trim();
  const { error } = await supa.auth.verifyOtp({ email, token, type: 'email' });
  if (error) { $('login-nota').textContent = 'Código não bateu: ' + error.message; return; }
  $('login').close();
});
$('login-fechar').addEventListener('click', () => $('login').close());

/* ---------------- perfil ---------------- */
function abrirPerfil(novo) {
  $('perfil-titulo').textContent = novo ? 'Como você quer ser chamado?' : 'Seu perfil';
  $('perfil-apelido').value = perfil?.apelido ?? '';
  $('perfil-cidade').value = perfil?.cidade ?? '';
  $('perfil-estado').value = perfil?.estado ?? '';
  $('perfil-pais').value = perfil?.pais ?? 'Brasil';
  $('perfil-anonimo').checked = !!perfil?.anonimo;
  $('perfil-sair').hidden = novo;
  $('perfil').showModal();
}
$('perfil-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const dados = {
    id: usuario.id,
    apelido: $('perfil-apelido').value.trim(),
    cidade: $('perfil-cidade').value.trim() || null,
    estado: $('perfil-estado').value.trim() || null,
    pais: $('perfil-pais').value.trim() || 'Brasil',
    anonimo: $('perfil-anonimo').checked,
  };
  const { error } = await supa.from('perfis').upsert(dados);
  if (error) { $('perfil-nota').textContent = /unique|duplicate/i.test(error.message) ? 'Esse apelido já tem dono. Escolha outro.' : 'Não deu: ' + error.message; return; }
  perfil = dados; $('perfil').close(); pintarConta(); anunciarPresenca();
});
$('perfil-sair').addEventListener('click', async () => { await supa.auth.signOut(); $('perfil').close(); });
$('perfil-fechar').addEventListener('click', () => $('perfil').close());

/* ---------------- quem está acordado (presença em tempo real) ---------------- */
const canalPresenca = supa.channel('praca', { config: { presence: { key: crypto.randomUUID() } } });
canalPresenca.on('presence', { event: 'sync' }, () => {
  presencas = canalPresenca.presenceState();
  const todos = Object.values(presencas).flat();
  $('online').textContent = todos.length.toLocaleString('pt-BR');
  window.pintarPontos && window.pintarPontos(todos);
  pintarContagemSalas(todos);
}).subscribe((status) => { if (status === 'SUBSCRIBED') anunciarPresenca(); });

function anunciarPresenca() {
  canalPresenca.track({
    cidade: perfil?.cidade ?? null, estado: perfil?.estado ?? null, pais: perfil?.pais ?? null,
    lat: perfil?.lat ?? null, lon: perfil?.lon ?? null, sala: salaAtual, desde: new Date().toISOString(),
  });
}
function pintarContagemSalas(todos) {
  document.querySelectorAll('.nivel[data-sala]').forEach((b) => {
    const s = b.dataset.sala;
    const n = s === 'mundo' ? todos.length : todos.filter((p) => p.sala === s).length;
    b.querySelector('small').textContent = n;
  });
}

/* ---------------- salas ---------------- */
async function carregarSalas() {
  const { data } = await supa.from('salas').select('*').order('ordem');
  salas = data ?? [];
  const caixa = $('niveis'); caixa.innerHTML = '';
  const prof = { mundo: 0, continente: 1, pais: 2, estado: 3, cidade: 4 };
  salas.filter((s) => s.tipo !== 'tema').forEach((s) => {
    const b = el('button', 'nivel'); b.dataset.prof = prof[s.tipo] ?? 0; b.dataset.sala = s.id;
    b.innerHTML = `<span><span class="ponto"></span> </span><small>0</small>`;
    b.querySelector('span').append(s.nome);
    b.addEventListener('click', () => irPara(s));
    caixa.append(b);
  });
  const temas = salas.filter((s) => s.tipo === 'tema');
  const lt = $('lista-temas');
  if (lt) {
    lt.innerHTML = '';
    temas.forEach((s) => {
      const b = el('button', 'tema');
      b.innerHTML = `<span class="area"></span><h3></h3><small></small><span class="abrir">Entrar na sala →</span>`;
      b.querySelector('.area').textContent = (s.descricao || '').split('·')[0].trim();
      b.querySelector('h3').textContent = s.nome;
      b.querySelector('small').textContent = (s.descricao || '').split('·').slice(1).join('·').trim();
      b.addEventListener('click', () => { irPara(s); $('conversa-caixa').scrollIntoView({ behavior: 'smooth' }); });
      lt.append(b);
    });
  }
}
function trilha(s) {
  const cadeia = []; let x = s;
  while (x) { cadeia.unshift(x); x = salas.find((k) => k.id === x.pai); }
  return cadeia;
}
async function irPara(s) {
  salaAtual = s.id;
  document.querySelectorAll('.nivel').forEach((b) => b.classList.toggle('ativo', b.dataset.sala === s.id));
  $('sala-titulo').textContent = s.nome; $('sala-sub').textContent = s.descricao || '';
  $('trilha').innerHTML = trilha(s).map((k, i, a) => i === a.length - 1 ? `<b>${k.nome}</b>` : `<span>${k.nome}</span><span>›</span>`).join('');
  if (window.irParaMapa && s.lat != null) window.irParaMapa([s.lon, s.lat], s.escala || 3, s.tipo === 'mundo');
  anunciarPresenca();
  await carregarPosts();
}

/* ---------------- posts ---------------- */
async function carregarPosts() {
  const { data } = await supa.from('posts_publicos').select('*').eq('sala', salaAtual).order('criado_em', { ascending: false }).limit(60);
  const feed = $('feed'); feed.innerHTML = '';
  const lista = (data ?? []).reverse();
  if (!lista.length) feed.append(el('p', 'nota', 'Ainda ninguém falou aqui. Você seria o primeiro.'));
  lista.forEach((p) => feed.append(cartaoPost(p)));
  feed.scrollTop = feed.scrollHeight;
  if (canalPosts) supa.removeChannel(canalPosts);
  canalPosts = supa.channel('posts:' + salaAtual)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts', filter: 'sala=eq.' + salaAtual }, async (m) => {
      const { data: p } = await supa.from('posts_publicos').select('*').eq('id', m.new.id).maybeSingle();
      if (!p) return;
      const vazio = feed.querySelector('.nota'); if (vazio) vazio.remove();
      feed.append(cartaoPost(p)); feed.scrollTop = feed.scrollHeight;
    }).subscribe();
}
function cartaoPost(p) {
  const dourado = p.destaque_ate && new Date(p.destaque_ate) > new Date();
  const art = el('article', 'post' + (dourado ? ' dourado' : '') + (p.voz ? ' voz' : ''));
  art.style.setProperty('--cor', p.voz ? 'var(--ciano)' : (p.quem === 'Anônimo' ? 'var(--texto-3)' : 'var(--magenta)'));
  const av = el('div', 'av', p.voz ? '◌' : p.quem[0].toUpperCase());
  const corpo = el('div');
  const quem = el('div', 'quem'); quem.append(el('b', null, p.voz ? 'a voz' : p.quem), ` · ${p.de || 'algum lugar'} · ${hora(p.criado_em)}`);
  const txt = el('p', null, p.texto);
  const acoes = el('div', 'acoes');
  const den = el('button', 'denunciar', 'isso não devia estar aqui');
  den.addEventListener('click', () => denunciar(p.id, den));
  acoes.append(den);
  if (dourado) acoes.append(el('span', 'pago', '★ destaque'));
  corpo.append(quem, txt, acoes); art.append(av, corpo);
  return art;
}
async function denunciar(id, botao) {
  if (!usuario) return $('login').showModal();
  const { error } = await supa.from('denuncias').insert({ post: id, autor: usuario.id });
  botao.textContent = error ? 'já denunciado' : 'denunciado, obrigado'; botao.disabled = true;
}
$('escrever').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!usuario) return $('login').showModal();
  if (!perfil) return abrirPerfil(true);
  const campo = $('texto'), texto = campo.value.trim(); if (!texto) return;
  const botao = $('falar'); botao.disabled = true; botao.textContent = '…';
  const { data, error } = await supa.functions.invoke('falar', { body: { sala: salaAtual, texto } });
  botao.disabled = false; botao.textContent = 'Falar';
  const erro = error ? (await error.context?.json?.().catch(() => null))?.erro || error.message : data?.erro;
  if (erro) { $('escrever-nota').textContent = erro; return; }
  $('escrever-nota').textContent = ''; campo.value = '';
  if (/@voz/i.test(texto)) supa.functions.invoke('voz', { body: { sala: salaAtual } });
});

/* ---------------- partida ---------------- */
await carregarSalas();
await carregarSessao();
await irPara(salas.find((s) => s.id === 'mundo') || salas[0]);
