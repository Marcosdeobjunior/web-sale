"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** "Sobre" rola suavemente até a seção 04 da home (ou abre a home nela). */
export function AboutLink() {
  const pathname = usePathname();
  return (
    <Link
      href="/#sobre"
      onClick={(e) => {
        const el = document.getElementById("sobre");
        if (pathname === "/" && el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, "", "/#sobre");
        }
      }}
    >
      Sobre
    </Link>
  );
}
