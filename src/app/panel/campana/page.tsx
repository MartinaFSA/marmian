"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mockDonors } from "@/data/mock-donors";

export default function CampanaPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("Apoyemos juntos una nueva comunidad");
  const [text, setText] = useState(
    "Esta campaña ayuda a financiar becas educativas y acceso a herramientas digitales. Comparte y dona para que más niños puedan aprender."
  );
  const router = useRouter();
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSelected = useMemo(
    () => selectedRecipients.length === mockDonors.length,
    [selectedRecipients.length],
  );

  const handleSend = async () => {
    if (selectedRecipients.length === 0) {
      alert("Seleccioná al menos un destinatario antes de enviar.");
      return;
    }

    setSending(true);
    setError(null);

    const response = await fetch("/api/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        text,
        recipientIds: selectedRecipients,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setSending(false);

    if (!response.ok) {
      setError(payload.error || "Error al enviar el mensaje.");
      return;
    }

    alert("Enviado");
    router.push("/panel");
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((recipientId) => recipientId !== id) : [...prev, id],
    );
  };

  const toggleAllRecipients = () => {
    setSelectedRecipients((prev) =>
      prev.length === mockDonors.length ? [] : mockDonors.map((donor) => donor.id),
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Campaña</h1>
        <p className="text-neutral-500">
          Diseñá tu mensaje y elegí a quién se lo vas a mandar. Usá el botón siguiente para avanzar.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Paso {step} de 2</p>
                <h2 className="text-lg font-semibold text-neutral-900">
                  {step === 1 ? "Detalles de la campaña" : "Elegir destinatarios"}
                </h2>
              </div>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-neutral-900"
                >
                  Volver
                </button>
              )}
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-neutral-700" htmlFor="campaign-title">
                    Título
                  </label>
                  <input
                    id="campaign-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Título de la campaña"
                    className="w-full rounded-2xl border border-neutral-300 bg-white p-4 text-base text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-neutral-700" htmlFor="campaign-text">
                    Texto
                  </label>
                  <textarea
                    id="campaign-text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Texto de la campaña"
                    rows={10}
                    className="w-full rounded-2xl border border-neutral-300 bg-white p-4 text-base text-neutral-900 outline-none transition focus:border-neutral-900 focus:bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Siguiente
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-300 bg-white p-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Destinatarios</p>
                    <p className="text-sm text-neutral-500">
                      Elegí a quién se enviará este mensaje. Puedes seleccionar todos.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAllRecipients}
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    Seleccionar todos
                  </label>
                </div>

                <div className="space-y-3 rounded-2xl border border-neutral-300 bg-white p-4">
                  {mockDonors.map((donor) => (
                    <label
                      key={donor.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-900"
                    >
                      <span className="flex-1 text-sm text-neutral-900">
                        <span className="font-semibold">{donor.name}</span>
                        <span className="block text-xs text-neutral-500">{donor.email}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(donor.id)}
                        onChange={() => toggleRecipient(donor.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-neutral-600">
                    {selectedRecipients.length} de {mockDonors.length} destinatarios seleccionados
                  </p>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={selectedRecipients.length === 0 || sending}
                  >
                    {sending ? "Enviando..." : "Enviar"}
                  </button>
                </div>
                {error ? (
                  <p className="text-sm text-red-500">{error}</p>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-3xl border border-neutral-700 bg-neutral-900 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Vista previa del email</p>
                <p className="text-sm text-neutral-300">Asunto: {title || "Título de campaña"}</p>
              </div>

              <div className="rounded-[2rem] border border-neutral-800 bg-neutral-900 p-5 shadow-[0_20px_80px_-55px_rgba(0,0,0,0.6)]">
                <div className="space-y-4 rounded-[1.5rem] bg-neutral-950 p-5 text-neutral-100 shadow-sm">
                  <div className="rounded-3xl bg-neutral-900 px-4 py-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
                    De: <span className="text-white">info@marmian.org</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-2xl font-semibold text-white">{title || "Título de campaña"}</div>
                    <div className="text-sm leading-7 text-neutral-300 whitespace-pre-line">
                      {text || "Describe aquí tu campaña para motivar a quienes reciban el mail."}
                    </div>
                  </div>

                  {step === 2 ? (
                    <div className="mt-4 rounded-3xl bg-neutral-900 p-4 text-sm text-neutral-400">
                      {selectedRecipients.length} destinatario{selectedRecipients.length === 1 ? "" : "s"} seleccionado{selectedRecipients.length === 1 ? "" : "s"}.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
              <p className="font-medium text-white">Consejos para el email</p>
              <p className="mt-2">- Usa un asunto claro y emocional.</p>
              <p>- Comunica el impacto con un mensaje breve.</p>
              <p>- Incluye un botón con llamado a la acción.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
