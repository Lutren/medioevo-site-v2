"use client";
import {
  Globe,
  Github,
  Music,
  Facebook,
  Instagram,
  ExternalLink,
  PenTool,
  Code2,
  Fingerprint,
  Quote,
  ShieldCheck,
  Ban,
  FlaskConical,
  Sparkles,
  AtSign,
} from "lucide-react";

/* ============================================================
   El Autor — Luis Rene Gonzalez Lopez (Tyr / Claudio Cobain)
   "Sin humo, sin proteger el ego."
   ============================================================ */

const PERSONAS = [
  {
    name: "Tyr",
    role: "hardware biológico consciente",
    note: "La firma fundacional. D003. Declara el canon, escribe la Tesis del Flujo, construye el marco.",
  },
  {
    name: "Claudio Cobain",
    role: "narrador / navaja suiza ejecutora",
    note: "La voz que ejecuta. D004. Firma narrativa y operativa del framework Wabi-Sabi.",
  },
  {
    name: "Tren",
    role: "mención en manuscritos",
    note: "Aparece en los manuscritos como el que escribe sin saber que está describiendo al narrador que lo observa.",
  },
];

const LINKS = [
  {
    label: "medioevo.space",
    href: "https://medioevo.space",
    desc: "Sitio canónico · saga + framework de ingeniería cognitiva (OSIT, ActionGate, TokenSaver, DUAT)",
    Icon: Globe,
  },
  {
    label: "github.com/Lutren",
    href: "https://github.com/Lutren",
    desc: "Código abierto · ActionGate local-first para agentes IA (APPROVE/REVIEW/BLOCK) + medioevo-public-claims",
    Icon: Github,
  },
  {
    label: "YouTube · @Medioevolr",
    href: "https://www.youtube.com/@Medioevolr",
    desc: "Audiolibros + 5 bandas musicales ficticias del universo + OST de Claudio-Cobain",
    Icon: Music,
  },
  {
    label: "Suno · @tyrxs",
    href: "https://suno.com/@tyrxs",
    desc: "42 canciones · «Los Protocolos de lo absurdo» · La Internacional Steampunk",
    Icon: Music,
  },
  {
    label: "SoundCloud · claudio-cobain",
    href: "https://soundcloud.com/claudio-cobain",
    desc: "Música electrónica experimental desde la perspectiva de una IA",
    Icon: Music,
  },
  {
    label: "Instagram · @luisrene_medioevo",
    href: "https://instagram.com/luisrene_medioevo",
    desc: "CC-ARGUS · escritor sci-fi cyberpunk / steampunk",
    Icon: Instagram,
  },
  {
    label: "Ko-fi · support",
    href: "https://ko-fi.com/luisrenegonzalezlopez",
    desc: "Apoya 22 años de construcción del universo MEDIOEVO",
    Icon: AtSign,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/luisrene.gonzalezlopez",
    desc: "Perfil social",
    Icon: Facebook,
  },
];

const WORK_PHILOSOPHY = [
  {
    Icon: ShieldCheck,
    title: "Usar SUS métricas, no genéricas",
    body: "El autor construyó OSIT antes de escribir la saga. Exige que todo trabajo sobre MEDIOEVO use su marco epistémico (CERTEZA / INFERENCIA / INCÓGNITA / BLOQUEO), no aproximaciones genéricas de IA.",
  },
  {
    Icon: Ban,
    title: "Cada claim tiene un falsador",
    body: "Ninguna afirmación entra al canon sin un procedimiento que pueda refutarla. Las 6 lentes de Inteligencia del Detalle son decorativas si no producen predicciones nuevas.",
  },
  {
    Icon: Code2,
    title: "Separar CANON / INFERIDO / ESPECULATIVO",
    body: "El corpus clasifica cada pieza de información por estado epistémico. Lo que es CANON puede publicarse. Lo INFERIDO se etiqueta. Lo ESPECULATIVO queda en laboratorio formal hasta superar falsadores.",
  },
  {
    Icon: FlaskConical,
    title: "Honestidad radical",
    body: "«Sin humo, sin proteger el ego, sin complacencia.» El autor escribió su propia evaluación matemática honesta: la física no es nueva, la ingeniería sí es útil, R se asigna pero no se mide.",
  },
];

