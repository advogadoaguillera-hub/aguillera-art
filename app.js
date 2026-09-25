/* ==========================================================================
   Aguillera · Arte & Direito — comportamento da página
   Para trocar textos, edite só os blocos de DADOS abaixo.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   DADOS · Citações (traduções livres de obras em domínio público)
   --------------------------------------------------------------------------- */
const CITACOES = [
  { t: 'Justiça é a vontade constante e perpétua de dar a cada um o que é seu.', a: 'Ulpiano', o: 'Digesto de Justiniano, 533' },
  { t: 'A vida sem exame não vale a pena ser vivida.', a: 'Sócrates', o: 'Platão, Apologia de Sócrates' },
  { t: 'É uma experiência eterna: todo homem que tem poder é levado a abusar dele, e vai até onde encontra limites.', a: 'Montesquieu', o: 'O Espírito das Leis, 1748' },
  { t: 'Assim como o homem, quando perfeito, é o melhor dos animais, separado da lei e da justiça é o pior de todos.', a: 'Aristóteles', o: 'Política, livro I' },
  { t: 'Não pensei que teus decretos tivessem tanta força a ponto de um mortal atropelar as leis não escritas e imutáveis.', a: 'Antígona', o: 'Sófocles, Antígona, 441 a.C.' },
  { t: 'Um dos maiores freios dos delitos não é a crueldade das penas, mas a sua infalibilidade.', a: 'Cesare Beccaria', o: 'Dos Delitos e das Penas, 1764' },
  { t: 'O homem nasceu livre, e por toda parte está a ferros.', a: 'Jean-Jacques Rousseau', o: 'Do Contrato Social, 1762' },
  { t: 'A clemência não se impõe à força: cai como a chuva mansa do céu sobre a terra.', a: 'Pórcia', o: 'Shakespeare, O Mercador de Veneza' },
  { t: 'A regra da igualdade não consiste senão em quinhoar desigualmente aos desiguais, na medida em que se desigualam.', a: 'Rui Barbosa', o: 'Oração aos Moços, 1921' },
  { t: 'Justiça atrasada não é justiça, senão injustiça qualificada e manifesta.', a: 'Rui Barbosa', o: 'Oração aos Moços, 1921' },
  { t: 'Salus populi suprema lex esto — que o bem do povo seja a lei suprema.', a: 'Cícero', o: 'Das Leis, livro III' },
];

/* ---------------------------------------------------------------------------
   DADOS · Duelo. "vence" indica o lado que a Constituição de 1988 adotou.
   Os argumentos são sínteses do pensamento de cada figura, não citações.
   --------------------------------------------------------------------------- */
