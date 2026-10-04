# Guia de uso — aguillera.art.br

Este guia ensina a postar **vídeo, imagem e texto** no site sem mexer em código.
Tudo se faz pelo site do GitHub, no navegador, em qualquer computador.

Endereço de trabalho: **github.com/advogadoaguillera-hub/aguillera-art**
(entre com sua conta do GitHub).

---

## Como o site funciona, em uma frase

O site lê um único arquivo, o **`conteudo.js`**, e monta as seções Cinema, Galeria e Ideias a partir dele. Você edita esse arquivo, salva, e um minuto depois o site está atualizado.

```
conteudo.js        ← a lista do que aparece (vídeos, imagens, ensaios)
galeria/           ← a pasta onde ficam as imagens
ideias/            ← a pasta onde ficam os textos dos ensaios
```

O resto (index.html, style.css, app.js…) é o motor. Não precisa abrir.

---

## 1. Postar um vídeo (Cinema da Justiça)

1. Suba o vídeo no **YouTube**. Pode deixar como "não listado" — ele só aparecerá no seu site.
2. Copie o **código** do vídeo: em `youtube.com/watch?v=AbC123xyz`, o código é `AbC123xyz`.
3. No GitHub, abra o arquivo **`conteudo.js`** e clique no **lápis** (✏️ Edit) no canto direito.
4. Procure a lista `videos: [` e, logo abaixo dela, cole um bloco assim:

```js
    {
      youtube: 'AbC123xyz',
      titulo: 'Por que a Justiça usa venda nos olhos?',
      sinopse: 'Uma estátua, três símbolos e uma pergunta de cinco séculos.',
      data: '2026-10-01',
      duracao: '4 min',
      ia: true,
    },
```

5. Troque o código, o título, a sinopse e a data.
6. Role até o fim da página e clique em **Commit changes** (o botão verde). Na janelinha, clique de novo em **Commit changes**.
7. Espere um minuto e abra **aguillera.art.br**. Se não aparecer, atualize a página com Ctrl + F5.

O **primeiro vídeo da lista** vira o destaque grande. Os outros ficam na fila abaixo.

> **Ainda não tem o vídeo pronto?** Deixe `youtube: ''` (aspas vazias). O cartaz aparece com a etiqueta "em breve", sem link quebrado.

---

## 2. Postar uma imagem (Galeria)

1. Prepare a imagem em **JPG, PNG ou WEBP**, com até 2 MB (imagens maiores deixam o site lento no celular). Largura ideal: 1600 pixels. Dê um nome sem espaços nem acentos: `temis-de-neon.jpg`.
2. No GitHub, entre na pasta **`galeria`**, clique em **Add file → Upload files**, arraste a imagem e clique em **Commit changes**.
3. Volte ao **`conteudo.js`**, clique no lápis e, abaixo de `galeria: [`, cole:

```js
    { arquivo: 'galeria/temis-de-neon.jpg', titulo: 'Têmis de néon', legenda: 'A deusa da justiça reimaginada como luz de cidade.', data: '2026-10-01', ia: true },
```

4. **Commit changes**. Pronto.

Ao tocar na imagem, ela abre em tela cheia com o título e a legenda. As setas passam para a próxima.

---

## 3. Postar um ensaio (Ideias)

Cada ensaio é um arquivo de texto na pasta **`ideias`**. Você escreve como num bloco de notas, com marcas simples para título, negrito e citação.

1. No GitHub, entre na pasta **`ideias`** e clique em **Add file → Create new file**.
2. Dê um nome sem espaços nem acentos, terminado em **`.md`**: `como-os-juizes-decidem.md`.
3. Escreva o texto. As marcas que o site entende:

```
# Título do ensaio                ← uma vez, no topo

Parágrafo comum. Deixe uma linha em branco entre um parágrafo e outro.

## Subtítulo                      ← para dividir o texto

**negrito**  e  *itálico*

- item de lista
- outro item

> Uma citação em destaque.

---                               ← linha separadora
```

4. **Commit changes**.
5. Abra o **`conteudo.js`**, clique no lápis e, abaixo de `ideias: [`, cole:

```js
    {
      arquivo: 'ideias/como-os-juizes-decidem.md',
      titulo: 'Como os juízes decidem de verdade',
      resumo: 'A lei diz uma coisa; a decisão sai outra. Não é má-fé: é o modo como a cabeça humana funciona.',
      data: '2026-10-01',
    },
```

6. **Commit changes**.

O ensaio abre num painel de leitura, com o tempo estimado de leitura calculado sozinho.

---

## 4. Tirar algo do ar

Abra o **`conteudo.js`**, apague o bloco inteiro do item (da chave `{` até a `},`) e salve. O arquivo da imagem ou do texto pode ficar na pasta; ele simplesmente não aparece mais.

---

## 5. Newsletter

Enquanto `url: ''` estiver vazio no fim do `conteudo.js`, quem digita o e-mail abre uma mensagem pronta para **jocsan@aguillera.art.br**. Você guarda os e-mails onde quiser.

Quando quiser cadastro automático, crie uma lista numa ferramenta de envio (o **Zoho Campaigns**, que vem com a sua conta Zoho, tem plano gratuito) e cole o endereço do formulário dela em `url: '...'`. Nada de DNS muda.

---

## 6. Ver quem visita e onde clicam

O site já está preparado para medir; falta só a chave. No fim do `conteudo.js` há o bloco `medicao`, com dois campos vazios. Preencha **um**:

- **`umami`** (recomendado) — crie uma conta grátis em **umami.is**, clique em *Add website*, digite `aguillera.art.br` e copie o **Website ID** (um código longo com hífens). Cole entre as aspas. O painel do Umami passa a mostrar visitas por dia, cidade, aparelho, de onde vieram **e os cliques com nome**: "filme: assistiu — O Processo", "ensaio: abriu — …", "livro: abriu — …", "duelo: terminou", "newsletter: enviou".
- **`cloudflare`** — só visitas, páginas e origem; não mostra cliques.

Nenhum dos dois usa cookies, então o site continua sem banner. Nenhum mostra **nome** de visitante: isso nenhuma ferramenta legítima entrega.

---

## 7. Regras da casa (para não quebrar nada)

- **Aspas.** Todo texto fica entre aspas simples: `'assim'`. Se o texto tiver apóstrofo (d'água), use aspas duplas: `"d'água"`.
- **Vírgulas.** Cada linha termina com vírgula, inclusive a última antes do `},`.
- **Datas** no formato `ano-mês-dia`: `'2026-10-01'`.
- **Nomes de arquivo** sem espaços, sem acentos, sem maiúsculas: `balanca-de-estrelas.jpg`.
- Se depois de salvar o site aparecer **sem** as seções novas, foi uma aspa ou vírgula faltando. Volte ao `conteudo.js`, clique em **History** e abra a versão anterior para comparar. Ou me chame: eu acho o erro em um minuto.

## 8. O que nunca postar

- Vídeos ou imagens de **pessoas reais** geradas por IA. Só personagens inventados.
- Trechos de filmes, músicas gravadas ou capas de editoras — têm direitos autorais.
- Qualquer coisa que soe como propaganda de serviços: preço, "contrate", promessa de resultado. O Provimento 205/2021 da OAB vale também aqui.
