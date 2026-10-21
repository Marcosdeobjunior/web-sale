import Link from "next/link";
import { config } from "@/lib/config";
import { AboutLink } from "./AboutLink";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-brand">Sóter</span>
        <Link href="/projetos">Projetos</Link>
        <AboutLink />
        <a href={`mailto:${config.contactEmail}`}>Contato</a>
        <span style={{ marginLeft: "auto" }}>© 2026 Sóter</span>
      </div>
    </footer>
  );
}