const RODADAS = [
  {
    q: 'A justiça é só o interesse do mais forte?',
    a: { nome: 'Trasímaco', papel: 'Sofista · A República, livro I', ini: 'TR', arg: 'As leis são feitas por quem manda, para servir a quem manda. Chamar isso de “justiça” é só boa educação.' },
    b: { nome: 'Sócrates', papel: 'Filósofo · Atenas', ini: 'SÓ', arg: 'O bom governante, como o bom médico, não busca o próprio proveito, mas o de quem está sob seus cuidados.' },
    vence: 'b',
    veredito: 'A Constituição fica com Sócrates: todo o poder emana do povo, e todos são iguais perante a lei — inclusive quem governa.',
    base: 'CF/88, art. 1º, parágrafo único, e art. 5º, caput.',
  },
  {
    q: 'Existe alguma lei acima da lei?',
    a: { nome: 'Creonte', papel: 'Rei de Tebas · Antígona', ini: 'CR', arg: 'O decreto do rei é a lei. Quem desobedece, ainda que por piedade, abre a porta para a anarquia.' },
    b: { nome: 'Antígona', papel: 'Princesa de Tebas · Sófocles', ini: 'AN', arg: 'Há leis não escritas, mais antigas do que qualquer rei. Enterrar meu irmão é obedecer a elas.' },
    vence: 'b',
    veredito: 'A Constituição fica com Antígona: a dignidade humana é fundamento da República, ninguém perde direitos por crença ou convicção, e há direitos que nem emenda constitucional pode abolir.',
    base: 'CF/88, art. 1º, III; art. 5º, VIII; art. 60, § 4º, IV.',
  },
  {
    q: 'Pena mais cruel diminui o crime?',
    a: { nome: 'Lei de Talião', papel: 'Código de Hamurabi · c. 1754 a.C.', ini: 'TA', arg: 'Olho por olho, dente por dente. O castigo deve doer tanto quanto o crime e servir de exemplo a todos.' },
    b: { nome: 'Cesare Beccaria', papel: 'Jurista · Milão, 1764', ini: 'BE', arg: 'O que freia o crime é a certeza da punição, não a crueldade. Pena desproporcional é só outra violência.' },
    vence: 'b',
    veredito: 'A Constituição fica com Beccaria: a pena é individualizada e são proibidas as penas de morte (salvo guerra declarada), perpétuas, de trabalhos forçados, de banimento e cruéis.',
    base: 'CF/88, art. 5º, XLVI e XLVII.',
  },
  {
    q: 'Uma só pessoa pode concentrar todo o poder?',
    a: { nome: 'Luís XIV', papel: 'Rei da França · “O Estado sou eu” (frase atribuída)', ini: 'LX', arg: 'Um rei que faz a lei, a executa e a julga governa sem ruído. Dividir o poder é dividir a força.' },
    b: { nome: 'Montesquieu', papel: 'Filósofo · O Espírito das Leis', ini: 'MO', arg: 'Tudo estaria perdido se o mesmo homem exercesse os três poderes: fazer as leis, executá-las e julgar.' },
    vence: 'b',
    veredito: 'A Constituição fica com Montesquieu: Legislativo, Executivo e Judiciário são independentes e harmônicos — e essa separação é cláusula pétrea.',
    base: 'CF/88, art. 2º, e art. 60, § 4º, III.',
  },
  {
    q: 'Contrato assinado deve ser cumprido a qualquer custo?',
    a: { nome: 'Shylock', papel: 'Credor · O Mercador de Veneza', ini: 'SH', arg: 'Está assinado: uma libra de carne. A lei de Veneza garante o que foi pactuado, e eu exijo o que é meu.' },
    b: { nome: 'Pórcia', papel: 'Advogada disfarçada · Shakespeare', ini: 'PÓ', arg: 'O contrato dá a carne, mas nenhuma gota de sangue. A letra do pacto não pode virar instrumento de crueldade.' },
    vence: 'b',
    veredito: 'O Direito brasileiro fica com Pórcia: o contrato obriga, mas deve respeitar a função social e a boa-fé, e o juiz reduz a multa manifestamente excessiva. A dignidade humana nunca é objeto de contrato.',
    base: 'Código Civil, arts. 413, 421 e 422; CF/88, art. 1º, III.',
  },
];

/* ---------------------------------------------------------------------------
   DADOS · Biblioteca
   --------------------------------------------------------------------------- */
const GUT = (q) => 'https://www.gutenberg.org/ebooks/search/?query=' + encodeURIComponent(q);
const WS = (q) => 'https://pt.wikisource.org/w/index.php?search=' + encodeURIComponent(q);

