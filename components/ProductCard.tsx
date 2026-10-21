"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";
import { fmt } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { Corners, ImageSlot } from "./ui";

function useBuy() {
  const { addToCart } = useStore();
  const router = useRouter();
  return (id: string) => {
    addToCart(id);
    router.push("/checkout");
  };
}

function Cover({ p }: { p: Product }) {
  return (
    <div className="duotone media" style={{ aspectRatio: "16/10", borderBottom: "1px solid var(--color-divider)" }}>
      <ImageSlot label="Print do projeto" />
    </div>
  );
}

/** Card da home: o card inteiro abre o detalhe. */
export function FeaturedCard({ p }: { p: Product }) {
  const router = useRouter();
  return (
    <article className="card blueprint" style={{ padding: 0, gap: 0, cursor: "pointer" }} onClick={() => router.push(`/projetos/${p.id}`)}>
      <Corners />
      <Cover p={p} />
      <div className="stack" style={{ padding: 18, gap: 10 }}>
        <span className="card-kicker">{p.tipo}</span>
        <h3 className="card-title upper" style={{ margin: 0, fontSize: 22 }}>
          <Link href={`/projetos/${p.id}`} onClick={(e) => e.stopPropagation()} style={{ color: "inherit", textDecoration: "none" }}>
            {p.nome}
          </Link>
        </h3>
        <p className="card-body" style={{ lineHeight: 1.5 }}>{p.resumo}</p>
        <div className="row between" style={{ paddingTop: 6 }}>
          <span className="price" style={{ fontSize: 22 }}>{fmt(p.preco)}</span>
          {config.showRatings && <span className="meta">★ {p.nota} · {p.aval} avaliações</span>}
        </div>
      </div>
    </article>
  );
}

/** Card do catálogo: tags de tecnologia e botões Detalhes/Comprar (ou Ver página/Editar para admin). */
export function CatalogCard({ p }: { p: Product }) {
  const { user } = useStore();
  const router = useRouter();
  const buy = useBuy();
  const isAdmin = user?.role === "admin";
  return (
    <article className="card blueprint" style={{ padding: 0, gap: 0 }}>
      <Corners />
      <Cover p={p} />
      <div className="stack" style={{ padding: 18, gap: 10, flex: 1 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="card-kicker">{p.tipo}</span>
          {p.novo && <span className="tag tag-accent">Novo</span>}
        </div>
        <h3 className="card-title upper" style={{ margin: 0, fontSize: 22 }}>{p.nome}</h3>
        <p className="card-body" style={{ lineHeight: 1.5 }}>{p.resumo}</p>
        <div className="row wrap" style={{ gap: 6 }}>
          {p.tech.map((t) => (
            <span key={t.n} className="tag tag-neutral">{t.n}</span>
          ))}
        </div>
        <div className="row between" style={{ paddingTop: 6 }}>
          <span className="price" style={{ fontSize: 24 }}>{fmt(p.preco)}</span>
          {config.showRatings && <span className="meta">★ {p.nota} ({p.aval})</span>}
        </div>
        {isAdmin ? (
          <div className="btn-pair">
            <button type="button" className="btn btn-secondary" onClick={() => router.push(`/projetos/${p.id}`)}>Ver página</button>
            <button type="button" className="btn btn-primary" onClick={() => router.push(`/admin?editar=${p.id}`)}>Editar</button>
          </div>
        ) : (
          <div className="btn-pair">
            <button type="button" className="btn btn-secondary" onClick={() => router.push(`/projetos/${p.id}`)}>Detalhes</button>
            <button type="button" className="btn btn-primary" onClick={() => buy(p.id)}>Comprar</button>
          </div>
        )}
      </div>
    </article>
  );
}

/** Card compacto da área do cliente ("Disponíveis para você"). */
export function AvailableCard({ p }: { p: Product }) {
  const router = useRouter();
  const buy = useBuy();
  return (
    <article className="card blueprint" style={{ padding: 0, gap: 0 }}>
      <Corners />
      <Cover p={p} />
      <div className="stack" style={{ padding: 16, gap: 8 }}>
        <span className="card-kicker">{p.tipo}</span>
        <h3 className="card-title upper" style={{ margin: 0, fontSize: 20 }}>{p.nome}</h3>
        <span className="price" style={{ fontSize: 22 }}>{fmt(p.preco)}</span>
        <div className="btn-pair">
          <button type="button" className="btn btn-secondary" onClick={() => router.push(`/projetos/${p.id}`)}>Detalhes</button>
          <button type="button" className="btn btn-primary" onClick={() => buy(p.id)}>Comprar</button>
        </div>
      </div>
    </article>
  );
}
