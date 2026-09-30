"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureOrganization } from "@/lib/supabase/organization";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        options: {
          data: {
            full_name: String(formData.get("full_name")).trim(),
            organization_name: String(formData.get("organization_name")).trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/login`,
        },
      });
      if (signUpError) throw signUpError;

      if (data.session && data.user) {
        await ensureOrganization(supabase, data.user);
        router.replace("/dashboard");
        router.refresh();
      } else {
        setNotice("Revisa tu correo para confirmar la cuenta. Después inicia sesión para terminar de crear la organización.");
      }
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:gap-20 lg:px-8">
      <section className="hidden border-r border-slate-200 pr-16 lg:block"><p className="eyebrow">Comienza con tu equipo</p><h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight">Una organización. Un lenguaje común para el impacto.</h1><p className="mt-5 max-w-lg leading-7 text-slate-600">Conecta las prioridades de operaciones y finanzas desde la primera oportunidad.</p></section>
      <section className="mx-auto w-full max-w-md">
        <p className="eyebrow">Nuevo espacio de trabajo</p><h1 className="mt-2 text-3xl font-bold">Crear organización</h1><p className="mt-2 text-slate-600">Registra al administrador inicial de tu equipo.</p>
        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5 text-sm font-semibold">Nombre de la organización<input autoComplete="organization" className="field" maxLength={120} name="organization_name" required /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Tu nombre<input autoComplete="name" className="field" maxLength={120} name="full_name" required /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Correo electrónico<input autoComplete="email" className="field" name="email" required type="email" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Contraseña<input autoComplete="new-password" className="field" minLength={8} name="password" required type="password" /></label>
          {error && <p aria-live="polite" className="text-sm text-red-700">{error}</p>}
          {notice && <p aria-live="polite" className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice} <Link className="font-bold underline" href="/auth/login">Ir a login</Link></p>}
          <button className="button-primary mt-1 w-full disabled:opacity-60" disabled={loading} type="submit">{loading ? "Creando cuenta…" : "Crear cuenta y organización"}</button>
        </form>
        <p className="mt-6 text-sm text-slate-600">¿Ya tienes cuenta? <Link className="font-bold text-blue-700 hover:underline" href="/auth/login">Inicia sesión</Link></p>
      </section>
    </main>
  );
}