"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import { AboutLink } from "./AboutLink";

export function Header() {
  const { user, cart, logout } = useStore();
  const router = useRouter();
  const role = user?.role;
  const doLogout = () => {
    logout();
    router.push("/");
  };
  return (
    <div className="top">
      {role === "admin" && (
        <div className="admin-bar">
          <strong>Modo administrador</strong>
          <span>Use “Editar” em qualquer projeto para alterar o site.</span>
          <span style={{ flex: 1 }} />
          <Link href="/admin">Painel</Link>
          <button type="button" className="link-btn" onClick={doLogout}>Sair</button>
        </div>
      )}
      <nav className="nav site-nav gutter">
        <Link href="/" className="nav-brand">Sóter</Link>
        <Link href="/projetos">Projetos</Link>
        <AboutLink />
        {!role && <Link href="/entrar">Entrar</Link>}
        {role === "client" && <Link href="/conta">Minha conta</Link>}
        {role === "admin" && <Link href="/admin">Painel</Link>}
        {role !== "admin" && (
          <button type="button" className="btn btn-secondary" onClick={() => router.push("/checkout")}>
            <ShoppingCart size={16} strokeWidth={1.5} />
            Carrinho ({cart.length})
          </button>
        )}
      </nav>
    </div>
  );
}
