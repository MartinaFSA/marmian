import Link from "next/link";

const CARDS = [
  {
    href: "/panel/donantes",
    title: "Donantes",
    description: "Lista de donantes, filtros y acciones de comunicación.",
  },
  {
    href: "/panel/organizacion",
    title: "Organización",
    description: "Editá los datos y redes de tu organización.",
  },
];

export default function PanelPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Panel</h1>
        <p className="text-neutral-500">Vista general de tu organización.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-1 rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-neutral-900"
          >
            <span className="text-lg font-semibold">{card.title}</span>
            <span className="text-sm text-neutral-500">{card.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
