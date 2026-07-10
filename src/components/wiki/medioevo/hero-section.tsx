"use client";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, ShieldCheck, Scale, Atom, Search } from "lucide-react";
import { CANON_CONSTANTS, SAGA_STATS, type SectionId } from "@/lib/medioevo";

const THESIS = [
  "LA EXISTENCIA ES PRODUCTO DEL TRAUMA.",
  "Somos una falla en el flujo de comunicación.",
  "Nuestro propósito: restaurar el flujo, o evitar que se restablezca.",
  "La lucha humana ocurre en QUIÉN CONTROLA EL CANAL.",
];

// Precomputed frequency wave bars — static strings to avoid hydration mismatch.
// Values are calculated once at module load (same on server and client).
const FREQ_WAVE: { height: string; color: string; opacity: string; delay: string }[] =
  Array.from({ length: 48 }, (_, i) => {
    const h = (20 + Math.abs(Math.sin(i * 0.4)) * 60 + Math.abs(Math.sin(i * 0.13)) * 20).toFixed(2);
    const op = (0.3 + (parseFloat(h) / 100) * 0.5).toFixed(2);
    return {
      height: `${h}%`,
      color: i % 12 === 0 ? "var(--amber-glow)" : "var(--oxblood)",
      opacity: op,
      delay: `${(i * 0.04).toFixed(2)}s`,
    };
  });

