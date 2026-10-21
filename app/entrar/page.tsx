"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Corners } from "@/components/ui";
import { config } from "@/lib/config";
import { useStore } from "@/lib/store";

// TODO(produção): autenticação real (senha com hash ou magic link), papel
// salvo no usuário e rotas /admin protegidas no servidor.
export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const enter = (value: string) => {
    const r = login(value);
    if (!r.ok) return setError(r.error);
    setError("");
    setPass("");
    router.push(r.user.role === "admin" ? "/admin" : "/conta");
  };

  return (
    <section style={{ padding: "80px 0 96px", display: "flex", justifyContent: "center" }}>
      <form
        className="card blueprint"
        style={{ width: "100%", maxWidth: 440, padding: 36, gap: 18 }}
        onSubmit={(e) => {
          e.preventDefault();
          enter(email);
        }}
      >
        <Corners />
        <h1 className="upper" style={{ margin: 0, fontSize: 44, lineHeight: 1 }}>Entrar</h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "var(--muted-70)" }}>
          Acesse os projetos que você comprou, baixe arquivos e tire dúvidas.
        </p>
        <div className="field">
          <label htmlFor="lg-email">E-mail</label>
          <input id="lg-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@seunegocio.com.br" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="lg-pass">Senha</label>
          <input id="lg-pass" type="password" className="input" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        </div>
        {error && (
          <span role="alert" style={{ fontSize: 13, color: "var(--color-accent-900)", fontWeight: 600 }}>{error}</span>
        )}
        <button type="submit" className="btn btn-primary blueprint" style={{ padding: 12, fontSize: 15 }}>
          <Corners />
          Entrar
        </button>
        <a href="#" style={{ fontSize: 13, alignSelf: "flex-start" }}>Esqueci minha senha</a>
        {/* Remover em produção */}
        <div className="stack" style={{ borderTop: "1px solid var(--color-divider)", paddingTop: 16, gap: 10 }}>
          <span className="label-caps">Acesso de demonstração</span>
          <div className="btn-pair">
            <button type="button" className="btn btn-secondary" onClick={() => enter("cliente@demo.com")}>Como cliente</button>
            <button type="button" className="btn btn-secondary" onClick={() => enter(config.adminEmail)}>Como administrador</button>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted-70)" }}>
            {config.adminEmail} abre o painel; qualquer outro e-mail entra como cliente.
          </span>
        </div>
      </form>
    </section>
  );
}
