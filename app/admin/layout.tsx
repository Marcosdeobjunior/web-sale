import type { Metadata } from "next";

export const metadata: Metadata = { title: "Painel — Sóter" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
