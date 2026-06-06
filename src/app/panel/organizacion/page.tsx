"use client";

import { useState } from "react";

// Datos MOCK de la organización (se reemplazan por la fila real de `organizations`
// cuando esté la base).
const MOCK_ORG = {
  name: "Manos a la Olla",
  category: "Asistencia alimentaria",
  description:
    "Cocinamos y repartimos viandas calientes en comedores del conurbano bonaerense.",
  poc: "Ana López",
  instagram: "@manosalaolla",
  facebook: "manosalaolla",
  linkedin: "",
  whatsapp: "1145678901",
  foundation_date: "2015-03-10",
};

type OrgForm = typeof MOCK_ORG;

const FIELDS: { key: keyof OrgForm; label: string; type?: string; textarea?: boolean }[] = [
  { key: "name", label: "Nombre" },
  { key: "category", label: "Categoría" },
  { key: "description", label: "Descripción", textarea: true },
  { key: "poc", label: "Persona de contacto" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "foundation_date", label: "Fecha de fundación", type: "date" },
];

export default function OrganizacionPage() {
  const [form, setForm] = useState<OrgForm>(MOCK_ORG);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof OrgForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: todavía no persiste a la base.
    setSaved(true);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Organización</h1>
        <p className="text-neutral-500">Editá los datos de tu organización.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {FIELDS.map((field) => (
          <label key={field.key} className="flex flex-col gap-1">
            <span className="text-sm text-neutral-700">{field.label}</span>
            {field.textarea ? (
              <textarea
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                rows={3}
                className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
              />
            ) : (
              <input
                type={field.type ?? "text"}
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
              />
            )}
          </label>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Guardar
          </button>
          {saved && (
            <span className="text-sm text-green-600">
              Guardado (placeholder, sin persistir).
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
