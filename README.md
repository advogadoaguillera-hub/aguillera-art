# Arte & Direito · aguillera.art.br

Site cultural de Jocsan Aguillera (OAB/MS nº 18.115). É um site estático: HTML, CSS e JavaScript, sem framework, sem build e sem servidor.

| Arquivo | O que é |
|---|---|
| `index.html` | A página |
| `style.css` | Cores, fontes e animações |
| `app.js` | Citações, duelo, biblioteca e linha do tempo. **Os textos ficam nos blocos `DADOS`, no topo do arquivo.** |
| `musica.js` | A abertura musical, tocada ao vivo pelo navegador |
| `conteudo.js` | **O que você edita para postar:** vídeos, imagens e ensaios. Veja o [GUIA-DE-USO.md](GUIA-DE-USO.md) |
| `secoes.js` | Monta o Cinema, a Galeria, as Ideias, a newsletter e o menu do celular a partir do `conteudo.js` |
| `galeria/` | As imagens da galeria |
| `ideias/` | Os textos dos ensaios, um arquivo `.md` por texto |
| `tools/servidor-local.ps1` | Serve para ver o site no seu computador (`http://localhost:8110`). A hospedagem não usa esse arquivo. |

## Situação do domínio (verificada em 22/09/2026)

- `aguillera.art.br` foi registrado no Registro.br em 18/09/2026, está **ativo** e **pago até 18/09/2028**.
- O DNS é o do próprio Registro.br.
- O e-mail `jocsan@aguillera.art.br` já está configurado na Zoho (registros MX e SPF).
- Ainda não existe nenhum registro de site (A ou CNAME). É isso que falta.

## Como publicar (GitHub Pages, gratuito)

1. No GitHub, crie um repositório **público** chamado `aguillera-art`.
2. Envie para ele o **conteúdo** desta pasta, sem a pasta `tools`.
3. No repositório, vá em **Settings → Pages**. Em *Source*, escolha `main` / `root`. Em *Custom domain*, digite `aguillera.art.br` e salve.
4. No **registro.br**, abra o domínio e vá em **DNS → Editar zona**. **Acrescente** estes registros e **não apague os da Zoho**:

   | Tipo | Nome | Valor |
   |---|---|---|
   | A | (vazio) | 185.199.108.153 |
   | A | (vazio) | 185.199.109.153 |
   | A | (vazio) | 185.199.110.153 |
   | A | (vazio) | 185.199.111.153 |
   | CNAME | www | advogadoaguillera-hub.github.io |

5. Espere de 1 a 24 horas. Depois volte em **Settings → Pages** e marque **Enforce HTTPS**.

> ⚠️ Não troque os "servidores DNS" do domínio. Se trocar, os registros MX da Zoho somem e o e-mail para de funcionar.

## Direitos autorais: o que foi feito e o que evitar

- **Música.** *Assim falou Zaratustra* (Richard Strauss, 1896) está em domínio público no Brasil desde 2020, porque Strauss morreu em 1949 (Lei 9.610/98, art. 41). As **gravações** de orquestras continuam protegidas. Por isso a música é sintetizada nota a nota pelo navegador. **Não troque por um MP3 do filme nem de uma orquestra.**
- **Filme.** *2001: Uma Odisseia no Espaço* pertence à Warner. O site só faz uma homenagem ao clima da cena: não usa imagens do filme, nem o título, nem o logotipo. Mantenha assim.
- **Citações.** São traduções livres de obras em domínio público. Traduções publicadas por editoras são protegidas, então não copie trechos delas.
- **Capas.** As capas são desenhos próprios. Não use fotos de capas de editoras.

## Ética da OAB (Provimento 205/2021)

O site é informativo e cultural. Ele mostra o nome e a inscrição na OAB, não oferece serviços, não fala de preços nem de resultados e não pede que ninguém "contrate". Mantenha esse tom se for acrescentar textos.

## Privacidade (LGPD)

O site não tem formulário, cookies nem analytics, então não precisa de banner de cookies. Se um dia acrescentar Google Analytics ou um formulário, publique também uma política de privacidade.
