"use client";

// Estado da loja no navegador (equivalente à classe Component do protótipo).
// Persiste em localStorage para sobreviver à navegação entre rotas.
// Em produção, produtos/pedidos/dúvidas/usuário vêm do servidor — veja README.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { config } from "./config";
import { isEmail, today } from "./format";
import { SEED_ORDERS, SEED_PRODUCTS, SEED_QUESTIONS } from "./seed";
import type { Order, Product, ProductType, Question, User } from "./types";

const STORAGE_KEY = "soter-loja-v1";

interface Data {
  products: Product[];
  orders: Order[];
  questions: Question[];
  cart: string[];
  user: User | null;
}

export interface ProductDraft {
  nome: string;
  tipo: ProductType;
  preco: string;
  resumo: string;
  incluso: string;
  ativo: boolean;
}

export const NEW_PRODUCT = "__new";

const initial: Data = {
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  questions: SEED_QUESTIONS,
  cart: [],
  user: null,
};

function useStoreValue() {
  const [data, setData] = useState<Data>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* armazenamento indisponível: segue com os dados de exemplo */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignora */
    }
  }, [data, hydrated]);

  const addToCart = useCallback((id: string) => {
    setData((s) => (s.cart.includes(id) ? s : { ...s, cart: [...s.cart, id] }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setData((s) => ({ ...s, cart: s.cart.filter((x) => x !== id) }));
  }, []);

  /** Regra do protótipo: admin@soter.dev → admin; qualquer outro e-mail → cliente. */
  const login = useCallback(
    (email: string): { ok: true; user: User } | { ok: false; error: string } => {
      const e = (email || "").trim().toLowerCase();
      if (!isEmail(e)) return { ok: false, error: "Digite um e-mail válido." };
      const admin = e === config.adminEmail;
      const known = data.orders.find((o) => o.email === e);
      const nome = admin
        ? "Administrador"
        : known
          ? known.cliente
          : e.split("@")[0].replace(/^./, (c) => c.toUpperCase());
      const user: User = { role: admin ? "admin" : "client", nome, email: e };
      setData((s) => ({ ...s, user }));
      return { ok: true, user };
    },
    [data.orders],
  );

  const logout = useCallback(() => setData((s) => ({ ...s, user: null })), []);

  const updateProfile = useCallback((nome: string) => {
    setData((s) => (s.user ? { ...s, user: { ...s.user, nome: nome || s.user.nome } } : s));
  }, []);

  /** Cria um pedido por item do carrinho e esvazia o carrinho. */
  const placeOrder = useCallback(
    (input: { nome: string; email: string; discountRate: number }): Product[] => {
      const items = data.cart
        .map((id) => data.products.find((p) => p.id === id && p.ativo))
        .filter((p): p is Product => !!p);
      setData((s) => {
        let n = Math.max(0, ...s.orders.map((o) => +o.oid)) + 1;
        const novos: Order[] = items.map((p) => ({
          oid: String(n++),
          pid: p.id,
          email: input.email,
          cliente: input.nome || input.email,
          data: today(),
          valor: Math.round(p.preco * (1 - input.discountRate) * 100) / 100,
        }));
        return { ...s, orders: [...s.orders, ...novos], cart: [] };
      });
      return items;
    },
    [data.cart, data.products],
  );

  const askQuestion = useCallback((pid: string | null, q: string) => {
    setData((s) =>
      s.user
        ? {
            ...s,
            questions: [
              ...s.questions,
              {
                id: "q" + Date.now(),
                pid,
                autor: s.user.nome,
                email: s.user.email,
                q: q.trim(),
                a: "",
                status: "pending",
                publico: false,
                data: today(),
              },
            ],
          }
        : s,
    );
  }, []);

  const patchQuestion = useCallback((id: string, patch: Partial<Question>) => {
    setData((s) => ({ ...s, questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
  }, []);

  const answerQuestion = useCallback(
    (id: string, a: string, publico: boolean) => patchQuestion(id, { a: a.trim(), status: "answered", publico }),
    [patchQuestion],
  );

  const setQuestionPublic = useCallback(
    (id: string, publico: boolean) => patchQuestion(id, { publico }),
    [patchQuestion],
  );

  const saveProduct = useCallback((editId: string, d: ProductDraft) => {
    const preco = parseFloat(String(d.preco).replace(",", ".")) || 0;
    const incluso = d.incluso
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const patch = {
      nome: d.nome || "Novo projeto",
      tipo: d.tipo,
      cat: d.tipo === "App" ? ("apps" as const) : ("sites" as const),
      preco,
      resumo: d.resumo,
      incluso,
      ativo: d.ativo,
    };
    setData((s) => ({
      ...s,
      products:
        editId === NEW_PRODUCT
          ? [...s.products, { id: "p" + Date.now(), nota: "–", aval: 0, novo: true, tech: [], desc: [d.resumo], ...patch }]
          : s.products.map((p) => (p.id === editId ? { ...p, ...patch } : p)),
    }));
  }, []);

  return useMemo(
    () => ({
      ...data,
      hydrated,
      /** Produtos visíveis na loja (publicados). */
      published: data.products.filter((p) => p.ativo),
      addToCart,
      removeFromCart,
      login,
      logout,
      updateProfile,
      placeOrder,
      askQuestion,
      answerQuestion,
      setQuestionPublic,
      saveProduct,
    }),
    [data, hydrated, addToCart, removeFromCart, login, logout, updateProfile, placeOrder, askQuestion, answerQuestion, setQuestionPublic, saveProduct],
  );
}

type Store = ReturnType<typeof useStoreValue>;

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}

export function productName(products: Product[], id: string | null) {
  const p = products.find((x) => x.id === id);
  return p ? p.nome : "Geral";
}
