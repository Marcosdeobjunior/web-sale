"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

/**
 * Guarda de rota no cliente (protótipo). Em produção a proteção de /admin e
 * /conta precisa acontecer no servidor (middleware / route handlers).
 */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, hydrated } = useStore();
  const router = useRouter();
  const checked = useRef(false);
  const allowed = user?.role === role;
  useEffect(() => {
    // Só verifica na chegada à página; ao sair (logout) quem navega é o botão "Sair".
    if (!hydrated || checked.current) return;
    checked.current = true;
    if (!allowed) router.replace("/entrar");
  }, [hydrated, allowed, router]);
  return allowed ? <>{children}</> : null;
}
