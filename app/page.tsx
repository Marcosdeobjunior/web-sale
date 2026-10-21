"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroShape } from "@/components/HeroShape";
import { FeaturedCard } from "@/components/ProductCard";
import { Corners, ImageSlot, SectionHead } from "@/components/ui";
import { config } from "@/lib/config";
import { REVIEWS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const STEPS = [
  ["01", "Escolha", "Teste a demo ao vivo antes de comprar e veja se o projeto serve para o seu negócio."],
  ["02", "Pague", "Pix, cartão ou boleto. Pagamento único, sem mensalidade."],
  ["03", "Baixe e publique", "O download sai na hora, com um guia passo a passo para colocar no ar."],
];

export default function HomePage() {
  const { published } = useStore();
  const router = useRouter();
  return (
    <>
      <section className="stack hero" style={{ padding: "96px 0 72px", gap: 28 }}>
        <HeroShape />
        <h1 style={{ margin: 0, fontSize: "clamp(44px,7vw,92px)", lineHeight: 1.02, textTransform: "uppercase", letterSpacing: ".01em", maxWidth: "14ch" }}>
          Sites e apps prontos para o seu negócio.
        </h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, maxWidth: "56ch", color: "var(--muted-78)" }}>
          Projetos completos, testados e com guia de instalação. Você compra, baixa e coloca no ar — sem esperar semanas por um desenvolvedor.
        </p>
        <div className="row wrap" style={{ gap: 12 }}>
          <button type="button" className="btn btn-primary blueprint" onClick={() => router.push("/projetos")} style={{ padding: "12px 20px", fontSize: 15 }}>
            <Corners />
            Ver projetos
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
          <a className="btn btn-ghost" href={`mailto:${config.contactEmail}`} style={{ padding: "12px 16px", fontSize: 15 }}>
            Falar comigo
          </a>
        </div>
      </section>

      <section style={{ padding: "24px 0 72px" }}>
        <SectionHead aside={<Link href="/projetos" style={{ fontSize: 14 }}>Ver todos</Link>}>01 · Projetos em destaque</SectionHead>
        <div className="grid-featured">
          {published.slice(0, 3).map((p) => (
            <FeaturedCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section style={{ padding: "24px 0 72px" }}>
        <SectionHead>02 · Como funciona</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32 }}>
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="stack" style={{ gap: 10 }}>
              <span className="price" style={{ fontSize: 40, color: "var(--color-accent)" }}>{n}</span>
              <h3 className="upper" style={{ margin: 0, fontSize: 22 }}>{t}</h3>
              <p className="lead">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "24px 0 72px" }}>
        <SectionHead>03 · Quem já usa</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40 }}>
          {REVIEWS.slice(0, 2).map((t) => (
            <figure key={t.nome} className="stack" style={{ margin: 0, gap: 16 }}>
              <blockquote style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 26, lineHeight: 1.3 }}>“{t.txt}”</blockquote>
              <figcaption style={{ fontSize: 14, margin: 0, color: "var(--muted-70)" }}>— {t.nome}, {t.neg}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="sobre" style={{ padding: "24px 0 96px", scrollMarginTop: 80 }}>
        <SectionHead>04 · Sobre</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "center" }}>
          <figure className="blueprint duotone media" style={{ margin: 0, aspectRatio: "4/3" }}>
            <ImageSlot label="Sua foto" />
            <Corners />
          </figure>
          <div className="stack" style={{ gap: 16 }}>
            <h2 className="upper" style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}>Feito por quem desenvolve sob medida</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--muted-78)" }}>
              A Sóter transforma projetos que já funcionam em clientes reais em produtos prontos para outros negócios. Cada um vem com o código completo e suporte por e-mail.
            </p>
            <a href={`mailto:${config.contactEmail}`} style={{ fontSize: 15 }}>{config.contactEmail}</a>
          </div>
        </div>
      </section>
    </>
  );
}