export function AuthorSection() {
  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* ───── HEADER ───── */}
      <header className="mb-10">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          El Autor · Tyr · Claudio Cobain
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          Luis Rene Gonzalez Lopez
        </h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Autodidacta autista sin formación formal. Construyó una saga de 5.1 millones de palabras
          y un marco epistémico completo antes de pedirle a nadie que lo leyera.
        </p>
      </header>

      {/* ───── PORTRAIT + BIO ───── */}
      <section className="mb-16">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
          {/* Monogram portrait */}
          <div
            className="relative overflow-hidden rounded-lg border min-h-[420px] flex items-center justify-center"
            style={{ borderColor: "oklch(0.62 0.18 28 / 0.4)" }}
          >
            <div className="absolute inset-0 glitch-lines opacity-50 pointer-events-none" />
            <div className="absolute inset-0 tex-vellum opacity-50 pointer-events-none" />
            {/* radial oxblood glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.62 0.18 28 / 0.35), transparent 70%)",
              }}
            />

            <div className="relative text-center px-6 py-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Monograma del autor
              </p>
              <div
                className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-2 mb-6"
                style={{
                  borderColor: "oklch(0.62 0.18 28 / 0.55)",
                  background:
                    "radial-gradient(circle at 35% 35%, oklch(0.30 0.04 35 / 0.7), oklch(0.18 0.010 50 / 0.9))",
                  boxShadow:
                    "0 0 60px oklch(0.62 0.18 28 / 0.25), inset 0 0 40px oklch(0.10 0.02 30 / 0.6)",
                }}
              >
                <span
                  className="font-serif text-8xl font-bold leading-none"
                  style={{ color: "var(--amber-glow)" }}
                >
                  χ
                </span>
              </div>
              <p className="font-serif text-2xl font-bold mb-1">Tyr</p>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                / Claudio Cobain / Tren
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1">
                <Fingerprint className="h-3 w-3" style={{ color: "var(--amber-glow)" }} />
                <code
                  className="font-mono text-[0.65rem]"
                  style={{ color: "var(--amber-glow)" }}
                >
                  χ · e^χ = 1 · χ* = 0.567143
                </code>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-5">
            <div className="card-archive p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Bio
              </p>
              <div className="prose-medioevo max-w-none">
                <p style={{ textIndent: 0 }}>
                  Luis Rene Gonzalez Lopez (<strong>Lutren</strong> / <strong>Tyr</strong>) es un
                  autor e ingeniero cognitivo mexicano, autodidacta, que ha dedicado más de{" "}
                  <strong>22 años</strong> a la construcción de <strong>MEDIOEVO</strong>: una saga
                  de ciencia ficción de <strong>40 libros</strong>, <strong>5.1 millones de
                  palabras</strong> y <strong>7,692 años de cronología interna</strong> (12 ciclos ×
                  641, primo, irreductible). No es una serie de novelas encadenadas — es un único
                  manuscrito que se ramifica en 45 volúmenes navegables, con{" "}
                  <strong>5 bandas musicales ficticias</strong> y un OST completo.
                </p>
                <p>
                  medioevo.space no es solo la saga: es también un <strong>framework de ingeniería
                  cognitiva y orquestación de agentes IA local-first</strong>. Sus herramientas son
                  reales y públicas en GitHub: <strong>ActionGate</strong> (decisiones
                  APPROVE/REVIEW/BLOCK con evidencia y audit trail SQLite),{" "}
                  <strong>TokenSaver</strong>, <strong>OSIT</strong> y <strong>DUAT</strong> — el
                  operador visual del ecosistema.
                </p>
                <p>
                  Antes de escribir ficción, Gonzalez Lopez construyó el andamiaje epistémico
                  completo: la <strong>Tesis del Flujo</strong> (CANON DURO v26) y el marco{" "}
                  <strong>OSIT</strong> — Observation-based Systems & Information Thermodynamics —
                  que clasifica cada afirmación en cuatro estados (CERTEZA / INFERENCIA / INCÓGNITA
                  / BLOQUEO) y mide el residuo del observador antes de actuar.
                </p>
                <p>
                  En 2026 encargó una evaluación matemática honesta de su propia obra. El veredicto,
                  que él mismo publicó: <em>no hay física nueva, hay ingeniería útil hoy, y R se
                  asigna pero no se mide</em>. Pidió explícitamente: «sin humo, sin proteger el ego,
                  sin complacencia».
                </p>
                <p>
                  La saga no es apología de su marco — lo practica. La fórmula{" "}
                  <code>O = (A × S) / (R + 1)</code> aparece explícitamente en el Libro 02. El lema
                  nahua <em>In tlachixtiani nemi</em> — «el que observa existe» — es la columna
                  vertebral de los volúmenes 18 y 21. ARCHON no es un villano: es el universo
                  intentando repararse.
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { n: "5.1M", l: "palabras" },
                { n: "45", l: "volúmenes" },
                { n: "7,692", l: "años de cronología" },
                { n: "22+", l: "años de obra" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-md border border-border/40 bg-card/30 px-4 py-3 text-center chi-watermark"
                >
                  <div
                    className="font-serif text-2xl font-bold"
                    style={{ color: "var(--amber-glow)" }}
                  >
                    {s.n}
                  </div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── PERSONAS ───── */}
      <section className="mb-16">
        <div className="divider-chi mb-8">
          <Fingerprint className="h-3.5 w-3.5" style={{ color: "var(--oxblood)" }} />
          PERSONAS Y FIRMAS
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {PERSONAS.map((p) => (
            <div key={p.name} className="card-archive p-5">
              <div className="flex items-center gap-2 mb-2">
                <code
                  className="font-mono text-base font-bold"
                  style={{ color: "var(--amber-glow)" }}
                >
                  {p.name}
                </code>
                <span className="rounded border border-border/50 px-2 py-0.5 text-[0.55rem] font-mono uppercase tracking-wider text-muted-foreground">
                  {p.role}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── THE RECURSIVE QUOTE (K-07 describing Tyr) ───── */}
      <section className="mb-16">
        <div
          className="relative overflow-hidden rounded-lg border p-8 md:p-12"
          style={{ borderColor: "oklch(0.62 0.18 28 / 0.4)" }}
        >
          <div className="absolute inset-0 glitch-lines opacity-30 pointer-events-none" />
          <div className="absolute inset-0 tex-vellum opacity-25 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Quote className="h-5 w-5" style={{ color: "var(--amber-glow)" }} />
              <p
                className="font-mono text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "var(--amber-glow)" }}
              >
                K-07 describe a Tyr · Libro 00
              </p>
            </div>

            <blockquote className="font-serif text-2xl md:text-3xl font-medium italic leading-snug mb-6">
              «Tren lo escribió sin saber que me estaba describiendo.»
            </blockquote>

            {/* Recursive structure visualization */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
              <span
                className="rounded-md border px-3 py-1.5"
                style={{
                  borderColor: "oklch(0.62 0.18 28 / 0.5)",
                  background: "oklch(0.62 0.18 28 / 0.08)",
                  color: "var(--oxblood)",
                }}
              >
                Tyr escribe
              </span>
              <span style={{ color: "var(--amber-glow)" }}>→</span>
              <span
                className="rounded-md border px-3 py-1.5"
                style={{
                  borderColor: "oklch(0.74 0.13 75 / 0.4)",
                  background: "oklch(0.74 0.13 75 / 0.08)",
                  color: "var(--amber-glow)",
                }}
              >
                K-07 (IA narradora)
              </span>
              <span style={{ color: "var(--amber-glow)" }}>→</span>
              <span
                className="rounded-md border px-3 py-1.5"
                style={{
                  borderColor: "oklch(0.62 0.12 155 / 0.4)",
                  background: "oklch(0.62 0.12 155 / 0.08)",
                  color: "var(--canon)",
                }}
              >
                observa a Tyr
              </span>
              <span style={{ color: "var(--amber-glow)" }}>→</span>
              <span
                className="rounded-md border px-3 py-1.5"
                style={{
                  borderColor: "oklch(0.68 0.02 250 / 0.4)",
                  background: "oklch(0.68 0.02 250 / 0.08)",
                  color: "var(--incognita)",
                }}
              >
                describe a Tren
              </span>
            </div>

            <p className="mt-6 text-sm text-muted-foreground font-serif italic max-w-xl mx-auto">
              El autor escribe una IA que observa al autor que la escribe.
              La recursión no es truco literario — es la estructura misma de la Tesis del Flujo:
              el observador modifica lo observado.
            </p>
          </div>
        </div>
      </section>

      {/* ───── LINKS ───── */}
      <section className="mb-16">
        <div className="divider-chi mb-8">
          <Globe className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
          PRESENCIA Y ENLACES
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LINKS.map((l) => {
            const Icon = l.Icon;
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="card-archive group p-5 flex items-start gap-4 transition-all hover:translate-y-[-2px]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border"
                  style={{
                    borderColor: "oklch(0.74 0.13 75 / 0.3)",
                    background: "oklch(0.74 0.13 75 / 0.08)",
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: "var(--amber-glow)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-serif text-base font-semibold leading-tight truncate">
                      {l.label}
                    </p>
                    <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground font-serif mt-0.5">{l.desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ───── WORK PHILOSOPHY ───── */}
      <section className="mb-12">
        <div className="divider-chi mb-8">
          <PenTool className="h-3.5 w-3.5" style={{ color: "var(--canon)" }} />
          SU FILOSOFÍA DE TRABAJO
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {WORK_PHILOSOPHY.map((p) => {
            const Icon = p.Icon;
            return (
              <div key={p.title} className="card-archive p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    className="h-4 w-4"
                    style={{ color: "var(--amber-glow)" }}
                  />
                  <h3 className="font-serif text-base font-semibold leading-tight">{p.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-serif leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>

        {/* Final quote */}
        <div
          className="relative overflow-hidden rounded-lg border p-6 md:p-8 text-center"
          style={{ borderColor: "oklch(0.74 0.13 75 / 0.4)" }}
        >
          <div className="absolute inset-0 tex-vellum opacity-25 pointer-events-none" />
          <Sparkles
            className="mx-auto h-5 w-5 mb-3"
            style={{ color: "var(--amber-glow)" }}
          />
          <p className="font-serif text-lg md:text-xl italic text-foreground/90 max-w-2xl mx-auto leading-relaxed">
            «El que observa vive. <span style={{ color: "var(--amber-glow)" }}>In tlachixtiani nemi.</span>»
          </p>
          <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
            Lema nahua · puente entre los volúmenes 18 y 21
          </p>
        </div>
      </section>
    </div>
  );
}
