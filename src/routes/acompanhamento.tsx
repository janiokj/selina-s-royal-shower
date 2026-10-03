import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/acompanhamento")({
  head: () => ({
    meta: [
      { title: "Acompanhamento dos Presentes — Chá da Selina 👑" },
      {
        name: "description",
        content:
          "Página da família: veja quem já reservou cada presente do chá de bebê da Selina.",
      },
      { property: "og:title", content: "Acompanhamento dos Presentes — Chá da Selina" },
      {
        property: "og:description",
        content: "Veja quem já reservou cada presente do chá de bebê da Selina.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Acompanhamento,
});

type Claim = {
  gift_name: string;
  gift_emoji: string;
  gift_category: string;
  guest_name: string;
  guest_contact: string;
  message: string | null;
  claimed_at: string;
};

function Acompanhamento() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase.rpc("list_claims");
    setClaims((data as Claim[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lilac">
          Área da família
        </p>
        <h1 className="mt-3 font-display text-5xl text-princess md:text-6xl">
          Presentes reservados
        </h1>
        <p className="mt-4 text-muted-foreground">
          Aqui a Tamara e o Brandon acompanham quem já escolheu cada mimo da Selina 💗
        </p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <span className="neu-sm rounded-full px-5 py-2 text-sm font-semibold">
          {claims.length} {claims.length === 1 ? "presente reservado" : "presentes reservados"}
        </span>
        <button
          onClick={load}
          className="neu-sm rounded-full px-5 py-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          Atualizar 🔄
        </button>
      </div>

      {loading ? (
        <p className="mt-16 text-center text-muted-foreground">Contando os mimos… ✨</p>
      ) : claims.length === 0 ? (
        <div className="neu mx-auto mt-12 max-w-md rounded-3xl p-10 text-center">
          <p className="font-serif text-2xl">Nenhum presente reservado ainda</p>
          <p className="mt-2 text-muted-foreground">
            Assim que o primeiro convidado escolher um mimo, ele aparece aqui.
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-5">
          {claims.map((c, i) => (
            <article key={i} className="neu flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
              <div className="neu-inset flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl">
                {c.gift_emoji}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-lilac">
                  {c.gift_category}
                </span>
                <h2 className="font-serif text-xl font-bold">{c.gift_name}</h2>
                <p className="mt-1 text-sm">
                  <strong>{c.guest_name}</strong>{" "}
                  <span className="text-muted-foreground">· {c.guest_contact}</span>
                </p>
                {c.message && (
                  <p className="mt-2 rounded-2xl bg-background/60 px-4 py-2 text-sm italic text-muted-foreground">
                    “{c.message}”
                  </p>
                )}
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {new Date(c.claimed_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </article>
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <Link to="/" className="neu-sm inline-block rounded-full px-8 py-3 font-semibold text-muted-foreground hover:text-primary">
          ← Voltar para o convite
        </Link>
      </div>
    </main>
  );
}
