"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { orgTypes } from "@/data/organization-types";
import { fetchOngs, recommendOngs, type Ong } from "@/lib/organizations";
import { campaignsByOng, type Campaign } from "@/data/campaigns";
import { readOnboarding, saveOnboarding } from "@/lib/onboarding";
import DonateModal from "./donate-modal";
import ResultModal, { type PaymentResult } from "./result-modal";

// Lee el resultado que Mercado Pago adjunta al volver a back_url.
function parseMpReturn(): PaymentResult | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("mp") !== "return") return null;

  // Suscripción (preapproval): vuelve con preapproval_id.
  if (params.get("preapproval_id")) return "authorized";

  const status = params.get("status") ?? params.get("collection_status");
  switch (status) {
    case "approved":
      return "approved";
    case "pending":
    case "in_process":
      return "pending";
    case "rejected":
    case "failure":
    case "null":
      return "rejected";
    default:
      return "rejected";
  }
}

export default function OnboardingFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<number[]>([]);
  const [interestedOngIds, setInterestedOngIds] = useState<number[]>([]);
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [donateCampaign, setDonateCampaign] = useState<Campaign | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    "/iStock-2171791895.jpg",
    "/iStock-2199033973.jpg",
    "/iStock-2205572960.jpg",
    "/iStock-2258089084.jpg",
  ];

  // Cargar las ONGs desde Supabase (antes era un array estático).
  useEffect(() => {
    fetchOngs().then(setOngs);
  }, []);

  // Hidratar desde localStorage y detectar retorno de Mercado Pago.
  useEffect(() => {
    const stored = readOnboarding();
    setName(stored.name);
    setInterests(stored.interests);

    const mpResult = parseMpReturn();
    if (mpResult) {
      setResult(mpResult);
      // Si volvió de MP, ya pasó el paso 1.
      if (stored.name.trim().length >= 2 && stored.interests.length > 0) {
        setStep(2);
      }
      // Limpia los query params de MP de la URL.
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
  const images = 4;

  const interval = setInterval(() => {
    setActiveSlide((prev) => (prev + 1) % images);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  // Persistir nombre e intereses.
  useEffect(() => {
    saveOnboarding({ name, interests });
  }, [name, interests]);

  const toggleInterest = (id: number) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleInterestedOng = (id: number) => {
    setInterestedOngIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const canContinue = name.trim().length >= 2 && interests.length >= 1;
  const recommended = useMemo(
    () => recommendOngs(ongs, interests),
    [ongs, interests],
  );

  const interestedCampaigns = useMemo(
    () =>
      interestedOngIds.flatMap((ongId) =>
        campaignsByOng(ongId).map((campaign) => ({
          campaign,
          ongId,
        })),
      ),
    [interestedOngIds],
  );

  // ---- Columna izquierda ----
  const left =
    step === 1 ? (
      <div className="flex w-full flex-col gap-8">
        <h1 className="text-4xl font-bold tracking-tight">Bienvenidx a Impacta</h1>

        <label className="flex flex-col gap-2">
          <span className="text-lg text-neutral-700">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b border-neutral-900 bg-transparent pb-2 text-lg outline-none focus:border-blue-500"
          />
        </label>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-lg text-neutral-700">
            ¿A qué organizaciones te gustaría ayudar?
          </legend>
          <div className="flex flex-wrap gap-2">
            {orgTypes.map((org) => {
              const selected = interests.includes(org.id);
              return (
                <button
                  key={org.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleInterest(org.id)}
                  className={`rounded-lg border px-4 py-2 text-base transition-colors ${
                    selected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 text-neutral-900 hover:border-neutral-900"
                  }`}
                >
                  {org.cat}
                </button>
              );
            })}
          </div>
        </fieldset>

        {canContinue && (
          <button
            type="button"
            onClick={() => {
              saveOnboarding({ name: name.trim(), interests });
              setStep(2);
            }}
            className="self-start rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Continuar
          </button>
        )}
      </div>
    ) : (
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Hola {name.trim()}!
          </h1>
          <p className="text-lg text-neutral-700">
            Estas son algunas de las ONG&apos;s que creemos que te pueden
            interesar:
          </p>
        </header>

        <ul className="flex flex-col">
          {recommended.map((ong) => {
            const interested = interestedOngIds.includes(ong.id);
            return (
              <li
                key={ong.id}
                className="flex items-start gap-4 border-b border-neutral-900 py-5"
              >
                <div
                  aria-hidden
                  className="h-16 w-16 shrink-0 rounded-full bg-neutral-300"
                />
                <div className="flex flex-1 flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl">{ong.name}</h2>
                    <p className="text-sm">
                      <span className="font-bold">Alcance:</span> {ong.scope}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Campañas activas:</span>{" "}
                      {ong.activeCampaigns}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={interested}
                    onClick={() => toggleInterestedOng(ong.id)}
                    className={`text-base underline-offset-2 hover:underline ${
                      interested ? "font-semibold text-neutral-900" : "text-neutral-900"
                    }`}
                  >
                    {interested ? "✓ Te interesa" : "Me interesa"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="self-start text-base text-neutral-500 underline-offset-2 hover:underline"
        >
          Volver
        </button>
      </div>
    );

  // ---- Columna derecha ----
  const showCampaigns = step === 2 && interestedCampaigns.length > 0;

  const right = showCampaigns ? (
    <div className="flex w-full flex-col gap-4 py-8 md:py-12 md:px-20">
      <h2 className="text-2xl font-bold tracking-tight">Campañas activas</h2>
      <ul className="flex flex-col gap-3">
        {interestedCampaigns.map(({ campaign }) => (
          <li
            key={campaign.id}
            className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <h3 className="text-lg font-semibold">{campaign.title}</h3>
            <p className="text-sm text-neutral-600">{campaign.summary}</p>
            <div className="mt-1 flex items-center gap-4">
              <Link
                href={`/organizaciones/iniciativa?campaign=${campaign.id}`}
                className="text-sm text-blue-600 underline-offset-2 hover:underline"
              >
                Ver iniciativa
              </Link>
              <button
                type="button"
                onClick={() => setDonateCampaign(campaign)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Donar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="imagen-completa">
      {slides.map((src, index) => (
        <img
          key={src}
          src={src}
          alt="Foto(s) stock"
          className={`rounded-3xl ${
            activeSlide === index ? "active-slide" : ""
          }`}
        />
      ))}
    </div>
  );

  return (
    <>
      <main
        id="onboarding-page"
        className="grid min-h-screen grid-cols-1 gap-6 md:grid-cols-2"
      >
        <section className="flex items-start py-8 md:py-12 md:px-20">
          <div className="w-full max-w-md">{left}</div>
        </section>

        <aside
          className={`flex ${
            showCampaigns
              ? "items-start"
              : "min-h-64 items-center justify-center  bg-neutral-200"
          }`}
        >
          {right}
        </aside>
      </main>

      {donateCampaign && (
        <DonateModal
          campaign={donateCampaign}
          onClose={() => setDonateCampaign(null)}
        />
      )}

      {result && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}
    </>
  );
}
