import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const pipelineStages = [
  "Identificada",
  "Evaluación inicial",
  "Priorizada",
  "En medición",
  "Caso de negocio",
  "Piloto aprobado",
  "En validación",
  "Escalada",
];

function amount(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).maybeSingle();
  const organizationId = profile?.organization_id as string | undefined;
  if (!organizationId) {
    return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="eyebrow">Espacio de trabajo</p><h1 className="mt-2 text-3xl font-bold">Dashboard</h1><p className="mt-5 panel p-5 text-slate-700">Tu perfil aún no está asociado a una organización. Revisa tu registro o contacta al administrador.</p></main>;
  }

  const [opportunitiesResult, evidenceResult, pilotsResult, validationsResult] = await Promise.all([
    supabase.from("opportunities").select("id, status, stage, projected_impact_mxn").eq("organization_id", organizationId),
    supabase.from("evidence_ledger").select("id, verification_status").eq("organization_id", organizationId),
    supabase.from("pilots").select("id, status").eq("organization_id", organizationId),
    supabase.from("economic_validations").select("id, status, validated_benefit_mxn, actual_benefit_mxn").eq("organization_id", organizationId),
  ]);

  const opportunities = opportunitiesResult.data || [];
  const evidences = evidenceResult.data || [];
  const pilots = pilotsResult.data || [];
  const validations = validationsResult.data || [];
  const activeOpportunities = opportunities.filter((item) => !["closed", "completed", "cancelled"].includes(String(item.status || "").toLowerCase()));
  const activePilots = pilots.filter((item) => !["completed", "closed", "cancelled"].includes(String(item.status || "").toLowerCase()));
  const projectedImpact = opportunities.reduce((sum, item) => sum + Number(item.projected_impact_mxn || 0), 0);
  const validatedBenefit = validations.reduce((sum, item) => sum + Number(item.validated_benefit_mxn || item.actual_benefit_mxn || 0), 0);
  const stages = pipelineStages.map((name) => ({ name, count: opportunities.filter((item) => String(item.stage || "").toLowerCase() === name.toLowerCase()).length }));

  const metrics = [
    { label: "Oportunidades activas", value: String(activeOpportunities.length), unit: "en seguimiento" },
    { label: "Evidencias verificadas", value: String(evidences.filter((item) => item.verification_status === "verified").length), unit: `de ${evidences.length} registradas` },
    { label: "Pilots activos", value: String(activePilots.length), unit: "en ejecución" },
    { label: "Impacto proyectado", value: amount(projectedImpact), unit: "MXN estimados" },
    { label: "Beneficio validado", value: amount(validatedBenefit), unit: "MXN confirmados" },
  ];
  const dataError = [opportunitiesResult.error, evidenceResult.error, pilotsResult.error, validationsResult.error].some(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Vista general</p><h1 className="mt-2 text-3xl font-bold">Dashboard</h1><p className="mt-2 text-sm text-slate-600">Desempeño y validación de valor de tu organización.</p></div><Link className="button-primary" href="/opportunities">+ Nueva oportunidad</Link></div>
      {dataError && <p className="mt-5 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Algunas métricas no están disponibles. Verifica el esquema y las políticas de acceso de Supabase.</p>}
      <section aria-label="Métricas principales" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => <article className="panel min-w-0 p-4" key={metric.label}><p className="text-sm font-medium text-slate-500">{metric.label}</p><p className={`mt-4 break-words text-2xl font-bold ${index > 2 ? "text-blue-800" : "text-slate-900"}`}>{metric.value}</p><p className="mt-1 text-xs text-slate-500">{metric.unit}</p></article>)}
      </section>
      <section className="mt-8">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Ciclo de valor</p><h2 className="mt-2 text-xl font-bold">Pipeline de oportunidades</h2></div><span className="text-sm text-slate-500">{opportunities.length} en total</span></div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {stages.map((stage, index) => <article className="panel min-h-32 p-3" key={stage.name}><div className="flex items-center justify-between"><span className="text-xs font-bold text-blue-700">0{index + 1}</span><span className="grid size-7 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-800">{stage.count}</span></div><h3 className="mt-5 text-sm font-bold leading-5">{stage.name}</h3><div className="mt-3 h-1 rounded bg-slate-100"><div className="h-1 rounded bg-blue-600" style={{ width: `${stage.count > 0 ? Math.max(20, Math.min(100, (stage.count / Math.max(opportunities.length, 1)) * 100)) : 0}%` }} /></div></article>)}
        </div>
      </section>
      <section className="mt-8 panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"><div><h2 className="font-bold">Oportunidades recientes</h2><p className="mt-1 text-sm text-slate-500">Continúa el seguimiento de los casos activos.</p></div><Link className="text-sm font-bold text-blue-700 hover:underline" href="/opportunities">Ver todas →</Link></div>
        {activeOpportunities.length === 0 ? <p className="p-6 text-sm text-slate-500">Aún no hay oportunidades. <Link className="font-bold text-blue-700" href="/opportunities">Registra la primera.</Link></p> : <ul className="divide-y divide-slate-100">{activeOpportunities.slice(0, 5).map((item) => <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" key={item.id}><Link className="font-semibold text-slate-800 hover:text-blue-700" href={`/opportunity/${item.id}`}>Oportunidad {String(item.id).slice(0, 8)}</Link><span className="text-sm text-slate-500">{String(item.stage || item.status || "Identificada")}</span></li>)}</ul>}
      </section>
    </main>
  );
}