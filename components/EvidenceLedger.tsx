"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const evidenceTypes = [
  ["observation", "Observación"],
  ["raw_data", "Datos crudos"],
  ["system_metric", "Métrica de sistema"],
  ["stakeholder_interview", "Entrevista con stakeholder"],
  ["financial_record", "Registro financiero"],
] as const;

const verificationStatuses = [
  ["hypothesis", "Hipótesis"],
  ["pending_validation", "Pendiente de validación"],
  ["verified", "Verificada"],
  ["refuted", "Refutada"],
] as const;

const statusLabels: Record<string, string> = Object.fromEntries(verificationStatuses);
const typeLabels: Record<string, string> = Object.fromEntries(evidenceTypes);

type Evidence = {
  id: string;
  claim: string;
  evidence_type: string;
  content: string;
  verification_status: string;
  created_at?: string;
};

type EvidenceLedgerProps = {
  opportunityId: string;
  organizationId: string;
};

export default function EvidenceLedger({ opportunityId, organizationId }: EvidenceLedgerProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvidence() {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("evidence_ledger")
          .select("id, claim, evidence_type, content, verification_status, created_at")
          .eq("opportunity_id", opportunityId)
          .eq("organization_id", organizationId)
          .order("created_at", { ascending: false });

        if (queryError) throw queryError;
        if (active) setEvidence((data || []) as Evidence[]);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las evidencias.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEvidence();
    return () => { active = false; };
  }, [opportunityId, organizationId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("Tu sesión expiró. Inicia sesión de nuevo.");

      const { data, error: insertError } = await supabase
        .from("evidence_ledger")
        .insert({
          opportunity_id: opportunityId,
          organization_id: organizationId,
          created_by: user.id,
          claim: String(formData.get("claim") || "").trim(),
          evidence_type: formData.get("evidence_type"),
          content: String(formData.get("content") || "").trim(),
          verification_status: formData.get("verification_status"),
        })
        .select("id, claim, evidence_type, content, verification_status, created_at")
        .single();

      if (insertError) throw insertError;
      setEvidence((current) => [data as Evidence, ...current]);
      form.reset();
      setNotice("Evidencia registrada.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar la evidencia.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="evidence-heading" className="space-y-6">
      <div>
        <p className="eyebrow">Trazabilidad de hipótesis</p>
        <h2 className="mt-2 text-2xl font-bold" id="evidence-heading">Evidence Ledger</h2>
        <p className="mt-2 text-sm text-slate-600">Registra afirmaciones y conserva su estado de validación.</p>
      </div>

      <form className="panel grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Afirmación (claim)
          <input className="field" maxLength={240} name="claim" placeholder="Ej. La inspección visual genera retrabajo en el turno nocturno" required />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Tipo de evidencia
          <select className="field" defaultValue="observation" name="evidence_type">{evidenceTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Estado de verificación
          <select className="field" defaultValue="hypothesis" name="verification_status">{verificationStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Contenido y fuente
          <textarea className="field min-h-24 resize-y" maxLength={5000} name="content" placeholder="Anota el hallazgo, contexto y fuente de la evidencia" required />
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button className="button-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={saving} type="submit">{saving ? "Guardando…" : "Registrar evidencia"}</button>
          {notice && <p aria-live="polite" className="text-sm font-semibold text-green-700">{notice}</p>}
          {error && <p aria-live="polite" className="text-sm text-red-700">{error}</p>}
        </div>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Historial de evidencias</h3>
        {loading ? <p className="py-8 text-sm text-slate-500">Cargando evidencias…</p> : evidence.length === 0 ? <p className="panel p-6 text-sm text-slate-500">Todavía no hay evidencias para esta oportunidad.</p> : (
          <ul className="space-y-3">
            {evidence.map((item) => <li className="panel p-5" key={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="max-w-3xl font-bold text-slate-900">{item.claim}</h4>
                <span className={`rounded px-2.5 py-1 text-xs font-bold ${`status-${item.verification_status}`}`}>{statusLabels[item.verification_status] || item.verification_status}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.content}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>{typeLabels[item.evidence_type] || item.evidence_type}</span>{item.created_at && <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString("es-MX")}</time>}</div>
            </li>)}
          </ul>
        )}
      </div>
    </section>
  );
}