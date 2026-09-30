import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav aria-label="Navegación principal" className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2.5" href="/">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded bg-blue-700 text-sm font-black text-white">IA</span>
          <span className="text-sm font-bold leading-tight text-slate-800 sm:text-base">Industrial AI <span className="text-blue-700">Performance</span></span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold sm:gap-7">
          <Link className="hidden text-slate-600 transition hover:text-blue-700 sm:block" href="/dashboard">Dashboard</Link>
          <Link className="text-slate-600 transition hover:text-blue-700" href="/opportunities">Oportunidades</Link>
          <Link className="rounded border border-slate-300 px-3 py-2 text-slate-700 transition hover:border-blue-600 hover:text-blue-700" href="/auth/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}