import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/selina-hero.jpg";
import { GiftList } from "@/components/GiftList";

const TITLE = "Chá de Bebê da Princesa Selina 👑";
const DESC =
  "Um reino inteiro se prepara para a chegada da Selina, filha da Tamara e irmãzinha do Brandon. Venha celebrar e escolha seu presente!";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const details = [
  { icon: "📅", label: "Quando", value: "Sábado, 15 de novembro", sub: "às 15h" },
  { icon: "🏰", label: "Onde", value: "Castelo da família", sub: "Endereço enviado no convite" },
  { icon: "👗", label: "Traje", value: "Tons de rosa e lilás", sub: "Coroa opcional (mas incentivada)" },
];

const sparkles = [
  "left-[8%] top-[12%]", "right-[10%] top-[20%]", "left-[18%] bottom-[18%]",
  "right-[20%] bottom-[10%]", "left-[45%] top-[6%]",
];

function Index() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
        {sparkles.map((p, i) => (
          <span key={i} className={`twinkle absolute text-2xl text-gold ${p}`} style={{ animationDelay: `${i * 0.6}s` }}>
            ✦
          </span>
        ))}
        <div className="relative text-center md:text-left">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-lilac">Era uma vez…</p>
          <h1 className="mt-4 font-display text-7xl leading-none text-princess md:text-8xl">Selina</h1>
          <p className="mt-6 font-serif text-2xl italic leading-relaxed md:text-3xl">
            uma princesinha que ainda nem chegou e já dominou o reino inteiro.
          </p>
          <p className="mt-6 text-muted-foreground">
            A rainha <strong className="text-foreground">Tamara</strong> e o príncipe-irmão{" "}
            <strong className="text-foreground">Brandon</strong> convidam você para o chá de bebê mais
            encantado do ano.
          </p>
          <a href="#presentes" className="neu-btn mt-10 inline-block rounded-full px-10 py-4 text-lg font-bold">
            Escolher meu presente ✨
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="neu float-soft rounded-full p-5">
            <img src={hero} alt="Princesinha Selina dormindo em uma nuvem cor-de-rosa com uma coroa" width={1024} height={1024} className="aspect-square w-full rounded-full object-cover" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="neu rounded-[2.5rem] px-8 py-14 md:px-14">
          <span className="text-4xl">🌸</span>
          <p className="mt-6 font-serif text-2xl italic leading-relaxed md:text-3xl">
            “Ela vem com cheirinho de flor, bochechas de algodão-doce e o poder mágico de transformar
            noites inteiras em… bem, noites inteiras acordados.”
          </p>
          <p className="mt-8 text-muted-foreground">
            O Brandon já está treinando para ser o guardião oficial do castelo (e jura que vai dividir
            os brinquedos. Vamos ver.) A mamãe Tamara está contando os dias, e as fadas madrinhas —
            vocês! — são essenciais nesse conto.
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-display text-6xl text-princess">O grande baile</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {details.map((d) => (
            <div key={d.label} className="neu rounded-3xl p-8 text-center">
              <div className="neu-inset mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl">
                {d.icon}
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-lilac">{d.label}</p>
              <p className="mt-2 font-serif text-2xl font-bold">{d.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gifts */}
      <section id="presentes" className="mx-auto max-w-6xl scroll-mt-10 px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-6xl text-princess">Lista de presentes</h2>
          <p className="mt-4 text-muted-foreground">
            Escolha um mimo, faça um cadastrinho rápido e pronto: ele some da lista e fica guardado
            no seu nome. Sem presentes repetidos, sem 14 mantinhas iguais. 😅
          </p>
        </div>
        <GiftList />
      </section>

      <footer className="px-6 pb-16 pt-10 text-center">
        <p className="font-display text-4xl text-princess">e foram felizes para sempre…</p>
        <p className="mt-2 text-sm text-muted-foreground">
          com amor, Tamara, Brandon e a pequena Selina 💗
        </p>
        <Link
          to="/acompanhamento"
          className="mt-6 inline-block text-xs text-muted-foreground/70 underline-offset-4 hover:text-primary hover:underline"
        >
          👑 área da família
        </Link>
      </footer>
    </main>
  );
}
