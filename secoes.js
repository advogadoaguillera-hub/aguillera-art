/* ==========================================================================
   Aguillera · Arte & Direito — Cinema, Galeria, Ideias, newsletter e menu
   Lê tudo de conteudo.js. Para postar, edite aquele arquivo, não este.
   ========================================================================== */
(function () {
  const C = window.CONTEUDO || {};
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, texto) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = texto;
    return e;
  };
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function data(iso) {
    if (!iso) return '';
    const [a, m, d] = iso.split('-').map(Number);
    return `${d} ${MESES[m - 1]} ${a}`;
  }
  function selo(item) {
    if (!item.ia) return null;
    return el('span', 'selo-ia', 'feito com IA');
  }

  /* ---------------------------------------------------------------------
     1. Cinema da Justiça — player leve: só carrega o YouTube ao clicar
     --------------------------------------------------------------------- */
  function cartaz(v) {
    const fig = el('figure', 'cartaz');
    if (v.youtube) {
      const img = el('img');
      img.src = `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg`;
      img.alt = ''; img.loading = 'lazy';
      fig.append(img);
      const play = el('button', 'play');
      play.setAttribute('aria-label', 'Assistir: ' + v.titulo);
      play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      play.addEventListener('click', () => {
        const ifr = el('iframe');
        ifr.src = `https://www.youtube-nocookie.com/embed/${v.youtube}?autoplay=1&rel=0`;
        ifr.title = v.titulo; ifr.allow = 'autoplay; fullscreen; picture-in-picture'; ifr.allowFullscreen = true;
        fig.replaceChildren(ifr); fig.classList.add('tocando');
      });
      fig.append(play);
    } else {
      fig.classList.add('em-breve');
      fig.append(el('span', 'breve', 'em breve'));
    }
    return fig;
  }
  function cartaoVideo(v, destaque) {
    const art = el('article', destaque ? 'filme destaque-filme' : 'filme');
    art.append(cartaz(v));
    const corpo = el('div', 'filme-corpo');
    const meta = el('p', 'meta');
    [data(v.data), v.duracao].filter(Boolean).forEach((t, i) => { if (i) meta.append(' · '); meta.append(t); });
    const s = selo(v); if (s) meta.append(s);
    corpo.append(meta, el('h3', null, v.titulo), el('p', 'sinopse', v.sinopse));
    art.append(corpo);
    return art;
  }
  (function cinema() {
    const lista = C.videos || [];
    const secao = $('cinema');
    if (!lista.length) { secao.hidden = true; return; }
    $('video-destaque').append(cartaoVideo(lista[0], true));
    const fila = $('video-fila');
    lista.slice(1).forEach((v) => fila.append(cartaoVideo(v, false)));
    if (lista.length === 1) fila.hidden = true;
  })();

  /* ---------------------------------------------------------------------
     2. Galeria — mosaico e tela cheia
     --------------------------------------------------------------------- */
  (function galeria() {
    const lista = C.galeria || [];
    const secao = $('galeria');
    if (!lista.length) { secao.hidden = true; return; }
    const mosaico = $('mosaico'), tela = $('tela-cheia');
    let atual = 0;
    lista.forEach((g, i) => {
      const b = el('button', 'obra');
      const img = el('img'); img.src = g.arquivo; img.alt = g.titulo; img.loading = 'lazy';
      const leg = el('figcaption');
      leg.append(el('strong', null, g.titulo));
      const s = selo(g); if (s) leg.append(s);
      const fig = el('figure'); fig.append(img, leg);
      b.append(fig);
      b.addEventListener('click', () => abrir(i));
      mosaico.append(b);
    });
    function mostrar(i) {
      atual = (i + lista.length) % lista.length;
      const g = lista[atual];
      $('tela-img').src = g.arquivo; $('tela-img').alt = g.titulo;
      $('tela-titulo').textContent = g.titulo; $('tela-legenda').textContent = g.legenda || '';
    }
    function abrir(i) { mostrar(i); tela.showModal(); }
    $('tela-ant').addEventListener('click', () => mostrar(atual - 1));
    $('tela-prox').addEventListener('click', () => mostrar(atual + 1));
    $('tela-fechar').addEventListener('click', () => tela.close());
    tela.addEventListener('click', (e) => { if (e.target === tela) tela.close(); });
    tela.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  })();

  /* ---------------------------------------------------------------------
     3. Ideias — lista de ensaios e leitor (texto simples → HTML)
     --------------------------------------------------------------------- */
  function escapar(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function linha(s) {
    return escapar(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  function textoParaHtml(md) {
    const blocos = md.replace(/\r/g, '').split(/\n{2,}/);
    return blocos.map((b) => {
      const t = b.trim(); if (!t) return '';
      if (t === '---') return '<hr>';
      let m;
      if ((m = t.match(/^(#{1,3})\s+(.+)$/))) return `<h${m[1].length + 1}>${linha(m[2])}</h${m[1].length + 1}>`;
      if (t.split('\n').every((l) => /^>\s?/.test(l))) return `<blockquote>${linha(t.replace(/^>\s?/gm, '').replace(/\n/g, ' '))}</blockquote>`;
      if (t.split('\n').every((l) => /^[-*]\s+/.test(l))) return '<ul>' + t.split('\n').map((l) => `<li>${linha(l.replace(/^[-*]\s+/, ''))}</li>`).join('') + '</ul>';
      if (t.split('\n').every((l) => /^\d+\.\s+/.test(l))) return '<ol>' + t.split('\n').map((l) => `<li>${linha(l.replace(/^\d+\.\s+/, ''))}</li>`).join('') + '</ol>';
      return `<p>${linha(t).replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
  }
  (function ideias() {
    const lista = C.ideias || [];
    const secao = $('ideias');
    if (!lista.length) { secao.hidden = true; return; }
    const caixa = $('ensaios'), leitor = $('leitor'), corpo = $('leitor-corpo');
    lista.forEach((e, i) => {
      const b = el('button', 'ensaio');
      b.append(el('span', 'num', String(i + 1).padStart(2, '0')));
      const txt = el('span', 'ensaio-texto');
      txt.append(el('span', 'meta', data(e.data)), el('strong', null, e.titulo), el('span', 'resumo', e.resumo));
      b.append(txt, el('span', 'ler', 'Ler →'));
      b.addEventListener('click', () => abrir(e));
      caixa.append(b);
    });
    async function abrir(e) {
      corpo.innerHTML = `<p class="meta">${data(e.data)}</p><h2>${escapar(e.titulo)}</h2><p class="carregando">Abrindo…</p>`;
      leitor.showModal(); leitor.scrollTop = 0;
      try {
        const r = await fetch(e.arquivo, { cache: 'no-cache' });
        if (!r.ok) throw new Error(r.status);
        let md = await r.text();
        md = md.replace(/^#\s+.+\n?/, ''); // o título já está no cabeçalho
        const palavras = md.split(/\s+/).length, min = Math.max(1, Math.round(palavras / 200));
        corpo.innerHTML = `<p class="meta">${data(e.data)} · leitura de ${min} min</p><h2>${escapar(e.titulo)}</h2>${textoParaHtml(md)}<p class="assinatura">Jocsan Aguillera</p>`;
      } catch (err) {
        corpo.innerHTML += '<p class="carregando">Não foi possível abrir o texto agora.</p>';
      }
    }
    $('leitor-fechar').addEventListener('click', () => leitor.close());
    leitor.addEventListener('click', (ev) => { if (ev.target === leitor) leitor.close(); });
  })();

  /* ---------------------------------------------------------------------
     4. Newsletter
     --------------------------------------------------------------------- */
  (function boletim() {
    const form = $('boletim'); if (!form) return;
    const cfg = C.newsletter || {}, nota = $('boletim-nota'), campo = $('boletim-email');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const email = campo.value.trim();
      if (!campo.checkValidity() || !email) { nota.textContent = 'Confira o e-mail: parece incompleto.'; campo.focus(); return; }
      if (cfg.url) {
        nota.textContent = 'Enviando…';
        try {
          const r = await fetch(cfg.url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email }) });
          if (!r.ok) throw new Error(r.status);
          form.reset(); nota.textContent = 'Pronto. Você está na lista.';
        } catch (err) {
          nota.textContent = 'Não deu certo agora. Tente de novo em instantes.';
        }
        return;
      }
      const assunto = encodeURIComponent('Quero receber os filmes e ensaios');
      const corpo = encodeURIComponent(`Olá, Jocsan. Quero entrar na lista do Arte & Direito.\nMeu e-mail: ${email}`);
      location.href = `mailto:${cfg.email || 'jocsan@aguillera.art.br'}?subject=${assunto}&body=${corpo}`;
      nota.textContent = 'Abrimos uma mensagem pronta no seu e-mail. É só enviar.';
    });
  })();

  /* ---------------------------------------------------------------------
     5. Menu no celular
     --------------------------------------------------------------------- */
  (function menu() {
    const btn = $('hamburguer'), nav = document.querySelector('.nav');
    if (!btn) return;
    const fechar = () => { nav.classList.remove('aberto'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const aberto = nav.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', String(aberto));
    });
    $('menu').addEventListener('click', (e) => { if (e.target.tagName === 'A') fechar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
  })();

  /* ---------------------------------------------------------------------
     6. Medição — só liga se houver um código em conteudo.js; sem cookies
     --------------------------------------------------------------------- */
  (function medicao() {
    const m = C.medicao || {};
    if (m.umami) {
      const s = el('script'); s.defer = true;
      s.src = 'https://cloud.umami.is/script.js'; s.dataset.websiteId = m.umami;
      document.head.append(s);
    }
    if (m.cloudflare) {
      const s = el('script'); s.defer = true;
      s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      s.dataset.cfBeacon = JSON.stringify({ token: m.cloudflare });
      document.head.append(s);
    }
    // registra um clique com nome legível; não faz nada se a medição estiver desligada
    const medir = (nome, dados) => { try { window.umami && window.umami.track(nome, dados); } catch (e) {} };
    const texto = (raiz, sel) => { const x = raiz && raiz.querySelector(sel); return x ? x.textContent.trim() : ''; };
    document.addEventListener('click', (ev) => {
      const t = ev.target.closest('button, a'); if (!t) return;
      if (t.id === 'entrar') return medir('abertura: entrou com som');
      if (t.id === 'sem-som') return medir('abertura: entrou sem som');
      if (t.id === 'pular') return medir('abertura: pulou');
      if (t.matches('.play')) return medir('filme: assistiu', { titulo: texto(t.closest('.filme'), 'h3') });
      if (t.matches('.obra')) return medir('galeria: abriu', { titulo: texto(t, 'strong') });
      if (t.matches('.ensaio')) return medir('ensaio: abriu', { titulo: texto(t, 'strong') });
      if (t.matches('.livro')) return medir('livro: abriu', { titulo: texto(t, '.t') });
      if (t.matches('.ler[href]')) return medir('livro: foi ler', { titulo: texto(document, '#ficha-titulo') });
      if (t.matches('.escolher')) return medir('duelo: votou', { em: texto(t.closest('.lutador'), 'h3') });
      if (t.id === 'recomecar') return medir('duelo: jogou de novo');
      if (t.id === 'proxima' && /resultado/i.test(t.textContent)) return medir('duelo: terminou');
      if (t.matches('#menu a')) return medir('menu: ' + t.textContent.trim());
      if (t.matches('.contato-email')) return medir('contato: clicou no e-mail');
    });
    const form = $('boletim');
    if (form) form.addEventListener('submit', () => medir('newsletter: enviou'));
  })();

  // as seções novas também entram com a revelação ao rolar
  if (window.IntersectionObserver) {
    const obs = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
    }), { threshold: 0.1 });
    document.querySelectorAll('.cinema .revela, .galeria .revela, .ideias .revela').forEach((x) => obs.observe(x));
  }
})();
