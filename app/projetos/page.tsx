"use client";

import { useState } from "react";
import { CatalogCard } from "@/components/ProductCard";
import { Segmented } from "@/components/ui";
import { useStore } from "@/lib/store";

type Filter = "todos" | "sites" | "apps";

export default function CatalogPage() {
  const { published } = useStore();
  const [cat, setCat] = useState<Filter>("todos");
  const filtered = published.filter((p) => cat === "todos" || p.cat === cat);
  return (
    <section style={{ padding: "64px 0 96px" }}>
      <div className="row wrap between" style={{ alignItems: "flex-end", gap: 24, borderBottom: "1px solid var(--color-divider)", paddingBottom: 20, marginBottom: 40 }}>
        <div className="stack" style={{ gap: 8 }}>
          <h1 className="h-page">Projetos</h1>
          <span style={{ fontSize: 14, color: "var(--muted-70)" }}>
            {filtered.length} {filtered.length === 1 ? "projeto" : "projetos"}
          </span>
        </div>
        <Segmented
          name="cat"
          label="Filtrar"
          value={cat}
          onChange={setCat}
          options={[["todos", "Todos"], ["sites", "Sites"], ["apps", "Apps"]]}
        />
      </div>
      <div className="grid-catalog">
        {filtered.map((p) => (
          <CatalogCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
