"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { Corners, FaqList, ImageSlot, Tabs } from "@/components/ui";
import { config } from "@/lib/config";
import { fmt, pixPercentLabel, pixPrice } from "@/lib/format";
import { REVIEWS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const GALLERY = ["Página inicial", "Página interna", "No celular", "Vídeo"];
type Tab = "desc" | "tech" | "reviews" | "faq";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, questions, cart, user, hydrated, addToCart } = useStore();
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [tab, setTab] = useState<Tab>("desc");
  const isAdmin = user?.role === "admin";
  const p = products.find((x) => x.id === id && (x.ativo || isAdmin));

  if (!p) {
    if (!hydrated) return null;
    return (
      <section className="stack" style={{ padding: "80px 0 96px", gap: 16, alignItems: "flex-start" }}>
        <h1 className="h-page">Projeto não encontrado</h1>
        <Link href="/projetos">Ver projetos</Link>
      </section>
    );
  }

  const faq = questions.filter((q) => q.status === "answered" && q.publico && (!q.pid || q.pid === p.id));
  const inCart = cart.includes(p.id);

  return (
    <section style={{ padding: "32px 0 96px" }}>
      <div className="row" style={{ gap: 8, fontSize: 14, marginBottom: 28, color: "var(--muted-70)" }}>
        <Link href="/projetos">Projetos</Link>
        <span>/</span>
        <span>{p.nome}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 48, alignItems: "start" }}>
        <div className="stack" style={{ gap: 14 }}>
          <div className="blueprint duotone media" style={{ aspectRatio: "16/10" }}>
            <Corners />
            <ImageSlot key={img} label={img === 3 ? "Vídeo de apresentação" : "Print — " + GALLERY[img].toLowerCase()} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {GALLERY.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={img === i}
                onClick={() => setImg(i)}
                style={{
                  background: "transparent",
                  border: `1px solid ${img === i ? "var(--color-accent)" : "var(--color-divider)"}`,
                  color: img === i ? "var(--color-text)" : "var(--muted-55)",
                  padding: "10px 8px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  fontSize: 13,
                }}
              >
                <span className="price" style={{ fontSize: 16 }}>0{i + 1}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <aside className="card blueprint" style={{ padding: 28, gap: 16, position: "sticky", top: 96 }}>
          <Corners />
          <div className="row between" style={{ gap: 12 }}>
            <span className="card-kicker">{p.tipo}</span>
            {isAdmin && (
              <button type="button" className="btn btn-secondary" onClick={() => router.push(`/admin?editar=${p.id}`)} style={{ fontSize: 13, padding: "4px 10px" }}>
                Editar produto
              </button>
            )}
          </div>
          <h1 className="upper" style={{ margin: 0, fontSize: 40, lineHeight: 1.02 }}>{p.nome}</h1>
          {config.showRatings && <span style={{ fontSize: 14, color: "var(--muted-70)" }}>★ {p.nota} · {p.aval} avaliações</span>}
          <p className="lead">{p.resumo}</p>
          <div className="stack" style={{ gap: 2 }}>
            <span className="price" style={{ fontSize: 44, lineHeight: 1 }}>{fmt(p.preco)}</span>
            {config.pixDiscount && (
              <span className="accent-text" style={{ fontSize: 13 }}>
                ou {fmt(pixPrice(p.preco))} no Pix ({pixPercentLabel} off)
              </span>
            )}
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn btn-primary blueprint"
              onClick={() => {
                addToCart(p.id);
                router.push("/checkout");
              }}
              style={{ padding: 12, fontSize: 15 }}
            >
              <Corners />
              Comprar agora
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => addToCart(p.id)} style={{ padding: 11, fontSize: 15 }}>
              {inCart ? "No carrinho ✓" : "Adicionar ao carrinho"}
            </button>
            {/* TODO: URL real da demo de cada projeto */}
            <a className="btn btn-ghost" href="#" style={{ padding: 10, fontSize: 15 }}>
              Ver demo ao vivo
              <ExternalLink size={15} strokeWidth={1.5} />
            </a>
          </div>
          <div className="stack" style={{ borderTop: "1px solid var(--color-divider)", paddingTop: 16, gap: 8 }}>
            <span className="label-caps">O que está incluso</span>
            {p.incluso.map((it) => (
              <div key={it} className="row" style={{ gap: 8, alignItems: "flex-start", fontSize: 14 }}>
                <Check size={16} strokeWidth={1.5} color="var(--color-accent)" style={{ flex: "none", marginTop: 2 }} />
                <span>{it}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div style={{ marginTop: 72 }}>
        <Tabs
          label="Informações do projeto"
          value={tab}
          onChange={setTab}
          tabs={[["desc", "Descrição"], ["tech", "Tecnologias"], ["reviews", "Avaliações"], ["faq", "Dúvidas"]]}
        />
        <div style={{ padding: "32px 0", maxWidth: 760 }}>
          {tab === "desc" && (
            <div className="stack" style={{ gap: 16 }}>
              {p.desc.map((d, i) => (
                <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.65 }}>{d}</p>
              ))}
            </div>
          )}
          {tab === "tech" && (
            <table className="table">
              <thead>
                <tr><th>Tecnologia</th><th>Para que serve</th></tr>
              </thead>
              <tbody>
                {p.tech.map((t) => (
                  <tr key={t.n}><td style={{ fontWeight: 600 }}>{t.n}</td><td>{t.d}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "reviews" && (
            <div className="stack" style={{ gap: 28 }}>
              {REVIEWS.map((r) => (
                <div key={r.nome} className="stack" style={{ gap: 6, borderBottom: "1px solid var(--color-divider)", paddingBottom: 24 }}>
                  <span style={{ color: "var(--color-accent)", letterSpacing: ".1em" }}>★★★★★</span>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>{r.txt}</p>
                  <span className="meta">{r.nome} · {r.neg}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "faq" && <FaqList items={faq} />}
        </div>
      </div>
    </section>
  );
}
