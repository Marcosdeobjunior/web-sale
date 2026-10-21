import { config } from "./config";

export const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const today = () => new Date().toLocaleDateString("pt-BR");

export const pixPrice = (preco: number) =>
  Math.round(preco * (1 - config.pixDiscountRate) * 100) / 100;

export const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

export const pixPercentLabel = `${Math.round(config.pixDiscountRate * 100)}%`;
