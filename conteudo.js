/* ==========================================================================
   CONTEÚDO DO SITE — este é o único arquivo que você edita para postar.
   --------------------------------------------------------------------------
   Três listas: VÍDEOS, GALERIA e IDEIAS. Cada item fica entre chaves { }.
   Para postar, copie um item, cole no começo da lista e troque os textos.
   O primeiro da lista aparece primeiro no site.

   Regras simples:
   · Texto sempre entre aspas simples: 'assim'.
   · Se o texto tiver apóstrofo (ex.: d'água), use aspas duplas: "d'água".
   · Cada linha termina com vírgula.
   · Data no formato ano-mês-dia: '2026-09-25'.
   O GUIA-DE-USO.md explica tudo passo a passo, com figuras.
   ========================================================================== */

window.CONTEUDO = {

  /* ---------------------------------------------------------------------
     VÍDEOS · Cinema da Justiça
     ---------------------------------------------------------------------
     youtube : só o CÓDIGO do vídeo. Em youtube.com/watch?v=AbC123xyz
               o código é AbC123xyz. Deixe '' enquanto o vídeo não existir:
               o cartaz aparece como "em breve".
     titulo  : título curto.
     sinopse : uma ou duas frases, para quem nunca leu sobre Direito.
     data    : quando foi publicado.
     duracao : ex.: '4 min'. Pode deixar ''.
     ia      : true = mostra o selo "feito com IA". false = não mostra.
     --------------------------------------------------------------------- */
  videos: [
    {
      youtube: '',
      titulo: 'A origem da desigualdade',
      sinopse: 'Rousseau, em 1755, contou como nasceu a desigualdade entre os homens: no dia em que alguém cercou um pedaço de terra, disse "isto é meu" e encontrou gente simples o bastante para acreditar. Um filme sobre o que veio antes da lei — e sobre a lei que veio depois.',
      data: '2026-10-01',
      duracao: '5 min',
      ia: true,
    },
    {
      youtube: '',
      titulo: 'O Processo',
      sinopse: 'Josef K. é preso numa manhã sem saber do quê, e nunca descobre. Kafka escreveu em 1914 o retrato de tudo o que o devido processo legal existe para impedir: acusação sem fato, defesa sem acesso aos autos, um tribunal em toda parte e em lugar nenhum.',
      data: '2026-10-15',
      duracao: '5 min',
      ia: true,
    },
  ],

  /* ---------------------------------------------------------------------
     GALERIA · imagens e artes
     ---------------------------------------------------------------------
     arquivo : nome do arquivo dentro da pasta galeria/ (jpg, png, webp ou svg).
     titulo  : nome da obra.
     legenda : uma frase sobre a imagem.
     ia      : true = selo "feito com IA".
     --------------------------------------------------------------------- */
  galeria: [
    { arquivo: 'galeria/temis-neon.svg', titulo: 'Têmis em néon', legenda: 'A deusa da justiça reimaginada como luz de cidade: a venda vira um feixe, a balança vira dois sóis.', data: '2026-09-25', ia: true },
    { arquivo: 'galeria/espiral-da-lei.svg', titulo: 'A espiral da lei', legenda: 'Cada volta é uma época: Hamurabi no centro, a Constituição de 1988 na borda. A lei cresce, mas nunca recomeça do zero.', data: '2026-09-25', ia: true },
    { arquivo: 'galeria/balanca-de-estrelas.svg', titulo: 'Balança de estrelas', legenda: 'Dois pratos, duas constelações. Nenhum pesa mais até que se ouça o outro lado.', data: '2026-09-25', ia: true },
  ],

  /* ---------------------------------------------------------------------
     IDEIAS · ensaios curtos
     ---------------------------------------------------------------------
     arquivo : nome do texto dentro da pasta ideias/ (termina em .md).
               O texto em si fica nesse arquivo, escrito em linguagem simples.
     titulo  : título do ensaio.
     resumo  : duas linhas que convidam a ler.
     data    : data de publicação.
     --------------------------------------------------------------------- */
  ideias: [
    {
      arquivo: 'ideias/como-os-juizes-decidem.md',
      titulo: 'Como os juízes decidem de verdade',
      resumo: 'A lei diz uma coisa; a decisão sai outra. Não é má-fé: é o modo como a cabeça humana funciona, e o Direito ainda finge que não sabe.',
      data: '2026-09-25',
    },
    {
      arquivo: 'ideias/leis-para-a-inteligencia-artificial.md',
      titulo: 'Estamos fazendo leis para a IA do jeito errado',
      resumo: 'Cada país corre para regular a inteligência artificial. Quase todos repetem o erro de regular o cavalo quando o carro já chegou.',
      data: '2026-09-25',
    },
  ],

  /* ---------------------------------------------------------------------
     NEWSLETTER
     ---------------------------------------------------------------------
     Deixe url: '' enquanto não tiver uma ferramenta de envio. Assim, quem
     digitar o e-mail abre uma mensagem pronta para o seu e-mail. Quando
     tiver uma ferramenta (Zoho Campaigns, Buttondown etc.), cole aqui o
     endereço do formulário e o cadastro passa a ser automático.
     --------------------------------------------------------------------- */
  newsletter: {
    url: '',
    email: 'jocsan@aguillera.art.br',
  },
};
