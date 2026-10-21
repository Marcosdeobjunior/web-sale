"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download } from "lucide-react";
import { AvailableCard } from "@/components/ProductCard";
import { RequireRole } from "@/components/RequireRole";
import { Corners, FaqList, ImageSlot, Tabs } from "@/components/ui";
import { productName, useStore } from "@/lib/store";

type Tab = "projetos" | "duvidas" | "perfil";

export default function AccountPage() {
  return (
    <RequireRole role="client">
      <Account />
    </RequireRole>
  );
}

function Account() {
  const { user, orders, products, published, logout } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projetos");
  if (!user) return null;

  const myOrders = orders
    .filter((o) => o.email === user.email)
    .map((o) => {
      const p = products.find((x) => x.id === o.pid);
      return p ? { ...o, p } : null;
    })
    .filter((o): o is NonNullable<typeof o> => !!o);
  const owned = myOrders.map((o) => o.pid);
  const available = published.filter((p) => !owned.includes(p.id));

  return (
    <section style={{ padding: "56px 0 96px" }}>
      <div className="row wrap between" style={{ alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
        <div className="stack" style={{ gap: 10 }}>
          <span className="kicker">Área do cliente</span>
          <h1 className="h-account">Olá, {user.nome.split(" ")[0]}</h1>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Sair
        </button>
      </div>
      <Tabs label="Área do cliente" value={tab} onChange={setTab} tabs={[["projetos", "Meus projetos"], ["duvidas", "Dúvidas"], ["perfil", "Perfil"]]} />
      <div style={{ paddingTop: 40 }}>
        {tab === "projetos" && (
          <>
            <h2 className="h-section">Adquiridos</h2>
            {myOrders.length === 0 && <p style={{ fontSize: 15, color: "var(--muted-70)" }}>Você ainda não comprou nenhum projeto.</p>}
            <div className="list" style={{ marginTop: 16 }}>
              {myOrders.map((o) => (
                <div key={o.oid} className="list-row">
                  <div className="duotone media thumb"><ImageSlot label="Print" /></div>
                  <div className="stack" style={{ gap: 2 }}>
                    <b className="item-name">{o.p.nome}</b>
                    <span className="meta">Pedido #{o.oid} · comprado em {o.data}</span>
                  </div>
                  <div className="row wrap" style={{ gap: 8, justifyContent: "flex-end" }}>
                    <Link className="btn btn-ghost" href={`/projetos/${o.pid}`}>Ver página</Link>
                    {/* TODO(produção): GET /downloads/:orderId → URL assinada */}
                    <a className="btn btn-primary" href="#">
                      <Download size={16} strokeWidth={1.5} />
                      Baixar
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h-section" style={{ marginTop: 64, marginBottom: 28 }}>Disponíveis para você</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 32 }}>
              {available.map((p) => (
                <AvailableCard key={p.id} p={p} />
              ))}
            </div>
          </>
        )}

        {tab === "duvidas" && (
          <Questions
            options={[
              { id: "", nome: "Dúvida geral" },
              ...myOrders.map((o) => ({ id: o.pid, nome: o.p.nome })),
              ...available.map((p) => ({ id: p.id, nome: p.nome })),
            ]}
          />
        )}

        {tab === "perfil" && <Profile />}
      </div>
    </section>
  );
}

function Questions({ options }: { options: { id: string; nome: string }[] }) {
  const { user, questions, products, askQuestion } = useStore();
  const [pid, setPid] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const mine = questions.filter((q) => q.email === user!.email).slice().reverse();
  const faq = questions.filter((q) => q.status === "answered" && q.publico);
  const uniqueOptions = options.filter((o, i) => options.findIndex((x) => x.id === o.id) === i);
  return (
    <>
      <div className="grid-side">
        <div className="card blueprint" style={{ padding: 28, gap: 16 }}>
          <Corners />
          <h2 className="h-section">Enviar uma dúvida</h2>
          <div className="field">
            <label htmlFor="q-pid">Sobre qual projeto?</label>
            <select id="q-pid" className="input" value={pid} onChange={(e) => setPid(e.target.value)}>
              {uniqueOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.nome}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="q-txt">Sua pergunta</label>
            <textarea
              id="q-txt"
              className="input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSent(false);
              }}
              placeholder="Ex.: consigo trocar as cores do site?"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!text.trim()}
            style={{ padding: 11 }}
            onClick={() => {
              askQuestion(pid || null, text);
              setText("");
              setSent(true);
            }}
          >
            Enviar pergunta
          </button>
          {sent && <span className="accent-text" style={{ fontSize: 13 }}>Pergunta enviada. A resposta aparece aqui e no seu e-mail.</span>}
        </div>
        <div className="stack" style={{ gap: 20 }}>
          <h2 className="h-section">Minhas perguntas</h2>
          {mine.length === 0 && <p style={{ margin: 0, fontSize: 15, color: "var(--muted-70)" }}>Você ainda não enviou perguntas.</p>}
          {mine.map((q) => {
            const answered = q.status === "answered";
            return (
              <div key={q.id} className="stack" style={{ gap: 8, borderBottom: "1px solid var(--color-divider)", paddingBottom: 20 }}>
                <div className="row wrap" style={{ gap: 8 }}>
                  <span className={`tag ${answered ? "tag-accent" : "tag-outline"}`}>{answered ? "Respondida" : "Aguardando resposta"}</span>
                  <span className="meta">{productName(products, q.pid)} · {q.data}</span>
                </div>
                <b style={{ fontSize: 16, lineHeight: 1.4 }}>{q.q}</b>
                {answered && (
                  <div className="answer">
                    <span className="accent-text" style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 600 }}>Resposta da Sóter</span>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{q.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <h2 className="h-section" style={{ marginTop: 64, marginBottom: 24 }}>Perguntas frequentes</h2>
      <FaqList items={faq} max={760} />
    </>
  );
}

function Profile() {
  const { user, updateProfile } = useStore();
  const [nome, setNome] = useState(user!.nome);
  const [email, setEmail] = useState(user!.email);
  const [saved, setSaved] = useState(false);
  return (
    <div className="stack" style={{ maxWidth: 480, gap: 16 }}>
      <div className="field">
        <label htmlFor="pf-nome">Nome</label>
        <input id="pf-nome" className="input" value={nome} onChange={(e) => { setNome(e.target.value); setSaved(false); }} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="pf-email">E-mail</label>
        <input id="pf-email" type="email" className="input" value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} autoComplete="email" />
      </div>
      <div className="row" style={{ gap: 12 }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: "11px 20px" }}
          onClick={() => {
            updateProfile(nome);
            setSaved(true);
          }}
        >
          Salvar
        </button>
        {saved && <span className="accent-text" style={{ fontSize: 13 }}>Dados salvos.</span>}
      </div>
    </div>
  );
}
