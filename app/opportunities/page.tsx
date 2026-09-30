"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  area: string | null;
  status: string | null;
  stage: string | null;
  projected_impact_mxn: number | null;
  created_at: string;
};

const areas = [["Quality", "Quality"], ["Production", "Production"], ["Supply", "Supply"]];

function formatImpact(value: number | null) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw userError || new Error("Inicia sesión para ver las oportunidades.");
        const { data: profile, error: profileError } = await supabase.from("profiles").select("organization_id").eq("id", user.id).maybeSingle();
        if (profileError) throw profileError;
        if (!profile?.organization_id) throw new Error("Tu usuario aún no está asociado a una organización.");
        const { data, error: queryError } = await supabase.from("opportunities").select("id, title, description, area, status, stage, projected_impact_mxn, created_at").eq("organization_id", profile.organization_id).order("created_at", { ascending: false });
        if (queryError) throw queryError;
        if (active) {
          setOrganizationId(profile.organization_id);
          setOpportunities((data || []) as Opportunity[]);
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las oportunidades.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
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
      const { data, error: insertError } = await supabase.from("opportunities").insert({
        organization_id: organizationId,
        created_by: user.id,
        title: String(formData.get("title") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        area: formData.get("area"),
        projected_impact_mxn: Number(formData.get("projected_impact_mxn") || 0),
        status: "active",
        stage: "Identificada",
      }).select("id, title, description, area, status, stage, projected_impact_mxn, created_at").single();
      if (insertError) throw insertError;
      setOpportunities((current) => [data as Opportunity, ...current]);
      form.reset();
      setNotice("Oportunidad creada correctamente.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "No se pudo crear la oportunidad.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div><p className="eyebrow">Cartera de valor</p><h1 className="mt-2 text-3xl font-bold">Oportunidades</h1><p className="mt-2 text-sm text-slate-600">Identifica problemas operativos y cuantifica el impacto posible.</p></div>
      <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Lista de oportunidades">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Todas las oportunidades</h2><span className="text-sm text-slate-500">{opportunities.length}</span></div>
          {loading ? <p className="panel p-6 text-sm text-slate-500">Cargando oportunidades…</p> : error && opportunities.length === 0 ? <p className="panel p-5 text-sm text-red-700">{error}</p> : opportunities.length === 0 ? <div className="panel p-7"><p className="font-semibold">Aún no hay oportunidades.</p><p className="mt-2 text-sm text-slate-500">Registra un reto de Quality, Production o Supply para comenzar.</p></div> : <div className="grid gap-3 sm:grid-cols-2">
            {opportunities.map((item) => <article className="panel flex min-h-52 flex-col p-5 transition hover:border-blue-300" key={item.id}>
              <div className="flex items-start justify-between gap-3"><span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">{item.area || "Industrial"}</span><span className="text-xs font-semibold capitalize text-slate-500">{item.stage || item.status || "Identificada"}</span></div>
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-600">{item.description || "Sin descripción adicional."}</p>
              <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4"><div><p className="text-xs text-slate-500">Impacto proyectado</p><p className="mt-1 font-bold text-blue-800">{formatImpact(item.projected_impact_mxn)}</p></div><Link aria-label={`Ver oportunidad ${item.title}`} className="text-sm font-bold text-blue-700 hover:underline" href={`/opportunity/${item.id}`}>Ver detalle →</Link></div>
            </article>)}
          </div>}
        </section>
        <aside className="panel p-5 lg:sticky lg:top-6">
          <p className="eyebrow">Captura inicial</p><h2 className="mt-2 text-xl font-bold">Nueva oportunidad</h2><p className="mt-2 text-sm text-slate-600">Define el reto operativo y su valor potencial.</p>
          <form className="mt-5 grid gap-4" onSubmit={handleCreate}>
            <label className="grid gap-1.5 text-sm font-semibold">Nombre<input className="field" maxLength={160} name="title" placeholder="Ej. Inspección visual de soldadura" required /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Área<select className="field" name="area">{areas.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="grid gap-1.5 text-sm font-semibold">Descripción<textarea className="field min-h-24 resize-y" maxLength={4000} name="description" placeholder="¿Qué sucede hoy y dónde ocurre?" /></label>
            <label className="grid gap-1.5 text-sm font-semibold">Impacto anual estimado (MXN)<input className="field" min="0" name="projected_impact_mxn" placeholder="0" step="1000" type="number" /></label>
            {error && <p aria-live="polite" className="text-sm text-red-700">{error}</p>}{notice && <p aria-live="polite" className="text-sm text-green-700">{notice}</p>}
            <button className="button-primary w-full disabled:opacity-60" disabled={saving || !organizationId} type="submit">{saving ? "Guardando…" : "Crear oportunidad"}</button>
          </form>
        </aside>
      </div>
    </main>
  );
}