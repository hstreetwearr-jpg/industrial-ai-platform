"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureOrganization } from "@/lib/supabase/organization";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [configurationMissing, setConfigurationMissing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      if (signInError) throw signInError;
      if (data.user?.user_metadata?.organization_name) await ensureOrganization(supabase, data.user);
      const nextPath = searchParams.get("next");
      router.replace(nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard");
      router.refresh();
    } catch (signInError) {
      if (signInError instanceof Error && signInError.message.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")) setConfigurationMissing(true);
      setError(signInError instanceof Error ? signInError.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:gap-20 lg:px-8">
      <section className="hidden border-r border-slate-200 pr-16 lg:block"><p className="eyebrow">Industrial AI Performance System</p><h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight">Decisiones de planta, respaldadas por evidencia.</h1><p className="mt-5 max-w-lg leading-7 text-slate-600">Continúa el trabajo de tu equipo: oportunidades, validaciones económicas y pilotos en un solo lugar.</p></section>
      <section className="mx-auto w-full max-w-md">
        <p className="eyebrow">Bienvenido de vuelta</p><h1 className="mt-2 text-3xl font-bold">Iniciar sesión</h1><p className="mt-2 text-slate-600">Accede al espacio de trabajo de tu organización.</p>
        {searchParams.get("error") === "configuration" && <p className="mt-5 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Configura la clave pública de Supabase en `.env.local` para habilitar el acceso.</p>}
        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-sm font-semibold">Correo electrónico<input autoComplete="email" className="field" name="email" required type="email" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Contraseña<input autoComplete="current-password" className="field" minLength={6} name="password" required type="password" /></label>
          {error && <p aria-live="polite" className="text-sm text-red-700">{error}</p>}
          {configurationMissing && <p className="text-sm text-slate-600">Consulta `.env.example` para las variables requeridas.</p>}
          <button className="button-primary mt-1 w-full disabled:opacity-60" disabled={loading} type="submit">{loading ? "Verificando…" : "Entrar"}</button>
        </form>
        <p className="mt-6 text-sm text-slate-600">¿Aún no tienes organización? <Link className="font-bold text-blue-700 hover:underline" href="/auth/register">Regístrate</Link></p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main className="p-8 text-center text-slate-600">Cargando…</main>}><LoginForm /></Suspense>;
}