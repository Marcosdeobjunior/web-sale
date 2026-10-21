import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-barlow" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-barlow-condensed" });

export const metadata: Metadata = {
  title: "Sóter — sites e apps prontos para o seu negócio",
  description: "Projetos completos, testados e com guia de instalação. Você compra, baixa e coloca no ar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <StoreProvider>
          <div className="shell">
            <Header />
            <main className="container">{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
