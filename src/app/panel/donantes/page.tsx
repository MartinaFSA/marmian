"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatLastCharge,
  formatAmount,
  STATUS_LABELS,
  DONATION_TYPE_LABELS,
  BAJA_REASON_LABELS,
  type MockDonor,
  type DonorStatus,
  type DonationType,
  type BajaReason,
} from "@/data/mock-donors";
import DonorActionModal from "./_components/donor-action-modal";

const STATUS_STYLES: Record<DonorStatus, string> = {
  activo: "bg-green-100 text-green-800",
  inactivo: "bg-neutral-200 text-neutral-700",
  potencial: "bg-blue-100 text-blue-800",
  baja: "bg-red-100 text-red-800",
};

type StatusFilter = DonorStatus | "todos";
type TypeFilter = DonationType | "todos";
type BajaFilter = BajaReason | "todos";

// Presets que setean combinaciones de filtros de una sola vez.
const PRESETS: { label: string; status: StatusFilter; type: TypeFilter }[] = [
  { label: "Activos con suscripción", status: "activo", type: "mensual" },
  { label: "De baja", status: "baja", type: "todos" },
  { label: "Interesados", status: "potencial", type: "todos" },
];

export default function DonantesPage() {
  const [donors, setDonors] = useState<MockDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("todos");
  const [bajaFilter, setBajaFilter] = useState<BajaFilter>("todos");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalDonors, setModalDonors] = useState<MockDonor[] | null>(null);

  // Cargar los donantes desde Supabase (antes era el array mock).
  useEffect(() => {
    fetch("/api/donantes")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: MockDonor[]) => setDonors(data))
      .catch(() => setDonors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      donors.filter((d) => {
        if (statusFilter !== "todos" && d.status !== statusFilter) return false;
        if (typeFilter !== "todos" && d.donationType !== typeFilter) return false;
        if (bajaFilter !== "todos" && d.bajaReason !== bajaFilter) return false;
        return true;
      }),
    [donors, statusFilter, typeFilter, bajaFilter],
  );

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((d) => selected.has(d.id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        filtered.forEach((d) => next.delete(d.id));
      } else {
        filtered.forEach((d) => next.add(d.id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetFilters = () => {
    setStatusFilter("todos");
    setTypeFilter("todos");
    setBajaFilter("todos");
  };

  const applyPreset = (status: StatusFilter, type: TypeFilter) => {
    setStatusFilter(status);
    setTypeFilter(type);
    setBajaFilter("todos");
  };

  const selectedDonors = donors.filter((d) => selected.has(d.id));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Donantes</h1>
        <p className="text-neutral-500">
          {loading
            ? "Cargando…"
            : `${filtered.length} de ${donors.length} donantes`}
        </p>
      </div>

      {/* Filtros predefinidos + selects */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => {
          const active =
            statusFilter === preset.status && typeFilter === preset.type;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.status, preset.type)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 hover:border-neutral-900"
              }`}
            >
              {preset.label}
            </button>
          );
        })}

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-900"
        >
          <option value="todos">Tipo: todos</option>
          <option value="mensual">Mensual</option>
          <option value="unica">Única vez</option>
        </select>

        <select
          value={bajaFilter}
          onChange={(e) => setBajaFilter(e.target.value as BajaFilter)}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-neutral-900"
        >
          <option value="todos">Tipo de baja: todos</option>
          {(Object.keys(BAJA_REASON_LABELS) as BajaReason[]).map((r) => (
            <option key={r} value={r}>
              {BAJA_REASON_LABELS[r]}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 underline hover:text-neutral-900"
        >
          Limpiar
        </button>
      </div>

      {/* Barra de acciones masivas */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-neutral-900 bg-neutral-50 px-4 py-3">
          <span className="text-sm font-medium">
            {selected.size} seleccionado{selected.size === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModalDonors(selectedDonors)}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Enviar comunicación
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
            >
              Deseleccionar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="px-3 py-3">Nombre</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Teléfono</th>
              <th className="px-3 py-3">Tipo</th>
              <th className="px-3 py-3">Monto</th>
              <th className="px-3 py-3">Último cobro</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(d.id)}
                    onChange={() => toggleOne(d.id)}
                    aria-label={`Seleccionar ${d.name}`}
                  />
                </td>
                <td className="px-3 py-3 font-medium text-neutral-900">{d.name}</td>
                <td className="px-3 py-3 text-neutral-600">{d.email}</td>
                <td className="px-3 py-3 text-neutral-600">{d.phone}</td>
                <td className="px-3 py-3 text-neutral-600">
                  {d.donationType ? DONATION_TYPE_LABELS[d.donationType] : "—"}
                </td>
                <td className="px-3 py-3 text-neutral-600">{formatAmount(d.amount)}</td>
                <td className="px-3 py-3 text-neutral-600">
                  {formatLastCharge(d.lastChargeAt)}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[d.status]}`}
                  >
                    {STATUS_LABELS[d.status]}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setModalDonors([d])}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-900"
                  >
                    Acciones
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-neutral-500">
                  No hay donantes para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-400">
        El formulario público de baja está en{" "}
        <Link href="/cancelar-suscripcion" className="underline">
          /cancelar-suscripcion
        </Link>
        .
      </p>

      {modalDonors && (
        <DonorActionModal
          donors={modalDonors}
          onClose={() => setModalDonors(null)}
        />
      )}
    </div>
  );
}
