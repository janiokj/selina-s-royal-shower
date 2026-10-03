import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Gift = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: string;
};

export function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<Gift | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("gifts")
      .select("id,name,description,emoji,category")
      .order("sort_order");
    setGifts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(gifts.map((g) => g.category)))],
    [gifts],
  );
  const shown = filter === "Todos" ? gifts : gifts.filter((g) => g.category === filter);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              filter === c ? "neu-inset text-primary" : "neu-sm text-muted-foreground hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Abrindo o baú de presentes… ✨</p>
      ) : shown.length === 0 ? (
        <div className="neu mx-auto max-w-md rounded-3xl p-10 text-center">
          <p className="font-serif text-2xl">Todos os presentes desta lista já têm dono!</p>
          <p className="mt-2 text-muted-foreground">
            A princesa agradece. Seu abraço também é um ótimo presente 💗
          </p>
        </div>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((g) => (
            <article key={g.id} className="neu flex flex-col rounded-3xl p-6">
              <div className="neu-inset mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl">
                {g.emoji}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-lilac">
                {g.category}
              </span>
              <h3 className="mt-1 font-serif text-2xl font-bold">{g.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{g.description}</p>
              <button
                onClick={() => setSelected(g)}
                className="neu-btn mt-6 rounded-full px-5 py-3 text-sm font-bold"
              >
                Quero dar este 🎀
              </button>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <ClaimDialog
          gift={selected}
          onClose={() => setSelected(null)}
          onDone={(name) => {
            setDone(`${name}, “${selected.name}” agora é seu presente reservado!`);
            setSelected(null);
            load();
          }}
          onTaken={() => {
            setSelected(null);
            load();
          }}
        />
      )}

      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm">
          <div className="neu max-w-md rounded-3xl p-10 text-center">
            <div className="float-soft text-6xl">👑</div>
            <p className="mt-4 font-display text-5xl text-princess">Obrigada!</p>
            <p className="mt-4">{done}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              A Selina já está fazendo a dancinha da gratidão (de olhos fechados, claro).
            </p>
            <button onClick={() => setDone(null)} className="neu-btn mt-6 rounded-full px-8 py-3 font-bold">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClaimDialog({
  gift,
  onClose,
  onDone,
  onTaken,
}: {
  gift: Gift;
  onClose: () => void;
  onDone: (name: string) => void;
  onTaken: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Conte pra gente seu nome, por favor.");
    if (contact.trim().length < 5) return setError("Deixe um telefone ou e-mail.");
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_gift", {
      _gift_id: gift.id,
      _name: name.trim(),
      _contact: contact.trim(),
      _message: message.trim(),
    });
    setBusy(false);
    if (error) return setError("Ops, algo deu errado. Tente de novo.");
    if (!data) {
      alert("Que pena! Alguém foi mais rápido e já escolheu este presente.");
      return onTaken();
    }
    onDone(name.trim().split(" ")[0] ?? name.trim());
  }

  const input = "neu-inset w-full rounded-2xl px-5 py-3 outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="neu w-full max-w-md rounded-3xl p-8"
      >
        <div className="text-center">
          <div className="text-5xl">{gift.emoji}</div>
          <h3 className="mt-3 font-serif text-3xl font-bold">{gift.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Um cadastrinho rápido e esse mimo fica reservado só pra você.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <input className={input} placeholder="Seu nome" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
          <input className={input} placeholder="WhatsApp ou e-mail" value={contact} maxLength={120} onChange={(e) => setContact(e.target.value)} />
          <textarea className={input + " min-h-24 resize-none"} placeholder="Recadinho para a Selina (opcional)" value={message} maxLength={500} onChange={(e) => setMessage(e.target.value)} />
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="neu-sm flex-1 rounded-full py-3 font-semibold text-muted-foreground">
            Voltar
          </button>
          <button type="submit" disabled={busy} className="neu-btn flex-1 rounded-full py-3 font-bold">
            {busy ? "Reservando…" : "Reservar 💝"}
          </button>
        </div>
      </form>
    </div>
  );
}
