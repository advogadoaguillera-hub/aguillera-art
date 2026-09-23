/* ==========================================================================
   Abertura musical — "Assim falou Zaratustra", op. 30 (Richard Strauss, 1896)
   --------------------------------------------------------------------------
   A composição está em domínio público no Brasil desde 1º/1/2020 (Strauss
   morreu em 1949; Lei 9.610/98, art. 41). Gravações de orquestras, porém,
   têm direitos próprios. Por isso a música NÃO é um arquivo gravado: ela é
   tocada ao vivo pelo navegador, sintetizada nota a nota (Web Audio API).
   A interpretação é nossa; nenhuma gravação de terceiros é usada.
   ========================================================================== */

window.Abertura = (function () {
  let ctx, mestre, reverb, seco;

  const HZ = (n) => 440 * Math.pow(2, (n - 69) / 12); // nota MIDI → Hz
  // notas MIDI
  const C1 = 24, C2 = 36, G2 = 43, C3 = 48, E3 = 52, Eb3 = 51, G3 = 55,
        C4 = 60, E4 = 64, Eb4 = 63, G4 = 67, A4 = 69, B4 = 71, C5 = 72, E5 = 76, G5 = 79, D5 = 74, F4 = 65, F3 = 53, A3 = 57;

  function impulso(seg, decai) {
    const taxa = ctx.sampleRate, n = taxa * seg;
    const buf = ctx.createBuffer(2, n, taxa);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decai);
    }
    return buf;
  }

  function montar() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    mestre = ctx.createGain(); mestre.gain.value = 0.9;
    mestre.connect(comp); comp.connect(ctx.destination);

    reverb = ctx.createConvolver(); reverb.buffer = impulso(4.5, 2.6);
    const molhado = ctx.createGain(); molhado.gain.value = 0.55;
    reverb.connect(molhado); molhado.connect(mestre);
    seco = ctx.createGain(); seco.gain.value = 0.6; seco.connect(mestre);
  }

  function saida(g) { g.connect(seco); g.connect(reverb); }

  /* Metais: três dentes-de-serra levemente desafinadas + filtro que "abre" */
  function metal(nota, t, dur, vol = 0.18) {
    const f = HZ(nota);
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass'; filtro.Q.value = 1.2;
    filtro.frequency.setValueAtTime(f * 1.5, t);
    filtro.frequency.linearRampToValueAtTime(f * 7, t + 0.25);
    filtro.frequency.linearRampToValueAtTime(f * 4.5, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.07);
    g.gain.setValueAtTime(vol * 0.85, t + 0.3);
    g.gain.linearRampToValueAtTime(vol, t + dur - 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.45);
    filtro.connect(g); saida(g);

    const vib = ctx.createOscillator(); vib.frequency.value = 5.2;
    const vibG = ctx.createGain(); vibG.gain.value = f * 0.004;
    vib.connect(vibG);
    [-6, 0, 6].forEach((cents) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = cents;
      vibG.connect(o.frequency);
      o.connect(filtro); o.start(t); o.stop(t + dur + 0.5);
    });
    vib.start(t); vib.stop(t + dur + 0.5);
  }

  /* Órgão: senos em oitavas, entrando devagar */
  function orgao(notas, t, dur, vol = 0.07) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(3, dur / 3));
    g.gain.setValueAtTime(vol, t + dur - 1.5);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    saida(g);
    notas.forEach((n) => {
      [1, 2, 3].forEach((h, i) => {
        const o = ctx.createOscillator();
        o.type = 'sine'; o.frequency.value = HZ(n) * h;
        const gh = ctx.createGain(); gh.gain.value = [1, 0.35, 0.12][i];
        o.connect(gh); gh.connect(g); o.start(t); o.stop(t + dur + 0.1);
      });
    });
  }

  /* Tímpano: seno grave com queda de altura + ruído abafado */
  let ruido;
  function timpano(nota, t, vol = 0.5) {
    const f = HZ(nota);
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f * 1.06, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.12);
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(vol * 0.3, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g); o2.connect(g2); saida(g); saida(g2);
    o.start(t); o.stop(t + 1.2); o2.start(t); o2.stop(t + 0.6);

    if (!ruido) {
      ruido = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = ruido.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const r = ctx.createBufferSource(); r.buffer = ruido;
    const rf = ctx.createBiquadFilter(); rf.type = 'lowpass'; rf.frequency.value = 900;
    const rg = ctx.createGain(); rg.gain.setValueAtTime(vol * 0.5, t); rg.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    r.connect(rf); rf.connect(rg); saida(rg); r.start(t);
  }

  /* Acorde da orquestra (metais + cordas graves) */
  function acorde(notas, t, dur, vol = 0.1) {
    notas.forEach((n) => metal(n, t, dur, vol));
  }

  /* Uma "frase" do nascer do sol: dó – sol – dó, e o acorde que responde */
  function frase(t, maiorPrimeiro) {
    metal(C4, t, 1.45, 0.2);
    metal(C3, t, 1.45, 0.08);
    metal(G4, t + 1.6, 1.45, 0.2);
    metal(G3, t + 1.6, 1.45, 0.08);
    metal(C5, t + 3.2, 1.8, 0.22);
    metal(C4, t + 3.2, 1.8, 0.1);
    const maior = [C3, E3, G3, C4, E4, G4, C5, E5];
    const menor = [C3, Eb3, G3, C4, Eb4, G4, C5];
    const primeiro = maiorPrimeiro ? maior : menor, segundo = maiorPrimeiro ? menor : maior;
    acorde(primeiro, t + 5.2, 0.32, 0.055);
    acorde(segundo, t + 5.55, 1.3, 0.055);
    return t + 5.2; // instante do primeiro acorde
  }

  function tamborilar(t, vol) {
    // o famoso diálogo dos tímpanos: dó–sol–dó–sol...
    for (let i = 0; i < 9; i++) timpano(i % 2 ? C2 - 5 : C2, t + i * 0.27, vol * (0.55 + i * 0.05));
  }

  /* Partitura inteira. Devolve os instantes-chave (em segundos) para a cena. */
  function tocar(aoBater) {
    if (!ctx) montar();
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + 0.1;
    const marcas = [];
    const marca = (s) => marcas.push(s);

    orgao([C1, C2, G2], t0, 30, 0.08);             // o pedal grave de órgão, do início ao fim

    marca(frase(t0 + 2.5, true));                   // 1ª frase — maior → menor
    tamborilar(t0 + 9.3, 0.55);
    marca(frase(t0 + 12.2, false));                 // 2ª frase — menor → maior
    tamborilar(t0 + 19.0, 0.65);

    // 3ª frase: dó – sol – dó, e a subida para o climax
    const t3 = t0 + 21.6;
    metal(C4, t3, 1.2, 0.2); metal(C3, t3, 1.2, 0.08);
    metal(G4, t3 + 1.3, 1.2, 0.2);
    metal(C5, t3 + 2.6, 1.5, 0.22);
    acorde([F3, A3, C4, F4, A4, C5], t3 + 4.2, 0.9, 0.05);
    acorde([G3, B4, D5, G4], t3 + 5.1, 0.9, 0.05);
    const climax = t3 + 6.0;
    acorde([C3, G3, C4, E4, G4, C5, E5, G5], climax, 3.6, 0.06);
    orgao([C1, C2, G2, C3, E3, G3, C4], climax, 5.2, 0.1);
    timpano(C2, climax, 0.8);
    marca(climax);

    // repassa à cena os momentos de impacto, em milissegundos a partir de agora
    if (aoBater) {
      const agora = ctx.currentTime;
      marcas.forEach((s) => setTimeout(aoBater, (s - agora) * 1000));
    }
    return climax - t0 + 3.6;
  }

  function silenciar(sim) {
    if (!ctx) return;
    mestre.gain.cancelScheduledValues(ctx.currentTime);
    mestre.gain.linearRampToValueAtTime(sim ? 0 : 0.9, ctx.currentTime + 0.4);
  }

  function parar() {
    if (!ctx) return;
    silenciar(true);
    setTimeout(() => { ctx.close(); ctx = null; ruido = null; }, 600);
  }

  return { tocar, silenciar, parar };
})();