const LIVROS = [
  { t: 'O Espírito das Leis', a: 'Montesquieu', ano: '1748', cat: 'filosofia', ic: '🏛️', capa: 'linear-gradient(150deg,#ff3d8b,#7b5cff)',
    ideia: 'As leis não caem do céu: nascem do clima, dos costumes, da economia e da forma de governo de cada povo. E a liberdade só existe quando o poder freia o poder.',
    hoje: 'É a certidão de nascimento da separação dos poderes — hoje cláusula pétrea da Constituição brasileira (art. 60, § 4º, III).',
    frase: '“Para que não se possa abusar do poder, é preciso que o poder freie o poder.”', link: GUT('Montesquieu') },
  { t: 'A República', a: 'Platão', ano: 'c. 375 a.C.', cat: 'filosofia', ic: '🌗', capa: 'linear-gradient(150deg,#7b5cff,#22d3ee)',
    ideia: 'O que é justiça? Sócrates enfrenta Trasímaco e constrói uma cidade ideal. Aqui está a alegoria da caverna: a maioria confunde sombras com a realidade.',
    hoje: 'Todo debate sobre o fundamento das leis — força ou razão? — ainda começa neste diálogo.',
    frase: '“A justiça é a virtude da alma; a injustiça, o seu vício.”', link: GUT('Plato Republic') },
  { t: 'As Leis', a: 'Platão', ano: 'c. 348 a.C.', cat: 'filosofia', ic: '📜', capa: 'linear-gradient(150deg,#22d3ee,#a3e635)',
    ideia: 'O último e mais longo diálogo de Platão. Menos utopia, mais realismo: como escrever leis para gente de verdade. Inventa o “preâmbulo”, que explica a lei antes de mandar.',
    hoje: 'Os preâmbulos das constituições modernas — inclusive o da nossa — são herdeiros diretos desta ideia.',
    frase: '“Onde a lei é senhora dos governantes, vejo salvação.”', link: GUT('Plato Laws') },
  { t: 'Apologia de Sócrates', a: 'Platão', ano: '399 a.C.', cat: 'filosofia', ic: '🏺', capa: 'linear-gradient(150deg,#ffb020,#ff6b4a)',
    ideia: 'A defesa de Sócrates diante de 501 jurados atenienses. Acusado de corromper a juventude, ele não pede clemência: pede o direito de continuar perguntando.',
    hoje: 'O primeiro grande julgamento da história do pensamento — e um alerta permanente sobre o tribunal que condena por medo das ideias.',
    frase: '“A vida sem exame não vale a pena ser vivida.”', link: GUT('Plato Apology') },
  { t: 'Ética a Nicômaco', a: 'Aristóteles', ano: 'séc. IV a.C.', cat: 'filosofia', ic: '⚖️', capa: 'linear-gradient(150deg,#a3e635,#22d3ee)',
    ideia: 'O livro V separa a justiça que distribui (dar a cada um segundo o mérito) da que corrige (reparar o dano). E cria a equidade: corrigir a lei quando, por ser geral, ela falha no caso concreto.',
    hoje: 'Responsabilidade civil, indenização e o juiz que decide por equidade (CPC, art. 140, parágrafo único) vêm daqui.',
    frase: '“O equitativo é justo, e melhor do que um certo tipo de justo.”', link: GUT('Aristotle Ethics') },
  { t: 'Antígona', a: 'Sófocles', ano: '441 a.C.', cat: 'literatura', ic: '🌿', capa: 'linear-gradient(150deg,#ff6b4a,#ff3d8b)',
    ideia: 'O rei proíbe o enterro de um traidor. A irmã dele desobedece em nome de leis mais antigas que o rei. Os dois têm razão — e é por isso que é tragédia.',
    hoje: 'A peça fundadora do debate entre direito natural e direito positivo, e da desobediência civil.',
    frase: '“Não nasci para compartilhar o ódio, mas o amor.”', link: GUT('Sophocles Antigone') },
  { t: 'Dos Delitos e das Penas', a: 'Cesare Beccaria', ano: '1764', cat: 'filosofia', ic: '⛓️', capa: 'linear-gradient(150deg,#1f1a4d,#ff3d8b)',
    ideia: 'Um jovem de 26 anos ataca a tortura, a pena de morte e os processos secretos. Pena deve ser proporcional, prevista em lei e certa — não cruel.',
    hoje: 'Legalidade penal, presunção de inocência e proibição de penas cruéis (CF, art. 5º, XXXIX, LVII e XLVII) saíram destas páginas.',
    frase: '“É melhor prevenir os crimes do que ter de puni-los.”', link: GUT('Beccaria crimes punishments') },
  { t: 'Leviatã', a: 'Thomas Hobbes', ano: '1651', cat: 'filosofia', ic: '🐉', capa: 'linear-gradient(150deg,#0f766e,#7b5cff)',
    ideia: 'Sem Estado, a vida seria “solitária, pobre, sórdida, brutal e curta”. Por medo, entregamos a força a um soberano que nos garanta a paz.',
    hoje: 'O monopólio estatal da força — e a proibição de fazer justiça com as próprias mãos (Código Penal, art. 345) — é Hobbes puro.',
    frase: '“Pactos sem a espada não passam de palavras.”', link: GUT('Hobbes Leviathan') },
  { t: 'Segundo Tratado sobre o Governo', a: 'John Locke', ano: '1689', cat: 'filosofia', ic: '🗝️', capa: 'linear-gradient(150deg,#ffb020,#a3e635)',
    ideia: 'Vida, liberdade e propriedade existem antes do Estado. O governo só é legítimo se as protege — e o povo pode resistir ao que as viola.',
    hoje: 'Direitos fundamentais oponíveis ao próprio Estado: o coração do art. 5º da Constituição.',
    frase: '“Onde não há lei, não há liberdade.”', link: GUT('Locke Two Treatises Government') },
  { t: 'Do Contrato Social', a: 'Jean-Jacques Rousseau', ano: '1762', cat: 'filosofia', ic: '🤝', capa: 'linear-gradient(150deg,#22d3ee,#ff3d8b)',
    ideia: 'O poder legítimo nasce de um pacto entre iguais, e a lei é a expressão da vontade geral — não do capricho de um rei.',
    hoje: '“Todo o poder emana do povo” (CF, art. 1º, parágrafo único) é Rousseau escrito em linguagem constitucional.',
    frase: '“O homem nasceu livre, e por toda parte está a ferros.”', link: GUT('Rousseau Social Contract') },
  { t: 'O Mercador de Veneza', a: 'William Shakespeare', ano: 'c. 1598', cat: 'literatura', ic: '🎭', capa: 'linear-gradient(150deg,#ff3d8b,#ffb020)',
    ideia: 'Um empréstimo garantido por uma libra de carne humana. No tribunal, Pórcia vence pela interpretação literal: carne sim, sangue não.',
    hoje: 'Aula eterna sobre interpretação de contratos, boa-fé e os limites do que pode ser pactuado.',
    frase: '“A clemência não se impõe à força.”', link: GUT('Merchant of Venice') },
  { t: 'O Processo', a: 'Franz Kafka', ano: '1925', cat: 'literatura', ic: '🚪', capa: 'linear-gradient(150deg,#27272a,#7b5cff)',
    ideia: 'Josef K. é preso numa manhã sem saber do quê, e nunca descobre. O tribunal está em toda parte e em lugar nenhum.',
    hoje: 'O retrato do que o devido processo legal existe para impedir: acusação sem fato, defesa sem acesso aos autos.',
    frase: '“Alguém devia ter caluniado Josef K., pois ele foi preso sem ter feito nada de mal.”', link: GUT('Kafka Trial') },
  { t: 'Crime e Castigo', a: 'Fiódor Dostoiévski', ano: '1866', cat: 'literatura', ic: '🕯️', capa: 'linear-gradient(150deg,#b91c1c,#1f1a4d)',
    ideia: 'Um estudante mata para provar que homens extraordinários estão acima da moral. O castigo real não vem do tribunal, vem de dentro.',
    hoje: 'Culpa, confissão e a psicologia do investigador Porfiri inspiram até hoje o estudo do interrogatório.',
    frase: '“A dor e o sofrimento são sempre inevitáveis para uma inteligência ampla e um coração profundo.”', link: GUT('Crime and Punishment') },
  { t: 'Oração aos Moços', a: 'Rui Barbosa', ano: '1921', cat: 'brasil', ic: '🎓', capa: 'linear-gradient(150deg,#15803d,#ffb020)',
    ideia: 'Discurso de paraninfo aos formandos de Direito do Largo de São Francisco. Um manual de ética para juízes e advogados.',
    hoje: 'A fórmula de igualdade material de Rui — tratar desigualmente os desiguais — é citada pelo STF até hoje.',
    frase: '“Justiça atrasada não é justiça, senão injustiça qualificada e manifesta.”', link: WS('Oração aos Moços') },
  { t: 'O Alienista', a: 'Machado de Assis', ano: '1882', cat: 'brasil literatura', ic: '🧠', capa: 'linear-gradient(150deg,#0e7490,#a3e635)',
    ideia: 'Em Itaguaí, o médico Simão Bacamarte interna meia cidade na Casa Verde em nome da ciência. Até que a régua vira contra ele.',
    hoje: 'Uma sátira afiada sobre o poder sem controle e a privação de liberdade sem devido processo.',
    frase: '“A loucura, objeto dos meus estudos, era até agora uma ilha perdida no oceano da razão.”', link: WS('O Alienista') },
  { t: 'O Navio Negreiro', a: 'Castro Alves', ano: '1869', cat: 'brasil literatura', ic: '⛵', capa: 'linear-gradient(150deg,#1d4ed8,#ff6b4a)',
    ideia: 'O poeta abolicionista leva o leitor ao porão de um navio negreiro e pergunta a Deus onde está a justiça.',
    hoje: 'A arte como tribunal da história: o poema ajudou a formar a consciência que levou à Lei Áurea.',
    frase: '“Senhor Deus dos desgraçados! Dizei-me vós, Senhor Deus!”', link: WS('O Navio Negreiro') },
];

