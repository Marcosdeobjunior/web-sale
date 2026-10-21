"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import { Corners, Segmented, Tabs } from "@/components/ui";
import { fmt } from "@/lib/format";
import { NEW_PRODUCT, productName, useStore, type ProductDraft } from "@/lib/store";
import type { Product, ProductType, Question } from "@/lib/types";

type Tab = "produtos" | "duvidas" | "vendas";

export default function AdminPage() {
  return (
    <RequireRole role="admin">
      <Suspense>
        <Admin />
      </Suspense>
    </RequireRole>
  );
}

const toDraft = (p: Product): ProductDraft => ({
  nome: p.nome,
  tipo: p.tipo,
  preco: String(p.preco).replace(".", ","),
  resumo: p.resumo,
  incluso: p.incluso.join("\n"),
  ativo: p.ativo,
});

function Admin() {
  const { products, orders, questions } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("produtos");
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft | null>(null);

  const startEdit = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setTab("produtos");
    setEditId(id);
    setDraft(toDraft(p));
    window.scrollTo(0, 0);
  };

  // "Editar" no catálogo/detalhe chega como /admin?editar=<id>.
  const editParam = params.get("editar");
  useEffect(() => {
    if (!editParam) return;
    startEdit(editParam);
    router.replace("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editParam]);

  const pending = questions.filter((q) => q.status === "pending");
  const stats = [
    { label: "Vendas", value: String(orders.length) },
    { label: "Receita", value: fmt(orders.reduce((a, o) => a + o.valor, 0)) },
    { label: "Dúvidas pendentes", value: String(pending.length) },
  ];

  return (
    <section style={{ padding: "56px 0 96px" }}>
      <div className="stack" style={{ gap: 10, marginBottom: 36 }}>
        <span className="kicker">Painel do administrador</span>
        <h1 className="h-account">Painel</h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28, marginBottom: 48 }}>
        {stats.map((st) => (
          <div key={st.label} className="card blueprint" style={{ padding: 20, gap: 6 }}>
            <Corners />
            <span className="label-caps" style={{ color: "var(--muted-70)" }}>{st.label}</span>
            <span className="price" style={{ fontSize: 40, lineHeight: 1 }}>{st.value}</span>
          </div>
        ))}
      </div>
      <Tabs
        label="Painel"
        value={tab}
        onChange={setTab}
        tabs={[["produtos", "Produtos"], ["duvidas", `Dúvidas (${pending.length})`], ["vendas", "Vendas"]]}
      />
      <div style={{ paddingTop: 36 }}>
        {tab === "produtos" && (
          <ProductsTab
            editId={editId}
            draft={draft}
            setDraft={setDraft}
            onNew={() => {
              setEditId(NEW_PRODUCT);
              setDraft({ nome: "", tipo: "Site", preco: "", resumo: "", incluso: "", ativo: false });
            }}
            onEdit={startEdit}
            onClose={() => {
              setEditId(null);
              setDraft(null);
            }}
          />
        )}
        {tab === "duvidas" && <QuestionsTab pending={pending} />}
        {tab === "vendas" && <SalesTab />}
      </div>
    </section>
  );
}

