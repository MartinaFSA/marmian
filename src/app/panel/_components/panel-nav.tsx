"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/panel", label: "Panel" },
  { href: "/panel/donantes", label: "Donantes" },
  { href: "/panel/organizacion", label: "Organización" },
  { href: "/panel/campana", label: "Campaña" },
];

export default function PanelNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/ingresar");
    router.refresh();
  };

  return (
    <header id="panel-header" className="bg-impacta flex items-center justify-between border-b border-neutral-200 px-6 py-4">
      <nav className="flex items-center gap-1">
        {LINKS.map((link) => {
          const active =
            link.href === "/panel"
              ? pathname === "/panel"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-impacta-wh-faded text-white"
                  : "text-impacta-wh hover:bg-impacta-wh-faded"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border bg-white border-neutral-300 px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-impacta-wh hover:bg-impacta hover:text-impacta-wh"
      >
        Salir
      </button>
    </header>
  );
}