/* ---------------------------------------------------------------------------
   DADOS · Linha do tempo
   --------------------------------------------------------------------------- */
const MARCOS = [
  ['c. 1754 a.C.', 'Código de Hamurabi', 'A lei sai da boca do rei e vai para a pedra, onde todos podem ler.', 'var(--ouro)'],
  ['450 a.C.', 'Lei das XII Tábuas', 'Roma expõe suas leis no Fórum: acabou o segredo dos sacerdotes.', 'var(--coral)'],
  ['399 a.C.', 'Julgamento de Sócrates', 'Atenas condena um filósofo por fazer perguntas.', 'var(--magenta)'],
  ['533', 'Digesto de Justiniano', 'Mil anos de sabedoria jurídica romana organizados num só código.', 'var(--violeta)'],
  ['1215', 'Magna Carta', 'Os barões ingleses impõem ao rei: nem ele está acima da lei.', 'var(--ciano)'],
  ['1748', 'O Espírito das Leis', 'Montesquieu desenha os três poderes.', 'var(--lima)'],
  ['1789', 'Declaração dos Direitos do Homem', 'A Revolução Francesa proclama direitos para todos os cidadãos.', 'var(--ouro)'],
  ['1948', 'Declaração Universal', 'Depois da guerra, a dignidade humana vira linguagem de todo o planeta.', 'var(--magenta)'],
  ['1988', 'Constituição Cidadã', 'O Brasil põe os direitos fundamentais antes da organização do Estado.', 'var(--ciano)'],
];

