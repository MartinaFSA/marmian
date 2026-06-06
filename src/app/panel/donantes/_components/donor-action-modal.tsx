"use client";

import { useState } from "react";
import type { MockDonor } from "@/data/mock-donors";
import { getSegment, getTemplate, SEGMENT_LABELS } from "@/data/message-templates";
import type { Segment } from "@/data/message-templates";

// Modal de acciones de comunicación. Funciona tanto para un donante (acción de
// fila) como para una selección (acción masiva). El envío real está stubbeado:
// solo confirma a cuántos se enviaría. Reemplazar el handler cuando se integre
// el proveedor de email / WhatsApp.
export default function DonorActionModal({
  donors,
  onClose,
}: {
  donors: MockDonor[];
  onClose: () => void;
}) {
  const [sent, setSent] = useState<string | null>(null);

  // Plantilla de ejemplo por cada segmento presente en la selección.
  const segments = Array.from(new Set(donors.map(getSegment))) as Segment[];
  const samplesBySegment = segments.map((seg) => ({
    seg,
    count: donors.filter((d) => getSegment(d) === seg).length,
    sample: getTemplate(donors.find((d) => getSegment(d) === seg)!),
  }));

  const handleSend = (channel: "email" | "whatsapp") => {
    const label = channel === "email" ? "email" : "WhatsApp";
    setSent(`Se enviaría por ${label} a ${donors.length} donante(s) (placeholder, sin envío real).`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Acciones de comunicación"
        className="flex w-full max-w-lg flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Enviar comunicación</h2>
            <p className="text-sm text-neutral-500">
              {donors.length} donante{donors.length === 1 ? "" : "s"} seleccionado
              {donors.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-2xl leading-none text-neutral-400 hover:text-neutral-700"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-neutral-700">
            Mensaje sugerido por segmento
          </span>
          {samplesBySegment.map(({ seg, count, sample }) => (
            <div key={seg} className="rounded-lg border border-neutral-200 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                {SEGMENT_LABELS[seg]} · {count}
              </p>
              <p className="text-sm text-neutral-800">{sample}</p>
            </div>
          ))}
        </div>

        {sent ? (
          <p className="text-sm text-green-600">{sent}</p>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSend("email")}
              className="flex-1 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Enviar email
            </button>
            <button
              type="button"
              onClick={() => handleSend("whatsapp")}
              className="flex-1 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Enviar WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
