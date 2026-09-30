import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import EvidenceLedger from "@/components/EvidenceLedger";
import { createClient } from "@/lib/supabase/server";

type OpportunityPageProps = { params: Promise<{ id: string }> };

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).maybeSingle();
  const organizationId = profile?.organization_id as string | undefined;
  if (!organizationId) notFound();

  const { data: opportunity, error } = await supabase.from("opportunities")
    .select("id, title, description, area, status, stage, projected_impact_mxn, created_at")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .maybeSingle();
  if (error || !opportunity) notFound();

  const impact = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(Number(opportunity.projected_impact_mxn || 0));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link className="text-sm font-semibold text-blue-700 hover:underline" href="/opportunities">← Volver a oportunidades</Link>
      <section className="mt-5 border-b border-slate-200 pb-7">
        <div className="flex flex-wrap items-start justify-between gap-5"><div className="max-w-3xl"><p className="eyebrow">{opportunity.area || "Oportunidad industrial"} · {opportunity.stage || opportunity.status || "Identificada"}</p><h1 className="mt-2 text-3xl font-bold">{opportunity.title}</h1><p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{opportunity.description || "Esta oportunidad todavía no tiene una descripción."}</p></div><div className="panel min-w-48 p-4"><p className="text-xs font-semibold text-slate-500">Impacto proyectado</p><p className="mt-2 text-2xl font-bold text-blue-800">{impact}</p><p className="mt-1 text-xs text-slate-500">MXN anuales</p></div></div>
      </section>
      <div className="mt-8 max-w-4xl"><EvidenceLedger opportunityId={String(opportunity.id)} organizationId={organizationId} /></div>
    </main>
  );
}