"use client";

export type PaymentResult = "approved" | "rejected" | "pending" | "authorized";

const COPY: Record<
  PaymentResult,
  { title: string; message: string; tone: "ok" | "bad" | "wait" }
> = {
  approved: {
    title: "¡Gracias por tu donación!",
    message: "Tu pago fue aprobado con éxito.",
    tone: "ok",
  },
  authorized: {
    title: "¡Suscripción activada!",
    message: "Tu donación mensual quedó autorizada. ¡Gracias!",
    tone: "ok",
  },
  pending: {
    title: "Pago pendiente",
    message: "Tu pago está en proceso. Te avisaremos cuando se acredite.",
    tone: "wait",
  },
  rejected: {
    title: "El pago fue rechazado",
    message: "No pudimos procesar tu donación. Probá de nuevo.",
    tone: "bad",
  },
};

export default function ResultModal({
  result,
  onClose,
}: {
  result: PaymentResult;
  onClose: () => void;
}) {
  const { title, message, tone } = COPY[result];
  const toneClass =
    tone === "ok"
      ? "text-green-600"
      : tone === "bad"
        ? "text-red-600"
        : "text-amber-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-2xl font-bold tracking-tight ${toneClass}`}>
          {title}
        </h2>
        <p className="text-neutral-700">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 self-center rounded-lg bg-neutral-900 px-6 py-2.5 text-base font-medium text-white hover:opacity-90"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
