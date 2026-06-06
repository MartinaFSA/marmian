"use client";

import { useState } from "react";
import { BAJA_REASON_LABELS, type BajaReason } from "@/data/mock-donors";

// Formulario público de baja. Captura el motivo ("tipo de baja"), que el panel
// usa para segmentar comunicaciones. Placeholder: el submit no persiste todavía.
export default function BajaPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<BajaReason | "">("");
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const canSubmit = email.trim() !== "" && reason !== "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/unsubscribe",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            reason,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudo procesar la baja"
        );
      }

      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado"
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Baja registrada</h1>
        <p className="text-neutral-600">
          Lamentamos que te vayas. Gracias por tu apoyo (placeholder, sin persistir).
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-5 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Darme de baja</h1>
        <p className="text-sm text-neutral-500">
          Contanos el motivo para poder mejorar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-700">
            E-mail <span className="text-red-500">*</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm text-neutral-700">
            Motivo de baja <span className="text-red-500">*</span>
          </legend>
          {(Object.keys(BAJA_REASON_LABELS) as BajaReason[]).map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
              />
              {BAJA_REASON_LABELS[r]}
            </label>
          ))}
        </fieldset>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-700">Comentario (opcional)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Darme de baja"}
        </button>
      </form>
    </main>
  );
}
