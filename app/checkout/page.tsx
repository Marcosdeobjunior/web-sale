"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircleCheck, Download, Lock } from "lucide-react";
import { Corners, ImageSlot, Segmented } from "@/components/ui";
import { config } from "@/lib/config";
import { fmt, isEmail, pixPercentLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

type Pay = "pix" | "card" | "boleto";
const STEPS = ["Carrinho", "Dados", "Pagamento", "Download"];

export default function CheckoutPage() {
  const { cart, published, user, removeFromCart, placeOrder } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState<Pay>("pix");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [purchased, setPurchased] = useState<Product[]>([]);

  // Pré-preenche com os dados do cliente logado.
  useEffect(() => {
    if (user?.role === "client") {
      setNome((v) => v || user.nome);
      setEmail((v) => v || user.email);
    }
  }, [user]);

  const go = (n: number) => {
    setStep(n);
    setCopied(false);
    window.scrollTo(0, 0);
  };

  const items = step === 4 ? purchased : cart.map((id) => published.find((p) => p.id === id)).filter((p): p is Product => !!p);
  const subtotal = items.reduce((a, p) => a + p.preco, 0);
  const discountRate = config.pixDiscount && pay === "pix" ? config.pixDiscountRate : 0;
  const discount = Math.round(subtotal * discountRate * 100) / 100;
  const total = subtotal - discount;
  const dataValid = nome.trim().length > 1 && isEmail(email);
  const empty = items.length === 0;

  // TODO(produção): criar a cobrança no provedor (POST /checkout) e só liberar
  // o download pelo webhook de pagamento confirmado.
  const confirm = () => {
    const orderEmail = user?.role === "client" ? user.email : email.trim().toLowerCase();
    setPurchased(placeOrder({ nome, email: orderEmail, discountRate }));
    go(4);
  };

  const isClient = user?.role === "client";

  return (
    <section style={{ padding: "48px 0 96px" }}>
      <ol style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 48, padding: 0, listStyle: "none" }}>
        {STEPS.map((label, i) => (
          <li key={label} className="stack" style={{ gap: 8 }} aria-current={i + 1 === step ? "step" : undefined}>
            <div style={{ height: 2, background: i < step ? "var(--color-accent)" : "var(--color-divider)" }} />
            <span
              style={{
                fontSize: 13,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: i + 1 === step ? "var(--color-text)" : i < step ? "var(--color-accent-700)" : "var(--muted-55)",
              }}
            >
              0{i + 1} {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 4 ? (
        <div className="card blueprint" style={{ padding: "clamp(28px,5vw,56px)", gap: 20, maxWidth: 760, margin: "0 auto" }}>
          <Corners />
          <CircleCheck size={40} strokeWidth={1.5} color="var(--color-accent)" />
          <h1 className="upper" style={{ margin: 0, fontSize: 44, lineHeight: 1 }}>Pagamento confirmado</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "var(--muted-78)" }}>
            Os links também foram enviados para <b>{email || user?.email || "seu e-mail"}</b>. Eles ficam ativos por 30 dias.
          </p>
          <div className="list">
            {items.map((c) => (
              <div key={c.id} className="row wrap" style={{ gap: 16, padding: "16px 0", borderBottom: "1px solid var(--color-divider)" }}>
                <div className="stack" style={{ flex: 1, minWidth: 180, gap: 2 }}>
                  <b className="item-name">{c.nome}</b>
                  <span className="meta">Código-fonte + guia (.zip)</span>
                </div>
                {/* TODO(produção): GET /downloads/:orderId → URL assinada */}
                <a className="btn btn-primary" href="#">
                  <Download size={16} strokeWidth={1.5} />
                  Baixar
                </a>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => router.push(isClient ? "/conta" : "/")} style={{ alignSelf: "flex-start" }}>
            {isClient ? "Ir para minha conta" : "Voltar para a loja"}
          </button>
        </div>
      ) : (
        <div className="grid-side">
          <div className="stack" style={{ gap: 24, minWidth: 0 }}>
            {step === 1 && (
              <>
                <h1 className="h-step">Carrinho</h1>
                {empty && (
                  <div className="stack" style={{ gap: 16, alignItems: "flex-start", padding: "24px 0" }}>
                    <p style={{ margin: 0, fontSize: 16 }}>Seu carrinho está vazio.</p>
                    <Link className="btn btn-primary" href="/projetos">Ver projetos</Link>
                  </div>
                )}
                <div className="list">
                  {items.map((c) => (
                    <div key={c.id} className="list-row">
                      <div className="duotone media thumb"><ImageSlot label="Print" /></div>
                      <div className="stack" style={{ gap: 2, minWidth: 0 }}>
                        <b className="item-name">{c.nome}</b>
                        <span className="meta">{c.tipo} · licença para 1 negócio</span>
                      </div>
                      <div className="stack" style={{ alignItems: "flex-end", gap: 4 }}>
                        <b style={{ fontSize: 16 }}>{fmt(c.preco)}</b>
                        <button type="button" className="btn btn-ghost" onClick={() => removeFromCart(c.id)} style={{ fontSize: 13, padding: "2px 4px" }}>
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row wrap between" style={{ gap: 12 }}>
                  <Link className="btn btn-ghost" href="/projetos">Continuar comprando</Link>
                  <button type="button" className="btn btn-primary" onClick={() => go(2)} disabled={empty} style={{ padding: "12px 20px" }}>
                    Continuar
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="h-step">Seus dados</h1>
                <div className="field">
                  <label htmlFor="ck-nome">Nome completo</label>
                  <input id="ck-nome" className="input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Souza" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="ck-email">E-mail — é para onde vai o download</label>
                  <input id="ck-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@seunegocio.com.br" autoComplete="email" />
                </div>
                <div className="row wrap between" style={{ gap: 12 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => go(1)}>Voltar</button>
                  <button type="button" className="btn btn-primary" onClick={() => go(3)} disabled={!dataValid || empty} style={{ padding: "12px 20px" }}>
                    Ir para pagamento
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="h-step">Pagamento</h1>
                <Segmented
                  name="pay"
                  label="Forma de pagamento"
                  value={pay}
                  onChange={setPay}
                  options={[["pix", "Pix"], ["card", "Cartão"], ["boleto", "Boleto"]]}
                  style={{ alignSelf: "flex-start" }}
                />
                {pay === "pix" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 24, alignItems: "center" }}>
                    <div
                      className="blueprint"
                      style={{
                        aspectRatio: "1",
                        maxWidth: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "repeating-linear-gradient(45deg,transparent 0 7px,var(--color-accent-100) 7px 8px)",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                        color: "var(--color-accent-700)",
                      }}
                    >
                      <Corners />
                      QR code Pix
                    </div>
                    <div className="stack" style={{ gap: 12, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
                        Escaneie com o app do seu banco ou copie o código abaixo. O download é liberado assim que o pagamento cair.
                      </p>
                      <div className="input" style={{ fontFamily: "ui-monospace,Menlo,monospace", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--muted-70)", display: "flex", alignItems: "center" }}>
                        00020126580014BR.GOV.BCB.PIX0136a1f4…
                      </div>
                      <div className="row wrap" style={{ gap: 8 }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setCopied(true)}>
                          {copied ? "Código copiado ✓" : "Copiar código"}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={confirm}>Já paguei</button>
                      </div>
                    </div>
                  </div>
                )}
                {pay === "card" && (
                  <div className="stack" style={{ gap: 14 }}>
                    <div className="field">
                      <label htmlFor="ck-cn">Número do cartão</label>
                      <input id="ck-cn" className="input" placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="cc-number" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 12 }}>
                      <div className="field">
                        <label htmlFor="ck-val">Validade</label>
                        <input id="ck-val" className="input" placeholder="MM/AA" autoComplete="cc-exp" />
                      </div>
                      <div className="field">
                        <label htmlFor="ck-cvv">CVV</label>
                        <input id="ck-cvv" className="input" placeholder="123" autoComplete="cc-csc" />
                      </div>
                      <div className="field">
                        <label htmlFor="ck-par">Parcelas</label>
                        <select id="ck-par" className="input">
                          <option>1x sem juros</option>
                          <option>2x sem juros</option>
                          <option>3x sem juros</option>
                        </select>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary blueprint" onClick={confirm} style={{ padding: 12, fontSize: 15 }}>
                      <Corners />
                      Pagar {fmt(total)}
                    </button>
                  </div>
                )}
                {pay === "boleto" && (
                  <div className="stack" style={{ gap: 14, alignItems: "flex-start" }}>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>
                      O boleto vence em 3 dias úteis. O download é liberado quando o banco confirmar — normalmente em até 2 dias.
                    </p>
                    <button type="button" className="btn btn-primary" onClick={confirm} style={{ padding: "12px 20px" }}>Gerar boleto</button>
                  </div>
                )}
                <div className="row meta" style={{ gap: 8 }}>
                  <Lock size={14} strokeWidth={1.5} />
                  Pagamento processado com segurança
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => go(2)} style={{ alignSelf: "flex-start" }}>Voltar</button>
              </>
            )}
          </div>

          <aside className="card blueprint" style={{ padding: 24, gap: 14, position: "sticky", top: 96 }}>
            <Corners />
            <span className="label-caps">Resumo do pedido</span>
            {items.map((c) => (
              <div key={c.id} className="row between" style={{ gap: 12, fontSize: 14 }}>
                <span>{c.nome}</span>
                <span>{fmt(c.preco)}</span>
              </div>
            ))}
            <div className="stack" style={{ borderTop: "1px solid var(--color-divider)", paddingTop: 12, gap: 8, fontSize: 14 }}>
              <div className="row between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {discount > 0 && (
                <div className="row between accent-text">
                  <span>Desconto Pix ({pixPercentLabel})</span>
                  <span>− {fmt(discount)}</span>
                </div>
              )}
              <div className="row between" style={{ alignItems: "baseline", paddingTop: 4 }}>
                <b>Total</b>
                <span className="price" style={{ fontSize: 28 }}>{fmt(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