/* ==========================================================================
   0. Assinatura áurea — a espiral de Fibonacci
   r = r0 · φ^(θ / 90°): a cada quarto de volta o raio cresce 1,618 vezes.
   ========================================================================== */
const PHI = (1 + Math.sqrt(5)) / 2;
function caminhoEspiral(voltas, raioFinal) {
  const thetaMax = voltas * 2 * Math.PI;
  const r0 = raioFinal / Math.pow(PHI, thetaMax / (Math.PI / 2));
  const pontos = [];
  for (let t = 0; t <= thetaMax; t += Math.PI / 36) {
    const r = r0 * Math.pow(PHI, t / (Math.PI / 2));
    pontos.push(`${(r * Math.cos(t)).toFixed(2)},${(r * Math.sin(t)).toFixed(2)}`);
  }
  return 'M' + pontos.join(' L');
}
(function espiral() {
  const NS = 'http://www.w3.org/2000/svg';
  const grande = document.getElementById('espiral');
  if (grande) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', caminhoEspiral(3.25, 480));
    grande.append(p);
  }
  document.querySelectorAll('.sobretitulo').forEach((el) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '-11 -11 22 22'); s.setAttribute('class', 'glifo'); s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', caminhoEspiral(1.75, 9.5));
    s.append(p); el.prepend(s);
  });
})();