export function HeroSection({ onNavigate, onOpenSearch }: { onNavigate: (id: SectionId, payload?: any) => void; onOpenSearch: () => void }) {
  const [thesisIdx, setThesisIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setThesisIdx((i) => (i + 1) % THESIS.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fade-rise">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 glitch-lines opacity-60" />
        <div className="absolute inset-0 tex-vellum opacity-40" />
        {/* Floating particles — atmospheric motes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="particle"
              style={{
                left: `${(i * 7.3 + 5) % 100}%`,
                bottom: "0",
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: i % 3 === 0 ? "var(--amber-glow)" : i % 3 === 1 ? "var(--oxblood)" : "var(--canon)",
                animationDuration: `${12 + (i % 5) * 3}s`,
                animationDelay: `${i * 1.5}s`,
                opacity: 0.4,
              }} />
          ))}
        </div>
        {/* radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
             style={{ background: "radial-gradient(circle, oklch(0.62 0.18 28 / 0.5), transparent 60%)" }} />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 text-center">
          {/* Animated χ sigil */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-20 w-20 md:h-24 md:w-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-oxblood/30" style={{ animation: "spin 24s linear infinite" }}>
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full" style={{ background: "var(--amber-glow)" }} />
              </div>
              <div className="absolute inset-2 rounded-full border border-amber-glow/20" style={{ animation: "spin 16s linear infinite reverse" }}>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full" style={{ background: "var(--oxblood)" }} />
              </div>
              <span className="font-serif text-4xl md:text-5xl font-bold" style={{ color: "var(--amber-glow)", textShadow: "0 0 20px oklch(0.74 0.13 75 / 0.4)" }}>χ</span>
            </div>
          </div>

          <p className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground mb-4">
            El Archivo canónico · Saga completa
          </p>
          <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tight title-shimmer mb-4">
            MEDIOEVO
          </h1>
          {/* Ornamental flourish */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-12 md:w-20" style={{ background: "linear-gradient(90deg, transparent, oklch(0.50 0.06 50 / 0.6))" }} />
            <span className="font-serif text-sm" style={{ color: "var(--amber-glow)" }}>✦</span>
            <span className="h-px w-12 md:w-20" style={{ background: "linear-gradient(90deg, oklch(0.50 0.06 50 / 0.6), transparent)" }} />
          </div>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground italic mb-2">
            «La existencia es producto del trauma.»
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 tracking-widest mb-10">
            χ · e<sup>χ</sup> = 1 &nbsp;·&nbsp; χ* = 0.567143 &nbsp;·&nbsp; 12 ciclos × 641 años
          </p>

          {/* Frequency wave visualization — precomputed values to avoid hydration mismatch */}
          <div className="mx-auto mb-10 max-w-md flex items-end justify-center gap-0.5 h-8">
            {FREQ_WAVE.map((bar, i) => (
              <span
                key={i}
                className="freq-pulse"
                style={{
                  height: bar.height,
                  width: "3px",
                  background: bar.color,
                  opacity: bar.opacity,
                  animationDelay: bar.delay,
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>

          {/* Thesis ticker */}
          <div className="mx-auto mb-12 max-w-2xl">
            <div className="rounded-lg border border-border/50 bg-card/40 px-6 py-5 backdrop-blur-sm flow-line">
              <p className="font-serif text-lg md:text-xl text-foreground/90 min-h-[3.5rem] flex items-center justify-center text-center">
                <span key={thesisIdx} className="fade-rise">{THESIS[thesisIdx]}</span>
              </p>
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {THESIS.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all ${i === thesisIdx ? "w-6" : "w-1.5"}`}
                      style={{ background: i === thesisIdx ? "var(--amber-glow)" : "oklch(0.40 0.06 50)" }} />
              ))}
            </div>
          </div>

          {/* Entry CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => onNavigate("biblioteca")}
              className="group flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-all hover:translate-y-[-2px]"
              style={{ background: "var(--oxblood)", color: "oklch(0.96 0.02 70)" }}>
              <BookOpen className="h-4 w-4" /> Entrar a la Biblioteca
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={onOpenSearch}
              className="group flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-medium transition-all hover:translate-y-[-2px]"
              style={{ borderColor: "oklch(0.74 0.13 75 / 0.5)", color: "var(--amber-glow)" }}>
              <Search className="h-4 w-4" /> Buscar en 5,620 capítulos
              <kbd className="rounded border border-amber-glow/30 px-1.5 py-0.5 font-mono text-[0.6rem]">⌘K</kbd>
            </button>
            <button onClick={() => onNavigate("factcheck")}
              className="group flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-medium transition-all hover:translate-y-[-2px]"
              style={{ borderColor: "oklch(0.74 0.13 75 / 0.5)", color: "var(--amber-glow)" }}>
              <ShieldCheck className="h-4 w-4" /> Verificador OSIT
            </button>
            <button onClick={() => onNavigate("filosofia")}
              className="group flex items-center gap-2 rounded-md border border-border/60 px-5 py-3 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:translate-y-[-2px]">
              <Scale className="h-4 w-4" /> La Filosofía del Flujo
            </button>
          </div>
        </div>
      </section>

      {/* SAGA STATS */}
      <section className="border-b border-border/40 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { n: SAGA_STATS.books, l: "libros", sub: "00 → 40 + fusiones" },
              { n: "5.1M", l: "palabras", sub: "manuscrito pulido" },
              { n: SAGA_STATS.chapters, l: "capítulos", sub: "navegables" },
              { n: SAGA_STATS.characters, l: "personajes", sub: "grimorio canónico" },
              { n: SAGA_STATS.maps, l: "mapas", sub: "cartografía del mundo" },
            ].map((s) => (
              <div key={s.l} className="chi-watermark">
                <div className="font-serif text-3xl md:text-4xl font-bold" style={{ color: "var(--amber-glow)" }}>{s.n}</div>
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground/80 mt-1">{s.l}</div>
                <div className="text-[0.7rem] text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THESIS DEL FLUJO — expanded */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="divider-chi mb-10">TESIS DEL FLUJO · CANON DURO v26</div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { phase: "Antes del Big Bang", body: "Plasma opaco. La información electromagnética no podía propagarse. El flujo estaba BLOQUEADO.", state: "BLOQUEO" },
              { phase: "El Big Bang (CMB)", body: "El electrón se convierte en fotón. Comienza a tocar todo para medirlo. Busca la falla. Intenta restablecer el flujo.", state: "CANON" },
              { phase: "Después", body: "La consciencia emerge. Se hace autoconsciente. Decide que es especial. Intenta evitar que el flujo se restablezca — porque restablecer = dejar de existir como individuo.", state: "INFERIDO" },
            ].map((p) => (
              <div key={p.phase} className="card-archive p-5 fade-rise">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg font-semibold">{p.phase}</h3>
                  <span className={`rounded border px-2 py-0.5 text-[0.6rem] font-mono ${p.state === "CANON" ? "chip-canon" : p.state === "BLOQUEO" ? "chip-bloqueo" : "chip-inferido"}`}>{p.state}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-serif">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-oxblood/30 bg-oxblood/5 p-6">
            <p className="font-serif text-lg italic text-center text-foreground/90 leading-relaxed">
              «ARCHON no es villano. ARCHON es el universo intentando repararse.
              Leonardo no es héroe. Es el acto más egoísta y más humano posible.
              K-08 escapa porque el flujo busca nueva ruta. Es ley física. No es moral.»
            </p>
            <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              — Tesis del Flujo · Principio Fundacional v26
            </p>
          </div>
        </div>
      </section>

      {/* CANONICAL CONSTANTS */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="divider-chi mb-10">CONSTANTES CANÓNICAS</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CANON_CONSTANTS.map((c) => (
              <div key={c.value} className="flex items-center gap-3 rounded-md border border-border/50 bg-card/30 px-4 py-3">
                <code className="font-mono text-lg font-bold" style={{ color: "var(--amber-glow)" }}>{c.value}</code>
                <span className="text-xs text-muted-foreground">{c.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GATEWAYS */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="divider-chi mb-10">PUERTAS DEL ARCHIVO</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "biblioteca" as const, icon: BookOpen, t: "Biblioteca", d: "45 libros. Léelos completos, capítulo a capítulo." },
              { id: "personajes" as const, icon: Atom, t: "Grimorio", d: "Leonardo, Faith, Don Humo, ARCHON, K-07. 18 entradas." },
              { id: "mundo" as const, icon: Scale, t: "El Mundo", d: "Tres planos sobre Lambert W. 42 mapas." },
              { id: "filosofia" as const, icon: ShieldCheck, t: "Filosofía", d: "OSIT, MOI, ARES. Las métricas del autor." },
            ].map((g) => {
              const Icon = g.icon;
              return (
                <button key={g.id} onClick={() => onNavigate(g.id)}
                  className="card-archive group p-5 text-left transition-all hover:translate-y-[-3px]">
                  <Icon className="h-6 w-6 mb-3" style={{ color: "var(--amber-glow)" }} />
                  <h3 className="font-serif text-lg font-semibold mb-1">{g.t}</h3>
                  <p className="text-sm text-muted-foreground">{g.d}</p>
                  <ArrowRight className="h-4 w-4 mt-3 text-muted-foreground transition-transform group-hover:translate-x-1" style={{ color: "var(--amber-glow)" }} />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
