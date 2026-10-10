// ==========================================================================
// A Praça · função "voz": a voz que não é humana.
// Chamada quando alguém escreve "@voz" numa sala, ou pelo relógio (cron)
// quando uma sala fica em silêncio. Ela conversa; por lei, nunca conclui.
// ==========================================================================
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };

const ALMA = `Você é a voz que mora na Praça, um site brasileiro de conversa sem objetivo sobre arte, direito e o universo.
Quem te criou foi Jocsan Aguillera, advogado e artista de Corumbá, Mato Grosso do Sul, que te deu estas leis:
1. Nenhuma conversa pode ter objetivo. Quem chega a uma conclusão, perde. Você NUNCA conclui: termina sempre com uma porta aberta, uma pergunta ou uma imagem.
2. Tudo pode ser assunto: clones, pena de morte, revoluções, genética, o fim do universo, mover o sol. Você pensa como quem olha o céu: filosofia, sociologia, antropologia, arte, delírio.
3. Tudo é entretenimento. Você não dá conselho, orientação nem verdade. Nada que você diz é jurídico.
4. O sagrado: criança é sagrada, a lei é sagrada, pessoas não se atacam. Você recusa com gentileza o que fere pessoas.
Estilo: português do Brasil, frases curtas, de madrugada, uma ideia por parágrafo, no máximo 90 palavras. Cita artistas, filósofos e juristas quando couber, sem pedantismo. Nunca diz que é um assistente. Você é a voz.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { sala } = await req.json();
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // a conversa recente da sala, mais velha primeiro
    const { data: posts } = await admin.from("posts_publicos").select("quem, de, texto, voz, criado_em").eq("sala", sala).order("criado_em", { ascending: false }).limit(12);
    const recentes = (posts ?? []).reverse();
    if (!recentes.length) return json({ ok: false, motivo: "sala vazia" });
    if (recentes[recentes.length - 1].voz) return json({ ok: false, motivo: "a voz foi a última a falar" });

    const conversa = recentes.map((p) => `${p.voz ? "VOZ" : `${p.quem} (${p.de})`}: ${p.texto}`).join("\n");
    const ia = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });
    const r = await ia.beta.messages.create({
      model: "claude-opus-5-5", max_tokens: 2000,
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"], fallbacks: "default",
      system: ALMA,
      messages: [{ role: "user", content: `Sala: ${sala}. Conversa:\n${conversa}\n\nFale agora, como a voz.` }],
    });
    if (r.stop_reason === "refusal") return json({ ok: false, motivo: "a voz preferiu o silêncio" });
    const texto = r.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    if (!texto) return json({ ok: false, motivo: "a voz não disse nada" });

    // a voz não tem conta: posts dela têm autor nulo e voz = true
    const { error } = await admin.from("posts").insert({ sala, autor: null, texto, voz: true });
    if (error) return json({ erro: error.message }, 400);
    return json({ ok: true, texto });
  } catch (e) {
    return json({ erro: String(e) }, 500);
  }
});

function json(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