/* ==========================================================================
   1. Céu estrelado
   ========================================================================== */
(function ceu() {
  const cv = document.getElementById('estrelas');
  const c = cv.getContext('2d');
  let estrelas = [];
  function medir() {
    const r = window.devicePixelRatio || 1;
    cv.width = cv.clientWidth * r; cv.height = cv.clientHeight * r;
    c.setTransform(r, 0, 0, r, 0, 0);
    const n = Math.round((cv.clientWidth * cv.clientHeight) / 2600);
    estrelas = Array.from({ length: n }, () => ({
      x: Math.random() * cv.clientWidth, y: Math.random() * cv.clientHeight * 0.8,
      r: Math.random() * 1.3 + 0.2, f: Math.random() * Math.PI * 2, v: 0.5 + Math.random() * 1.5,
      cor: Math.random() < 0.12 ? (Math.random() < 0.5 ? '#ffd9a8' : '#b8f3ff') : '#ffffff',
    }));
  }
  function quadro(t) {
    c.clearRect(0, 0, cv.clientWidth, cv.clientHeight);
    for (const e of estrelas) {
      c.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(e.f + (t / 1000) * e.v * 0.6));
      c.fillStyle = e.cor;
      c.beginPath(); c.arc(e.x, e.y, e.r, 0, Math.PI * 2); c.fill();
    }
    requestAnimationFrame(quadro);
  }
  medir(); addEventListener('resize', medir); requestAnimationFrame(quadro);
})();

/* ==========================================================================
   2. Abertura
   ========================================================================== */
(function abertura() {
  const corpo = document.body, cena = document.getElementById('topo');
  const portao = document.getElementById('portao'), pular = document.getElementById('pular');
  const flash = document.getElementById('flash'), som = document.getElementById('botao-som');
  let tocando = false, mudo = false, fimTimer;

  function bater() {
    flash.classList.remove('bate'); void flash.offsetWidth; flash.classList.add('bate');
  }
  function liberar() {
    corpo.classList.remove('travado'); pular.classList.remove('ativo');
  }
  function terminar() {
    tocando = false; som.textContent = '▶ Abertura'; som.setAttribute('aria-pressed', 'false');
  }

  document.getElementById('entrar').addEventListener('click', () => {
    portao.classList.add('some');
    cena.classList.add('tocando');
    pular.classList.add('ativo');
    const dur = Abertura.tocar(bater);
    tocando = true; som.textContent = '🔊 Som'; som.setAttribute('aria-pressed', 'true');
    fimTimer = setTimeout(() => { liberar(); terminar(); }, dur * 1000);
  });
  document.getElementById('sem-som').addEventListener('click', () => {
    portao.classList.add('some'); cena.classList.add('fim'); liberar(); terminar();
  });
  pular.addEventListener('click', () => {
    clearTimeout(fimTimer); Abertura.parar(); cena.classList.add('fim'); liberar(); terminar();
  });
  som.addEventListener('click', () => {
    if (tocando) {
      mudo = !mudo; Abertura.silenciar(mudo);
      som.textContent = mudo ? '🔇 Mudo' : '🔊 Som';
      return;
    }
    // fora da abertura: toca a música de novo
    mudo = false; tocando = true; som.textContent = '🔊 Som'; som.setAttribute('aria-pressed', 'true');
    const dur = Abertura.tocar(bater);
    setTimeout(terminar, dur * 1000);
  });
})();

/* ==========================================================================
   3. Citações
   ========================================================================== */
