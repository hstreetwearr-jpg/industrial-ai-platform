import Link from "next/link";

const steps = ["DISCOVER", "MEASURE", "PILOT", "VALIDATE", "SCALE"];
const areas = [
  { number: "01", title: "Quality", detail: "Menos defectos. Inspección y trazabilidad con impacto verificable.", tag: "CALIDAD" },
  { number: "02", title: "Production", detail: "Más disponibilidad y rendimiento a lo largo de cada turno.", tag: "PRODUCCIÓN" },
  { number: "03", title: "Supply", detail: "Inventario, demanda y logística alineados con la operación.", tag: "CADENA DE SUMINISTRO" },
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-45" style={{ backgroundImage: "linear-gradient(90deg, #071522 0%, #102d43 60%, #164b71 100%), repeating-linear-gradient(0deg, transparent 0 47px, rgb(255 255 255 / 8%) 48px), repeating-linear-gradient(90deg, transparent 0 47px, rgb(255 255 255 / 8%) 48px)" }} />
        <div className="mx-auto grid min-h-[590px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="reveal max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.14em] text-sky-300">Sistema de desempeño para la industria mexicana</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">Turn Industrial Operations Into Measurable AI Performance</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">De la oportunidad al impacto validado: conecta datos, equipos de planta y resultados económicos en un solo sistema.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="button-primary border-sky-500 bg-sky-500 px-5 py-3 hover:bg-sky-400" href="/auth/register">Crear organización <span aria-hidden="true">→</span></Link>
              <Link className="button-secondary border-white/30 bg-white/5 px-5 py-3 text-white hover:bg-white/10" href="/auth/login">Acceder al sistema</Link>
            </div>
          </div>
          <div aria-label="Indicadores operativos de muestra" className="reveal reveal-delay border-l border-sky-400/50 pl-6 sm:pl-8">
            <p className="eyebrow text-sky-300">El desempeño, a la vista</p>
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-8">
              <div><p className="text-4xl font-bold">−18%</p><p className="mt-2 text-sm text-slate-300">merma potencial</p></div>
              <div><p className="text-4xl font-bold">+12%</p><p className="mt-2 text-sm text-slate-300">OEE objetivo</p></div>
              <div className="col-span-2 border-t border-white/20 pt-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Cada caso respaldado por evidencia</p><div className="mt-4 flex gap-2"><span className="h-1.5 flex-1 bg-sky-400"/><span className="h-1.5 flex-1 bg-sky-400"/><span className="h-1.5 flex-1 bg-sky-400"/><span className="h-1.5 flex-1 bg-white/20"/><span className="h-1.5 flex-1 bg-white/20"/></div><p className="mt-2 text-xs text-slate-400">Descubrir · medir · validar · escalar</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><p className="eyebrow">Una ruta con evidencia</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">De la hipótesis al valor en planta.</h2><p className="mt-4 leading-7 text-slate-600">Cada etapa reduce incertidumbre y prepara la decisión siguiente.</p></div>
          <div className="mt-10 grid gap-0 sm:grid-cols-5">
            {steps.map((step, index) => <div className="relative border-t-2 border-slate-200 py-5 sm:border-t-0 sm:border-l sm:pl-5" key={step}><span className="absolute -top-[7px] left-0 size-3 rounded-full border-2 border-white bg-blue-600 sm:-top-0 sm:-left-[7px]"/><p className="text-xs font-bold text-blue-700">0{index + 1}</p><h3 className="mt-2 font-bold tracking-wide text-slate-800">{step}</h3><p className="mt-2 text-sm text-slate-500">{["Encuentra el reto", "Cuantifica la línea base", "Prueba en condiciones reales", "Confirma resultados", "Amplía lo que funciona"][index]}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Dónde generar valor</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Problemas de planta. Resultados medibles.</h2></div><Link className="text-sm font-bold text-blue-700 hover:text-blue-900" href="/opportunities">Explorar oportunidades →</Link></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {areas.map((area) => <article className="panel p-6 transition hover:border-blue-300" key={area.title}><p className="text-xs font-bold text-blue-700">{area.number} / {area.tag}</p><h3 className="mt-8 text-2xl font-bold">{area.title}</h3><p className="mt-3 min-h-14 leading-6 text-slate-600">{area.detail}</p><div className="mt-6 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-500">Explora · mide · mejora</div></article>)}
          </div>
        </div>
      </section>

      <section className="bg-blue-800 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-sky-300">Retorno sobre inversión</p><h2 className="mt-3 max-w-2xl text-3xl font-bold">Un caso económico que resiste la operación real.</h2><p className="mt-4 max-w-2xl leading-7 text-blue-100">Separa el impacto proyectado del beneficio validado. Alinea finanzas y operaciones con evidencia compartida en cada piloto.</p></div>
          <Link className="button-secondary w-fit border-white bg-white px-5 py-3 text-blue-900 hover:bg-blue-50" href="/auth/register">Construir mi caso →</Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p className="font-semibold text-white">Industrial AI Performance System</p><p>Diseñado para operaciones industriales en México.</p><div className="flex gap-5"><Link className="hover:text-white" href="/auth/login">Login</Link><Link className="hover:text-white" href="/auth/register">Registro</Link></div></div>
      </footer>
    </main>
  );
}