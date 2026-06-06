"use client";

import { useEffect, useState } from "react";

// Datos reales de la organización del usuario logueado. Se leen/escriben en la
// tabla `organizations` (Supabase) vía /api/organizacion.
type OrgForm = {
  name: string;
  category: string;
  description: string;
  poc: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  whatsapp: string;
  foundation_date: string;
};

const EMPTY_ORG: OrgForm = {
  name: "",
  category: "",
  description: "",
  poc: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  whatsapp: "",
  foundation_date: "",
};

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
  const [form, setForm] = useState<OrgForm>(EMPTY_ORG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar la fila real de la organización.
  useEffect(() => {
    fetch("/api/organizacion")
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudo cargar la organización.");
        return res.json();
      })
      .then((data) => {
        setForm({
          ...EMPTY_ORG,
          ...Object.fromEntries(
            Object.keys(EMPTY_ORG).map((k) => [k, data?.[k] ?? ""]),
          ),
          // foundation_date viene como timestamptz; el input date espera YYYY-MM-DD.
          foundation_date: data?.foundation_date
            ? String(data.foundation_date).slice(0, 10)
            : "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof OrgForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/organizacion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo guardar.");
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl text-neutral-500">Cargando…</div>
    );
  }

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
            disabled={saving}
            className="rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          {saved && (
            <span className="text-sm text-green-600">Guardado.</span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}
