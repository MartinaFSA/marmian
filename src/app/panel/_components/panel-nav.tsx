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
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
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
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
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
        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-900"
      >
        Salir
      </button>
    </header>
  );
}
