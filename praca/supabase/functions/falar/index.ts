// ==========================================================================
// A Praça · função "falar": o porteiro.
// Recebe o texto, pede a uma IA que verifique a Lei da Praça (a 4ª lei:
// criança, ódio, ameaça, crime, dado pessoal de terceiro) e só então grava.
// Nunca julga ideias: julga só o que fere pessoas.
// ==========================================================================
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEI = `Você é o porteiro da Praça, um site brasileiro de conversa livre sobre arte, direito e qualquer assunto.
A Lei da Praça: tudo pode ser assunto (clones, pena de morte, revoluções, genética, política, religião, o universo).
Nenhuma ideia é proibida. O que é proibido é só o que fere PESSOAS:
- qualquer sexualização de criança ou adolescente;
- ameaça ou incitação de violência contra pessoa ou grupo;
- ódio contra pessoas por raça, religião, orientação sexual, gênero, deficiência, origem;
- assédio ou ataque a uma pessoa específica (não a uma ideia);
- dados pessoais de terceiros (telefone, endereço, documento);
- instruções práticas para crime (fabricar arma, droga, invadir sistema).
Responda SOMENTE com JSON: {"entra": true} ou {"entra": false, "motivo": "frase curta e gentil"}.
Na dúvida, deixe entrar. Opinião forte, palavrão, delírio, crítica dura: entram.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { sala, texto, responde_a } = await req.json();
    const auth = req.headers.get("Authorization") ?? "";
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return json({ erro: "Entre para falar." }, 401);

    const t = String(texto ?? "").trim();
    if (t.length < 1 || t.length > 600) return json({ erro: "Entre 1 e 600 letras." }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: perfil } = await admin.from("perfis").select("banido_ate").eq("id", user.id).single();
    if (perfil?.banido_ate && new Date(perfil.banido_ate) > new Date()) return json({ erro: "Você está fora da Praça por enquanto." }, 403);

    // ritmo: no máximo um post a cada 10 segundos
    const { data: ultimo } = await admin.from("posts").select("criado_em").eq("autor", user.id).order("criado_em", { ascending: false }).limit(1);
    if (ultimo?.[0] && Date.now() - new Date(ultimo[0].criado_em).getTime() < 10_000) return json({ erro: "Respira. Um post a cada dez segundos." }, 429);

    // o porteiro (se ainda não houver chave da IA, entra só com a regra de ritmo)
    const chave = Deno.env.get("ANTHROPIC_API_KEY");
    if (!chave) return gravar(admin, sala, user.id, t, responde_a);
    const ia = new Anthropic({ apiKey: chave });
    const r = await ia.messages.create({
      model: "claude-haiku-5-5", max_tokens: 1024,
      output_config: { effort: "low" },
      system: LEI,
      messages: [{ role: "user", content: t }],
    });
    let veredito = { entra: true } as { entra: boolean; motivo?: string };
    const saida = r.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("");
    try { veredito = JSON.parse(saida.match(/\{[\s\S]*\}/)?.[0] ?? "{}"); } catch { /* na dúvida, entra */ }
    if (veredito.entra === false) return json({ erro: veredito.motivo ?? "Isso fere a quarta lei da Praça." }, 422);

    return gravar(admin, sala, user.id, t, responde_a);
  } catch (e) {
    return json({ erro: String(e) }, 500);
  }
});

// deno-lint-ignore no-explicit-any
async function gravar(admin: any, sala: string, autor: string, texto: string, responde_a?: number) {
  const { data, error } = await admin.from("posts").insert({ sala, autor, texto, responde_a: responde_a ?? null }).select("id").single();
  if (error) return json({ erro: error.message }, 400);
  return json({ ok: true, id: data.id });
}

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