function ProductsTab({
  editId,
  draft,
  setDraft,
  onNew,
  onEdit,
  onClose,
}: {
  editId: string | null;
  draft: ProductDraft | null;
  setDraft: (d: ProductDraft) => void;
  onNew: () => void;
  onEdit: (id: string) => void;
  onClose: () => void;
}) {
  const { products, orders, saveProduct } = useStore();
  const router = useRouter();
  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) => draft && setDraft({ ...draft, [k]: v });

  return (
    <>
      <div className="row wrap between" style={{ gap: 16, marginBottom: 24 }}>
        <h2 className="h-section">Produtos</h2>
        <button type="button" className="btn btn-primary" onClick={onNew}>+ Novo produto</button>
      </div>

      {draft && editId && (
        <div className="card blueprint" style={{ padding: 28, gap: 16, marginBottom: 40 }}>
          <Corners />
          <h3 className="upper" style={{ margin: 0, fontSize: 22 }}>{editId === NEW_PRODUCT ? "Novo produto" : "Editar — " + draft.nome}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            <div className="field">
              <label htmlFor="ed-nome">Nome</label>
              <input id="ed-nome" className="input" value={draft.nome} onChange={(e) => set("nome", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="ed-preco">Preço (R$)</label>
              <input id="ed-preco" className="input" inputMode="decimal" value={draft.preco} onChange={(e) => set("preco", e.target.value)} />
            </div>
            <div className="field">
              <label>Tipo</label>
              <Segmented<ProductType> name="dtipo" label="Tipo" value={draft.tipo} onChange={(v) => set("tipo", v)} options={[["Site", "Site"], ["App", "App"]]} />
            </div>
            <div className="field">
              <label>Visibilidade</label>
              <label className="check-label" style={{ minHeight: 36 }}>
                <input type="checkbox" checked={draft.ativo} onChange={(e) => set("ativo", e.target.checked)} />
                Publicado na loja
              </label>
            </div>
          </div>
          <div className="field">
            <label htmlFor="ed-res">Resumo</label>
            <textarea id="ed-res" className="input" value={draft.resumo} onChange={(e) => set("resumo", e.target.value)} style={{ minHeight: 64 }} />
          </div>
          <div className="field">
            <label htmlFor="ed-inc">O que está incluso — um item por linha</label>
            <textarea id="ed-inc" className="input" value={draft.incluso} onChange={(e) => set("incluso", e.target.value)} />
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "11px 20px" }}
              onClick={() => {
                saveProduct(editId, draft);
                onClose();
              }}
            >
              Salvar alterações
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ minWidth: 640 }}>
          <thead>
            <tr><th>Produto</th><th>Tipo</th><th>Preço</th><th>Vendas</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.nome}</td>
                <td>{p.tipo}</td>
                <td>{fmt(p.preco)}</td>
                <td>{orders.filter((o) => o.pid === p.id).length}</td>
                <td><span className={`tag ${p.ativo ? "tag-accent" : "tag-neutral"}`}>{p.ativo ? "Publicado" : "Oculto"}</span></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button type="button" className="btn btn-ghost" onClick={() => router.push(`/projetos/${p.id}`)}>Ver</button>
                  <button type="button" className="btn btn-ghost" onClick={() => onEdit(p.id)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function QuestionsTab({ pending }: { pending: Question[] }) {
  const { products, questions, answerQuestion, setQuestionPublic } = useStore();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [publish, setPublish] = useState<Record<string, boolean>>({});
  const answered = questions.filter((q) => q.status === "answered").slice().reverse();

  return (
    <>
      <h2 className="h-section" style={{ marginBottom: 24 }}>Aguardando resposta ({pending.length})</h2>
      {pending.length === 0 && <p style={{ fontSize: 15, color: "var(--muted-70)" }}>Nenhuma dúvida pendente.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,420px),1fr))", gap: 32 }}>
        {pending.map((q) => {
          const draft = drafts[q.id] || "";
          const pub = publish[q.id] ?? true;
          return (
            <div key={q.id} className="card blueprint" style={{ padding: 24, gap: 12 }}>
              <Corners />
              <span className="meta">{q.autor} · {productName(products, q.pid)} · {q.data}</span>
              <b style={{ fontSize: 17, lineHeight: 1.4 }}>{q.q}</b>
              <textarea
                className="input"
                value={draft}
                onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                placeholder="Escreva a resposta…"
                aria-label="Resposta"
              />
              <label className="check-label">
                <input type="checkbox" checked={pub} onChange={() => setPublish((p) => ({ ...p, [q.id]: !pub }))} />
                Publicar também no FAQ do site
              </label>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!draft.trim()}
                onClick={() => answerQuestion(q.id, draft, pub)}
                style={{ alignSelf: "flex-start", padding: "10px 18px" }}
              >
                Responder
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="h-section" style={{ margin: "64px 0 24px" }}>Respondidas</h2>
      <div className="list">
        {answered.map((q) => (
          <div key={q.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 16, alignItems: "start", padding: "18px 0", borderBottom: "1px solid var(--color-divider)" }}>
            <div className="stack" style={{ gap: 6 }}>
              <b style={{ fontSize: 16 }}>{q.q}</b>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--muted-70)" }}>{q.a}</p>
              <span style={{ fontSize: 12, color: "var(--muted-70)" }}>{q.autor} · {productName(products, q.pid)}</span>
            </div>
            <div className="stack" style={{ gap: 6, alignItems: "flex-end" }}>
              <span className={`tag ${q.publico ? "tag-accent" : "tag-neutral"}`}>{q.publico ? "No FAQ do site" : "Só para o cliente"}</span>
              <button type="button" className="btn btn-ghost" onClick={() => setQuestionPublic(q.id, !q.publico)} style={{ fontSize: 13 }}>
                {q.publico ? "Tirar do FAQ" : "Publicar no FAQ"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SalesTab() {
  const { orders, products } = useStore();
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table" style={{ minWidth: 560 }}>
        <thead>
          <tr><th>Pedido</th><th>Cliente</th><th>Projeto</th><th>Data</th><th style={{ textAlign: "right" }}>Valor</th></tr>
        </thead>
        <tbody>
          {orders.slice().reverse().map((o) => (
            <tr key={o.oid}>
              <td>#{o.oid}</td>
              <td>
                <div className="stack">
                  <b>{o.cliente}</b>
                  <span style={{ fontSize: 12, color: "var(--muted-70)" }}>{o.email}</span>
                </div>
              </td>
              <td>{productName(products, o.pid)}</td>
              <td>{o.data}</td>
              <td style={{ textAlign: "right" }}>{fmt(o.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