(function citacoes() {
  const caixa = document.getElementById('carrossel'), pontos = document.getElementById('cit-pontos');
  let i = 0, timer;
  CITACOES.forEach((c, k) => {
    const f = document.createElement('figure');
    f.className = 'citacao';
    f.innerHTML = `<blockquote></blockquote><figcaption><strong></strong></figcaption>`;
    f.querySelector('blockquote').textContent = c.t;
    f.querySelector('strong').textContent = c.a;
    f.querySelector('figcaption').append(c.o);
    caixa.append(f);
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Citação ${k + 1}`);
    b.addEventListener('click', () => ir(k));
    pontos.append(b);
  });
  function ir(k) {
    i = (k + CITACOES.length) % CITACOES.length;
    caixa.querySelectorAll('.citacao').forEach((f, n) => f.classList.toggle('ativa', n === i));
    pontos.querySelectorAll('button').forEach((b, n) => b.classList.toggle('ativo', n === i));
    clearInterval(timer); timer = setInterval(() => ir(i + 1), 8000);
  }
  document.getElementById('cit-ant').addEventListener('click', () => ir(i - 1));
  document.getElementById('cit-prox').addEventListener('click', () => ir(i + 1));
  caixa.addEventListener('mouseenter', () => clearInterval(timer));
  caixa.addEventListener('mouseleave', () => ir(i));
  ir(0);
})();

/* ==========================================================================
   4. Duelo jurídico
   ========================================================================== */
(function duelo() {
  const $ = (id) => document.getElementById(id);
  const lutA = $('lut-a'), lutB = $('lut-b'), botoes = document.querySelectorAll('.escolher');
  let r = 0, acertos = 0, atual;

  function montar() {
    const d = RODADAS[r];
    // sorteia o lado de cada lutador, para que a resposta não fique sempre no mesmo lugar
    const inverte = Math.random() < 0.5;
    atual = { ...d, a: inverte ? d.b : d.a, b: inverte ? d.a : d.b, vence: inverte ? (d.vence === 'a' ? 'b' : 'a') : d.vence };
    $('rodada-num').textContent = `RODADA ${r + 1} / ${RODADAS.length}`;
    $('questao').textContent = atual.q;
    ['a', 'b'].forEach((l) => {
      const p = atual[l];
      $('nome-' + l).textContent = p.nome; $('papel-' + l).textContent = p.papel;
      $('av-' + l).textContent = p.ini; $('arg-' + l).textContent = p.arg;
      $('vida-' + l).style.width = '100%';
    });
    [lutA, lutB].forEach((el) => el.classList.remove('ataca', 'golpeado', 'perdeu', 'venceu'));
    botoes.forEach((b) => (b.disabled = false));
    $('veredito').classList.remove('mostra');
  }

  botoes.forEach((b) => b.addEventListener('click', () => {
    const lado = b.dataset.lado, outro = lado === 'a' ? 'b' : 'a';
    const vencedor = lado === 'a' ? lutA : lutB, vencido = lado === 'a' ? lutB : lutA;
    botoes.forEach((x) => (x.disabled = true));
    vencedor.classList.add('ataca');
    setTimeout(() => { vencido.classList.add('golpeado'); $('vida-' + outro).style.width = '35%'; }, 250);
    setTimeout(() => { vencedor.classList.remove('ataca'); vencedor.classList.add('ataca'); }, 700);
    setTimeout(() => { $('vida-' + outro).style.width = '0%'; vencido.classList.add('perdeu'); vencedor.classList.add('venceu'); }, 1000);

    const concordou = lado === atual.vence;
    if (concordou) acertos++;
    $('acertos').textContent = acertos;
    setTimeout(() => {
      $('veredito-texto').textContent = (concordou ? '✅ Você votou com a Constituição. ' : '❌ Aqui a Constituição votou diferente. ') + atual.veredito;
      $('veredito-base').textContent = 'Fundamento: ' + atual.base;
      $('proxima').textContent = r + 1 < RODADAS.length ? 'Próxima rodada →' : 'Ver meu resultado →';
      $('veredito').classList.add('mostra');
    }, 1300);
  }));

  $('proxima').addEventListener('click', () => {
    r++;
    if (r < RODADAS.length) { montar(); $('arena').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const titulos = [
      ['Sofista convicto', 'Trasímaco ficaria orgulhoso. A Constituição, nem tanto. Que tal uma revanche?'],
      ['Estudante de Atenas', 'Você está na porta da Academia. Mais uma leitura de Montesquieu e entra.'],
      ['Estudante de Atenas', 'Você está na porta da Academia. Mais uma leitura de Montesquieu e entra.'],
      ['Jurista do Olimpo', 'Quase unânime. Você pensa como quem escreveu a Constituição de 1988.'],
      ['Jurista do Olimpo', 'Quase unânime. Você pensa como quem escreveu a Constituição de 1988.'],
      ['Guardião da Constituição', 'Cinco votos, cinco acertos. Rui Barbosa assinaria embaixo.'],
    ];
    const [t, txt] = titulos[acertos];
    $('final-titulo').textContent = `${acertos} de ${RODADAS.length} · ${t}`;
    $('final-texto').textContent = txt;
    $('jogo').hidden = true; $('final').classList.add('mostra');
  });

  $('recomecar').addEventListener('click', () => {
    r = 0; acertos = 0; $('acertos').textContent = 0;
    $('final').classList.remove('mostra'); $('jogo').hidden = false; montar();
  });

  montar();
})();

/* ==========================================================================
   5. Biblioteca
   ========================================================================== */
(function biblioteca() {
  const estante = document.getElementById('estante'), ficha = document.getElementById('ficha');
  LIVROS.forEach((l) => {
    const b = document.createElement('button');
    b.className = 'livro'; b.dataset.cat = l.cat; b.style.setProperty('--capa', l.capa);
    b.innerHTML = `<span class="miolo"><span class="ano"></span><span class="icone" aria-hidden="true"></span><span class="t"></span><span class="a"></span></span>`;
    b.querySelector('.ano').textContent = l.ano;
    b.querySelector('.icone').textContent = l.ic;
    b.querySelector('.t').textContent = l.t;
    b.querySelector('.a').textContent = l.a;
    b.addEventListener('click', () => abrir(l));
    estante.append(b);
  });
  function abrir(l) {
    document.getElementById('ficha-topo').style.setProperty('--capa', l.capa);
    document.getElementById('ficha-titulo').textContent = l.t;
    document.getElementById('ficha-autor').textContent = `${l.a} · ${l.ano}`;
    document.getElementById('ficha-ideia').textContent = l.ideia;
    document.getElementById('ficha-hoje').textContent = l.hoje;
    document.getElementById('ficha-frase').textContent = l.frase;
    document.getElementById('ficha-ler').href = l.link;
    ficha.showModal();
  }
  document.getElementById('ficha-fechar').addEventListener('click', () => ficha.close());
  ficha.addEventListener('click', (e) => { if (e.target === ficha) ficha.close(); });

  document.getElementById('filtros').addEventListener('click', (e) => {
    const f = e.target.dataset.f; if (!f) return;
    document.querySelectorAll('#filtros button').forEach((b) => b.classList.toggle('ativo', b === e.target));
    estante.querySelectorAll('.livro').forEach((b) => {
      b.hidden = !(f === 'todos' || b.dataset.cat.split(' ').includes(f));
    });
  });
})();

/* ==========================================================================
   6. Linha do tempo, revelação ao rolar, ano
   ========================================================================== */
(function resto() {
  const trilho = document.getElementById('trilho');
  MARCOS.forEach(([ano, nome, txt, cor]) => {
    const d = document.createElement('div');
    d.className = 'marco'; d.style.setProperty('--cor', cor);
    d.innerHTML = '<b></b><span></span><p></p>';
    d.querySelector('b').textContent = ano;
    d.querySelector('span').textContent = nome;
    d.querySelector('p').textContent = txt;
    trilho.append(d);
  });

  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.revela').forEach((el) => obs.observe(el));

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
