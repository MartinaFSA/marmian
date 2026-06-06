"use client";

import { useState } from "react";
import type { Campaign } from "@/data/campaigns";

type Frequency = "once" | "monthly";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function DonateModal({
  campaign,
  onClose,
}: {
  campaign: Campaign;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [organization_id, setOrganizationId] = useState("");
  const [interests, setInterests] = useState("");

  const [frequency, setFrequency] = useState<Frequency>("once");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPay =
    isValidEmail(email) && phone.trim() !== "" && !!amount && amount > 0;

  const selectPreset = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const onCustomChange = (value: string) => {
    setCustomAmount(value);
    const parsed = Number(value);
    setAmount(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
  };

  const handlePay = async () => {
    if (!canPay) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        frequency === "monthly" ? "/api/mp/subscription" : "/api/mp/preference";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount,
          email: email.trim(),
          phone: phone.trim(),
          name: name.trim(),
          status: "activo",
          organization_id: organization_id || '21fd5d83-382c-434e-81da-149bf5a4d800',
          interests: interests || [],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }
      // Redirige al sandbox de Mercado Pago.
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Donar a ${campaign.title}`}
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Donar</h2>
            <p className="text-sm text-neutral-500">{campaign.title}</p>
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

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-700">
            E-mail <span className="text-red-500">*</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-700">
            Teléfono <span className="text-red-500">*</span>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="11 1234 5678"
            className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm text-neutral-700">Modalidad</legend>
          <div className="flex gap-2">
            {(["once", "monthly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={frequency === f}
                onClick={() => setFrequency(f)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${frequency === f
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 hover:border-neutral-900"
                  }`}
              >
                {f === "once" ? "Única vez" : "Mensual"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm text-neutral-700">Monto (ARS)</legend>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={amount === value && customAmount === ""}
                onClick={() => selectPreset(value)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${amount === value && customAmount === ""
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 hover:border-neutral-900"
                  }`}
              >
                ${value.toLocaleString("es-AR")}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            value={customAmount}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="Otro monto"
            className="rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {canPay && (
          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="rounded-lg bg-[#009ee3] px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Redirigiendo…" : "Donar con Mercado Pagoooo"}
          </button>
        )}
      </div>
    </div>
  );
}
