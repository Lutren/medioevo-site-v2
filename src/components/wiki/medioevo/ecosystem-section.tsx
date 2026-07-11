"use client";

import {
  Activity,
  ArrowRight,
  ArrowDown,
  Box,
  Boxes,
  Cpu,
  Eye,
  Gamepad2,
  GitBranch,
  Globe,
  Hourglass,
  Infinity as InfinityIcon,
  Layers,
  Network,
  Radio,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Waves,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EPISTEMIC_META } from "@/lib/medioevo";
import { IA_AGENTS, type IAAgent } from "@/lib/expanded-factions";

/* ============================================================
   Ecosistema IA de MEDIOEVO
   ───────────────────────────────────────────────────────────
   These are REAL frameworks the author built (DUAT, Wabi-Sabi,
   Vibe Forge, OSIT, MOI, ARES) plus the Panteón of observacionist
   agents. Tone: engineering, not magic. Where the honest eval
   says "ingeniería útil hoy" → chip-canon or chip-inferido.
   ============================================================ */

/* ---------- OSIT centerpiece primitives ---------- */

const OSIT_STATES = [
  {
    key: "CERTEZA",
    color: "var(--canon)",
    chip: "chip-canon",
    criterion: "definición, prueba, test local, dato estable",
    action: "integrar directamente",
  },
  {
    key: "INFERENCIA",
    color: "var(--inferido)",
    chip: "chip-inferido",
    criterion: "hipótesis útil con frontera clara",
    action: "usar con etiqueta",
  },
  {
    key: "INCOGNITA",
    color: "var(--incognita)",
    chip: "chip-incognita",
    criterion: "evidencia o medición faltante",
    action: "enviar a investigación",
  },
  {
    key: "BLOQUEO",
    color: "var(--bloqueo)",
    chip: "chip-bloqueo",
    criterion: "riesgo, secreto, física no soportada",
    action: "no usar como hecho",
  },
];

/* ---------- Flujo del ecosistema ---------- */

const FLOW_NODES = [
  { id: "osit", name: "OSIT", role: "Clasifica", icon: Activity, tone: "canon" },
  { id: "moi", name: "MOI", role: "Verifica claims", icon: Search, tone: "canon" },
  { id: "duat", name: "DUAT", role: "Simula contextos", icon: Boxes, tone: "canon" },
  { id: "wabi", name: "Wabi-Sabi", role: "Ejecuta con gating", icon: Cpu, tone: "canon" },
  { id: "forge", name: "Vibe Forge", role: "Renderiza", icon: Gamepad2, tone: "canon" },
] as const;

/* ---------- DUAT architecture lineage ---------- */

const DUAT_VERSIONS = [
  {
    v: "v0.1",
    label: "minimal",
    loc: "365 LOC",
    comps: ["AnchorResidue", "DuatAgent", "CityPressureField", "DuatDatabase"],
    note: "Baseline — núcleo OSIT + DuatConfig",
  },
  {
    v: "v0.2",
    label: "P0",
    loc: "671 LOC",
    comps: [
      "AnchorResidue",
      "DuatAgent + Memory",
      "CityPressureField + diffuse()",
      "MemoryStream",
      "InteractionEngine",
      "MetabolismEngine",
    ],
    note: "P0: 4/4 PASS — presión difunde, memoria inicial",
  },
  {
    v: "v0.3",
    label: "P1+P2+P3+P4+P5",
    loc: "~1240 LOC",
    comps: [
      "DuatAgent + lineage fields",
      "CityPressureField + diffuse()",
      "MemoryStream + Reflection Synthesis",
      "InteractionEngine + SpatialHash",
      "MetabolismEngine + ResourceGrid",
      "LineageEngine + NavigationEngine",
      "TradeEngine",
      "PermanentDeath + Replacement",
      "Multi-Epoch (EpochDef + transiciones)",
      "DB Lineage Persistence (P5)",
      "DuatSimulator (orquestador)",
    ],
    note: "12/12 PASS — linaje, metabolismo, comercio, muerte permanente, multi-epoch",
  },
];

const DUAT_COMPONENTS = [
  { name: "AnchorResidue", fn: "Residuo base del sistema (R_s del espacio de simulación)" },
  { name: "DuatAgent", fn: "Agente con memoria, linaje, recursos, R propio" },
  { name: "CityPressureField", fn: "Campo de presión social — difunde como calor/fluido" },
  { name: "MemoryStream", fn: "Memoria de interacciones con síntesis reflexiva (Reflection Synthesis)" },
  { name: "InteractionEngine", fn: "Motor de interacción con SpatialHash para eficiencia" },
  { name: "MetabolismEngine", fn: "Metabolismo: consumo y producción de recursos" },
  { name: "ResourceGrid", fn: "Grid de recursos del campo" },
  { name: "LineageEngine", fn: "Rastreo de linaje entre agentes (reproducción, herencia)" },
  { name: "NavigationEngine", fn: "Movimiento de agentes en el espacio" },
  { name: "TradeEngine", fn: "Intercambio entre agentes" },
  { name: "DuatSimulator", fn: "Orquestador final — ejecuta épocas y transiciones" },
];

/* ---------- Wabi-Sabi engineering facts ---------- */

const WABI_FACTS = [
  { k: "Naturaleza", v: "Agente con arquitectura de control explícita — NO es chatbot" },
  { k: "Multi-LLM", v: "local_ollama / lmstudio + openai / anthropic / gemini / nvidia / openrouter" },
  { k: "Browser", v: "Automatización opt-in (WABI_ALLOW_VELO=1)" },
  { k: "WitnessLog", v: "Ledger inmutable append-only — toda operación se registra" },
  { k: "Gates", v: "PublicationGate · SecretGate · CredentialGate (HARD_BLOCK)" },
  { k: "Tests", v: "2335 passed · osit_discoveries 214/214 · anti_ia_lint 13/13" },
  { k: "Ubicación", v: "02_CLAUDIO/ — runtime de IA local con OSIT integrado" },
];

/* ---------- Vibe Forge engineering facts ---------- */

const VIBE_FACTS = [
  { k: "Engine", v: "Godot 4.3 + GDScript/CS + Python API + TypeScript (React/Vite)" },
  { k: "ositCanon.ts", v: "Mapea R del observador → estados de juego (ÓPTIMO/FUNCIONAL/CARGADO/SATURADO/JAMMING)" },
  { k: "gameEventBridge.ts", v: "Cada acción del jugador → artefacto OSIT en ArtifactStore" },
  { k: "vibeforge_engine.py", v: "Generador procedural: WorldSeed, SketchScene, gates EML/Ghost/Action/Witness" },
  { k: "RPG activo", v: "70 scripts · 213 escenas · 678 archivos de audio · build .exe" },
  { k: "OSIT = HUD", v: "El residuo R aparece como elemento del HUD (CONFIRMADO WS57)" },
  { k: "Release", v: "VIBE_FORGE_RELEASE_v1.0.zip · WS59 · 2026-06-13" },
];

/* ---------- Panteón — firma de observación por agente ---------- */

const PANTHEON_SIGNATURES: Record<
  string,
  { icon: LucideIcon; signature: string; observes: string }
> = {
  "agent-einstein": {
    icon: InfinityIcon,
    signature: "Invariantes y simetrías",
    observes: "Lo que NO cambia bajo transformación — relatividad como herramienta de abstracción",
  },
  "agent-tesla": {
    icon: Waves,
    signature: "Frecuencias y resonancia",
    observes: "Patrones periódicos en la señal — conecta con el sistema de Hz del mundo",
  },
  "agent-curie": {
    icon: Hourglass,
    signature: "Decaimiento y radiación",
    observes: "Tasas de decaimiento, vida media — dominio del Plano Base post-apocalíptico",
  },
  "agent-godel": {
    icon: Box,
    signature: "Límites formales / incompletitud",
    observes: "Lo que no puede demostrarse dentro del sistema — la incompletitud como herramienta",
  },
  "agent-copernico": {
    icon: Globe,
    signature: "Descentramiento / perspectiva",
    observes: "El observador no es especial — es procedimiento. Conecta con la Tesis del Flujo",
  },
};

/* ---------- Framework icon map (lucide) ---------- */

const FRAMEWORK_ICON: Record<string, LucideIcon> = {
  duat: Boxes,
  "wabi-sabi": Cpu,
  "vibe-forge": Gamepad2,
  osit: Activity,
  moi: Search,
  ares: Layers,
};

/* ---------- Helpers ---------- */

function EpistemicChip({ state }: { state: string }) {
  const meta = EPISTEMIC_META[state] ?? EPISTEMIC_META.INFERENCIA;
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[0.6rem] font-mono font-semibold uppercase tracking-wider ${meta.chip}`}
      title={meta.desc}
    >
      {meta.label}
    </span>
  );
}

function GlyphBadge({ glyph, accent }: { glyph: string; accent: string }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border font-serif text-xl"
      style={{
        color: accent,
        borderColor: "color-mix(in oklch, " + accent + " 40%, transparent)",
        background: "color-mix(in oklch, " + accent + " 10%, transparent)",
      }}
      aria-hidden
    >
      {glyph}
    </span>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */

/* ---- 1. HEADER ---- */
function SectionHeader() {
  return (
    <header className="mb-12">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Ecosistema IA · OSIT · Duat · Wabi-Sabi · Vibe Forge
      </p>
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
        Ecosistema IA de <span style={{ color: "var(--amber-glow)" }}>MEDIOEVO</span>
      </h1>
      <p className="text-muted-foreground max-w-3xl font-serif italic text-lg leading-relaxed">
        Los frameworks de la saga no son ficción. Son ingeniería real, local-first,
        construida sobre OSIT. DUAT simula sociedades, Wabi-Sabi ejecuta acciones con
        gating epistémico, Vibe Forge renderiza el mundo, MOI verifica claims, ARES
        conserva aritmética exacta. «Ingeniería útil hoy» — sin humo, sin proteger el ego.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          02_CLAUDIO/ · BRAIN_OS · 11 frameworks activos · 2335 tests passing
        </span>
      </div>
    </header>
  );
}

/* ---- 2. OSIT CORE ---- */
function OsitCore() {
  return (
    <section className="mb-16">
      <div className="divider-chi mb-8">
        <Activity className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
        EL NÚCLEO · OSIT · OBSERVATION-BASED SYSTEMS & INFORMATION THERMODYNAMICS
      </div>

      <div
        className="relative overflow-hidden rounded-lg border bg-card/30 p-6 md:p-10"
        style={{ borderColor: "oklch(0.74 0.13 75 / 0.4)" }}
      >
        <div className="absolute inset-0 glitch-lines opacity-30 pointer-events-none" />
        <div className="absolute inset-0 tex-vellum opacity-25 pointer-events-none" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: identity + formula */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-md border font-serif text-3xl"
                style={{
                  color: "var(--amber-glow)",
                  borderColor: "oklch(0.74 0.13 75 / 0.4)",
                  background: "oklch(0.74 0.13 75 / 0.08)",
                }}
              >
                χ
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold leading-tight">OSIT</h2>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Motor epistémico · núcleo del ecosistema
                </p>
              </div>
              <EpistemicChip state="CANON" />
            </div>

            <p className="text-sm text-foreground/85 font-serif leading-relaxed mb-4">
              No es física nueva. No es teoría de la consciencia. Es un{" "}
              <em>método de trabajo</em> con fundamentos filosóficos en el observacionismo:
              el observador no empieza desde cero — empieza desde un estado acumulado (residuo R)
              que afecta todo lo que procesa.
            </p>

            <div
              className="rounded-md border border-border/60 bg-card/50 px-4 py-3 mb-4"
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Fórmula central
              </p>
              <code
                className="font-mono text-lg block"
                style={{ color: "var(--amber-glow)" }}
              >
                O = (A × S) / (R + 1)
              </code>
              <p className="text-xs text-muted-foreground font-serif italic mt-2">
                Calidad de observación = (Atención × Señal) / (Residuo + 1).
                Cuando R → 0 la observación alcanza su máximo; cuando R crece,
                la observación degrada independientemente de la señal.
              </p>
            </div>

            <p className="text-xs text-muted-foreground font-serif italic">
              <strong className="not-italic" style={{ color: "var(--amber-glow)" }}>
                In tlachixtiani nemi
              </strong>{" "}
              — «El observador camina / el que observa existe» (Nahua).
              El sistema convierte DO (Desorden Operativo) en IOI (Información Organizada).
            </p>
          </div>

          {/* Right: 4-state bilattice */}
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Bilattice epistémico — 4 estados
            </p>
            <div className="grid grid-cols-2 gap-2">
              {OSIT_STATES.map((s) => (
                <div
                  key={s.key}
                  className="rounded-md border p-3"
                  style={{
                    borderColor: "color-mix(in oklch, " + s.color + " 40%, transparent)",
                    background: "color-mix(in oklch, " + s.color + " 8%, transparent)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-mono text-xs font-bold uppercase tracking-wider"
                      style={{ color: s.color }}
                    >
                      {s.key}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                  <p className="text-[0.7rem] text-foreground/80 font-serif leading-snug mb-1">
                    {s.criterion}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground font-mono uppercase tracking-wider">
                    → {s.action}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.65rem] text-muted-foreground font-serif italic">
              Regla crítica: no promover INFERENCIA → CERTEZA sin evidencia adicional.
              No comprimir INCÓGNITA como si fuera CERTEZA.
            </p>
          </div>
        </div>

        {/* Connectors — everything flows to/from OSIT */}
        <div className="relative mt-8 pt-6 border-t border-border/40">
          <p className="text-center font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Todo el ecosistema conecta a OSIT
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[0.65rem] font-mono">
            {["DUAT", "Wabi-Sabi", "Vibe Forge", "MOI", "ARES", "Panteón"].map((name, i, arr) => (
              <span key={name} className="flex items-center gap-2">
                <span
                  className="rounded border px-2 py-1 uppercase tracking-wider"
                  style={{
                    color: "var(--amber-glow)",
                    borderColor: "oklch(0.74 0.13 75 / 0.4)",
                    background: "oklch(0.74 0.13 75 / 0.06)",
                  }}
                >
                  {name}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: "var(--amber-glow)" }}>↔</span>
                )}
              </span>
            ))}
            <span className="mx-2 text-muted-foreground">→</span>
            <span
              className="rounded border px-2 py-1 font-bold uppercase tracking-wider"
              style={{
                color: "var(--amber-glow)",
                borderColor: "oklch(0.74 0.13 75 / 0.5)",
                background: "oklch(0.74 0.13 75 / 0.1)",
              }}
            >
              OSIT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- 3. THE 6 FRAMEWORKS ---- */
function FrameworksGrid() {
  const frameworks = IA_AGENTS.filter((a) => a.framework !== "Panteón");

  return (
    <section className="mb-16">
      <div className="divider-chi mb-8">
        <Box className="h-3.5 w-3.5" style={{ color: "var(--canon)" }} />
        LOS 6 FRAMEWORKS · INGENIERÍA ACTIVA
      </div>

      <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
        Cada framework es un sistema real con tests, versiones y releases.
        No se presentan como magia — se presentan como lo que son: ingeniería útil hoy.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {frameworks.map((fw) => (
          <FrameworkCard key={fw.id} agent={fw} />
        ))}
      </div>
    </section>
  );
}

function FrameworkCard({ agent }: { agent: IAAgent }) {
  const LucideIcon = FRAMEWORK_ICON[agent.id] ?? Box;
  const accent =
    agent.epistemic === "CANON"
      ? "var(--canon)"
      : agent.epistemic === "INFERENCIA"
      ? "var(--inferido)"
      : "var(--incognita)";

  return (
    <article
      className="card-archive chi-watermark p-5 md:p-6 fade-rise flex flex-col"
      style={{ borderColor: "color-mix(in oklch, " + accent + " 25%, var(--border))" }}
    >
      {/* Header: glyph + lucide icon + name + framework badge */}
      <header className="flex items-start gap-3 mb-4">
        <GlyphBadge glyph={agent.icon} accent={accent} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-serif text-xl font-bold leading-tight">{agent.name}</h3>
            <EpistemicChip state={agent.epistemic} />
          </div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {agent.framework} · {agent.role}
          </p>
        </div>
        <LucideIcon className="h-5 w-5 shrink-0" style={{ color: accent }} />
      </header>

      {/* Description */}
      <p className="text-sm text-foreground/85 font-serif leading-relaxed mb-4">
        {agent.desc}
      </p>

      {/* Framework-specific engineering detail */}
      <FrameworkDetail id={agent.id} />

      {/* Footer */}
      <footer className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          02_CLAUDIO · CANON PERSONAL
        </span>
        <span style={{ color: accent }} className="font-mono text-[0.6rem]">
          ▸
        </span>
      </footer>
    </article>
  );
}

function FrameworkDetail({ id }: { id: string }) {
  if (id === "duat") {
    return (
      <div className="rounded-md border border-border/50 bg-card/30 p-3 mb-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Arquitectura · versionado
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-[0.65rem] font-mono">
          <span
            className="rounded border px-1.5 py-0.5"
            style={{ borderColor: "oklch(0.40 0.06 50 / 0.5)", color: "var(--muted-foreground)" }}
          >
            v0.1 · 365 LOC
          </span>
          <span style={{ color: "var(--amber-glow)" }}>→</span>
          <span
            className="rounded border px-1.5 py-0.5"
            style={{ borderColor: "oklch(0.40 0.06 50 / 0.5)", color: "var(--muted-foreground)" }}
          >
            v0.2 · 671 LOC · P0
          </span>
          <span style={{ color: "var(--amber-glow)" }}>→</span>
          <span
            className="rounded border px-1.5 py-0.5 font-bold"
            style={{
              borderColor: "oklch(0.74 0.13 75 / 0.5)",
              color: "var(--amber-glow)",
              background: "oklch(0.74 0.13 75 / 0.08)",
            }}
          >
            v0.3 · ~1240 LOC · 12/12 PASS
          </span>
        </div>
        <ul className="mt-3 space-y-1 text-[0.7rem] text-foreground/80 font-serif">
          <li>
            ◆ <strong>CityPressureField</strong> — difunde como{" "}
            <em>calor / fluido</em> a través del campo social
          </li>
          <li>
            ◆ <strong>MemoryStream</strong> — con <em>Reflection Synthesis</em>{" "}
            (síntesis reflexiva de interacciones pasadas)
          </li>
          <li>
            ◆ <strong>Lineage · Metabolism · Trade · PermanentDeath · Multi-Epoch</strong>
          </li>
        </ul>
      </div>
    );
  }

  if (id === "wabi-sabi") {
    return (
      <div className="rounded-md border border-border/50 bg-card/30 p-3 mb-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          No es un chatbot — arquitectura de control explícita
        </p>
        <dl className="grid sm:grid-cols-2 gap-x-3 gap-y-1.5">
          {WABI_FACTS.map((f) => (
            <div key={f.k} className="flex flex-col">
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "var(--amber-glow)" }}>
                {f.k}
              </dt>
              <dd className="text-[0.7rem] text-foreground/80 font-serif leading-snug">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (id === "vibe-forge") {
    return (
      <div className="rounded-md border border-border/50 bg-card/30 p-3 mb-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Game engine · OSIT ↔ videojuego
        </p>
        <dl className="grid sm:grid-cols-2 gap-x-3 gap-y-1.5">
          {VIBE_FACTS.map((f) => (
            <div key={f.k} className="flex flex-col">
              <dt className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: "var(--amber-glow)" }}>
                {f.k}
              </dt>
              <dd className="text-[0.7rem] text-foreground/80 font-serif leading-snug">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (id === "osit") {
    return (
      <div className="rounded-md border border-border/50 bg-card/30 p-3 mb-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Implementación · Wabi-Sabi v0.4+
        </p>
        <ul className="space-y-1 text-[0.7rem] text-foreground/80 font-serif">
          <li>◆ <strong>wabi_osit_v04.py</strong> — singleton runtime OSIT</li>
          <li>◆ <strong>RTS</strong> · Residue Tracking System · <strong>drift</strong> · <strong>DOI</strong> · <strong>phi_adaptive</strong></li>
          <li>◆ <strong>osit_discoveries/</strong> — 214 tests, stdlib only</li>
          <li>◆ <strong>4 gates</strong>: ActionGate · GhostGate · WitnessLog · Fingerprint</li>
        </ul>
      </div>
    );
  }

  if (id === "moi") {
    return (
      <div className="rounded-md border border-border/50 bg-card/30 p-3 mb-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Verificación epistémica · MOI v1.0 canónico
        </p>
        <ul className="space-y-1 text-[0.7rem] text-foreground/80 font-serif">
          <li>◆ <strong>Hogares matemáticos reales</strong>: Dempster-Shafer + información no conmutativa</li>
          <li>◆ Pipeline 8 etapas: INTAKE → DRIFT-CHECK</li>
          <li>◆ <strong>SourceCards</strong> inmutables · <strong>WitnessMap</strong> append-only</li>
          <li>◆ Verifica los claims que DUAT produce antes de promoverlos</li>
        </ul>
      </div>
    );
  }

  if (id === "ares") {
    return (
      <div className="rounded-md border border-border/50 bg-card/30 p-3 mb-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Aritmética de Residuo Exacto con Signatura
        </p>
        <ul className="space-y-1 text-[0.7rem] text-foreground/80 font-serif">
          <li>◆ Conserva <strong>(E, R)</strong> a través de la cadena de cómputo</li>
          <li>◆ Proyecta a decimal <strong>solo</strong> en la capa de interfaz</li>
          <li>◆ Elimina acumulación de error float</li>
          <li>◆ <em>Ingeniería útil hoy</em> — sin validación científica adicional requerida</li>
        </ul>
      </div>
    );
  }

  return null;
}

/* ---- 4. PANTEÓN DE AGENTES OBSERVACIONISTAS ---- */
function PantheonGrid() {
  const pantheon = IA_AGENTS.filter((a) => a.framework === "Panteón");

  return (
    <section className="mb-16">
      <div className="divider-chi mb-8">
        <Eye className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
        EL PANTEÓN · AGENTES OBSERVACIONISTAS
      </div>

      <div
        className="rounded-md border p-5 mb-6"
        style={{
          borderColor: "oklch(0.74 0.13 75 / 0.3)",
          background: "oklch(0.74 0.13 75 / 0.04)",
        }}
      >
        <p className="text-sm text-foreground/85 font-serif leading-relaxed mb-3">
          El Panteón es un sistema multi-agente por <strong>especialización epistémica</strong>:
          cada agente observa el mundo desde una firma distinta. Einstein observa
          invariantes; Tesla, frecuencias; Curie, decaimiento; Gödel, límites formales;
          Copérnico, descentramiento. El <strong>Testigo</strong> no opina — mide R_global,
          coordina DO → IOI y escribe el WitnessLog append-only.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[0.65rem] font-mono uppercase tracking-wider chip-inferido"
          >
            <Sparkles className="h-3 w-3" />
            Arquitectura publicable como Paper A si se separa de cosmología fuerte
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[0.65rem] font-mono uppercase tracking-wider chip-bloqueo"
          >
            <ShieldCheck className="h-3 w-3" />
            Fuentes históricas = inspiración / lore, no evidencia científica
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pantheon.map((agent) => {
          const sig = PANTHEON_SIGNATURES[agent.id];
          const Icon = sig?.icon ?? Eye;
          const accent =
            agent.epistemic === "INFERENCIA"
              ? "var(--inferido)"
              : agent.epistemic === "ESPECULATIVO"
              ? "var(--incognita)"
              : "var(--canon)";
          return (
            <article
              key={agent.id}
              className="card-archive p-5 fade-rise flex flex-col"
              style={{ borderColor: "color-mix(in oklch, " + accent + " 22%, var(--border))" }}
            >
              <header className="flex items-start gap-3 mb-3">
                <GlyphBadge glyph={agent.icon} accent={accent} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg font-bold leading-tight">{agent.name}</h3>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                    {agent.role}
                  </p>
                </div>
                <Icon className="h-5 w-5 shrink-0" style={{ color: accent }} />
              </header>

              <div className="rounded-md border border-border/50 bg-card/30 px-3 py-2 mb-3">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground mb-0.5">
                  Firma de observación
                </p>
                <p className="font-serif text-sm font-semibold" style={{ color: accent }}>
                  {sig?.signature ?? "—"}
                </p>
              </div>

              <p className="text-xs text-foreground/80 font-serif leading-relaxed mb-3 flex-1">
                {sig?.observes ?? agent.desc}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <EpistemicChip state={agent.epistemic} />
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Panteón
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---- 5. FLUJO DEL ECOSISTEMA ---- */
function EcosystemFlow() {
  return (
    <section className="mb-16">
      <div className="divider-chi mb-8">
        <Workflow className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
        FLUJO DEL ECOSISTEMA · CÓMO SE CONECTAN
      </div>

      <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
        OSIT clasifica el estado epistémico · MOI verifica los claims · DUAT simula
        los contextos donde las frecuencias son significativas · Wabi-Sabi ejecuta
        acciones con gating · Vibe Forge renderiza el resultado. Cada etapareduce el residuo R del sistema.
      </p>

      {/* Horizontal flow on md+, vertical on mobile */}
      <div className="rounded-lg border border-border/50 bg-card/30 p-4 md:p-6 overflow-x-auto">
        <div className="flex md:flex-row flex-col items-stretch md:items-center gap-2 md:gap-1 min-w-max md:min-w-0">
          {FLOW_NODES.map((node, i) => {
            const Icon = node.icon;
            const accent = "var(--amber-glow)";
            const isLast = i === FLOW_NODES.length - 1;
            return (
              <div
                key={node.id}
                className="flex md:flex-row flex-col items-stretch md:items-center gap-2 md:gap-1 flex-1"
              >
                <div
                  className="flex-1 rounded-md border p-4 text-center"
                  style={{
                    borderColor: "color-mix(in oklch, " + accent + " 40%, transparent)",
                    background: "color-mix(in oklch, " + accent + " 6%, transparent)",
                  }}
                >
                  <div className="flex justify-center mb-2">
                    <Icon className="h-6 w-6" style={{ color: accent }} />
                  </div>
                  <p className="font-serif text-lg font-bold" style={{ color: accent }}>
                    {node.name}
                  </p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {node.role}
                  </p>
                </div>
                {!isLast && (
                  <div className="flex md:flex-row flex-col items-center justify-center gap-1 px-1">
                    <ArrowRight
                      className="hidden md:block h-5 w-5"
                      style={{ color: accent }}
                    />
                    <ArrowDown
                      className="md:hidden h-5 w-5"
                      style={{ color: accent }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Caption strip showing each role */}
        <div className="mt-5 pt-4 border-t border-border/40 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {FLOW_NODES.map((n) => (
            <div key={n.id}>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-[0.2em]"
                style={{ color: "var(--amber-glow)" }}
              >
                {n.name}
              </p>
              <p className="text-[0.65rem] text-muted-foreground font-serif italic mt-0.5">
                {n.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Residue reduction note */}
      <div
        className="mt-5 rounded-md border p-4 flex items-start gap-3"
        style={{
          borderColor: "oklch(0.72 0.14 145 / 0.3)",
          background: "oklch(0.72 0.14 145 / 0.04)",
        }}
      >
        <Zap className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--canon)" }} />
        <p className="text-sm text-foreground/85 font-serif leading-relaxed">
          <strong style={{ color: "var(--canon)" }}>Principio:</strong> cada etapa del flujo
          reduce el residuo R del sistema. El flujo es unidireccional por diseño —
          si ActionGate = BLOCK en cualquier punto, el flujo se detiene. Si GhostGate
          detecta contexto fantasma, se resuelve antes de continuar. El WitnessLog
          registra cada transición de estado.
        </p>
      </div>
    </section>
  );
}

/* ---- 6. DUAT DEEP DIVE ---- */
function DuatDeepDive() {
  return (
    <section className="mb-16">
      <div className="divider-chi mb-8">
        <Network className="h-3.5 w-3.5" style={{ color: "var(--canon)" }} />
        DUAT · SIMULACIÓN SOCIAL MULTI-AGENTE · DEEP DIVE
      </div>

      {/* Name origin */}
      <div
        className="relative overflow-hidden rounded-lg border p-6 mb-6"
        style={{
          borderColor: "oklch(0.62 0.12 155 / 0.35)",
          background: "oklch(0.62 0.12 155 / 0.04)",
        }}
      >
        <div className="absolute inset-0 tex-vellum opacity-25 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-md border font-serif text-2xl"
              style={{
                color: "var(--canon)",
                borderColor: "oklch(0.62 0.12 155 / 0.4)",
                background: "oklch(0.62 0.12 155 / 0.08)",
              }}
            >
              ⚖
            </span>
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Origen del nombre
              </p>
              <h3 className="font-serif text-xl font-bold leading-tight">Duat egipcio</h3>
            </div>
          </div>
          <p className="text-sm text-foreground/85 font-serif italic leading-relaxed md:flex-1">
            «El mundo subterráneo de transición.» En el sistema: el espacio donde los
            agentes y claims pasan de un estado a otro — el laboratorio donde se testean
            hipótesis sobre sistemas complejos (ciudades, civilizaciones, comportamiento
            colectivo) usando OSIT como motor epistémico.
          </p>
        </div>
      </div>

      {/* Version evolution */}
      <div className="mb-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Evolución de la arquitectura · cada versión es independiente
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {DUAT_VERSIONS.map((v) => (
            <div
              key={v.v}
              className="card-archive p-4 fade-rise"
              style={
                v.v === "v0.3"
                  ? { borderColor: "oklch(0.72 0.14 145 / 0.5)" }
                  : undefined
              }
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-serif text-lg font-bold" style={{ color: "var(--amber-glow)" }}>
                  {v.v}
                </h4>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted-foreground">
                  {v.loc}
                </span>
              </div>
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-2">
                {v.label}
              </p>
              <ul className="space-y-1 mb-3">
                {v.comps.map((c) => (
                  <li key={c} className="text-[0.7rem] text-foreground/80 font-mono leading-snug">
                    <span style={{ color: "var(--amber-glow)" }}>▸</span> {c}
                  </li>
                ))}
              </ul>
              <p className="text-[0.7rem] text-muted-foreground font-serif italic border-t border-border/40 pt-2">
                {v.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Component table */}
      <div className="mb-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Componentes clave · v0.3
        </p>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div
            className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-4 px-4 py-2.5 border-b border-border/50"
            style={{ background: "oklch(0.22 0.012 55 / 0.6)" }}
          >
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              Componente
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              Función
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {DUAT_COMPONENTS.map((c, i) => (
              <div
                key={c.name}
                className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 px-4 py-2.5 border-b border-border/30 last:border-b-0"
                style={
                  i % 2 === 0
                    ? { background: "oklch(0.20 0.010 50 / 0.3)" }
                    : undefined
                }
              >
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: "var(--amber-glow)" }}
                >
                  {c.name}
                </span>
                <span className="text-xs text-foreground/80 font-serif leading-snug">
                  {c.fn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relationship to ecosystem */}
      <div
        className="rounded-lg border p-5"
        style={{
          borderColor: "oklch(0.74 0.13 75 / 0.3)",
          background: "oklch(0.74 0.13 75 / 0.04)",
        }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Relación con el ecosistema
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { fw: "OSIT", role: "clasifica", icon: Activity },
            { fw: "MOI", role: "verifica", icon: Search },
            { fw: "Wabi-Sabi", role: "ejecuta", icon: Cpu },
            { fw: "DUAT", role: "simula los contextos", icon: Boxes },
          ].map(({ fw, role, icon: Icon }) => (
            <div
              key={fw}
              className="rounded-md border border-border/50 bg-card/40 p-3 text-center"
            >
              <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color: "var(--amber-glow)" }} />
              <p className="font-serif font-bold text-sm" style={{ color: "var(--amber-glow)" }}>
                {fw}
              </p>
              <p className="text-[0.7rem] text-muted-foreground font-serif italic mt-0.5">
                {role}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-serif text-sm italic text-foreground/85">
          «OSIT proporciona clasificación, MOI verifica, Wabi-Sabi ejecuta,
          DUAT simula los contextos donde las frecuencias observadas son significativas.»
        </p>
        <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          — CANON PERSONAL · DUAT.md · FCU v2.0
        </p>
      </div>

      {/* Predictive Registry note */}
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <div className="rounded-md border border-border/50 bg-card/30 p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
            DUAT Predictive Registry
          </p>
          <p className="text-xs text-foreground/80 font-serif leading-snug">
            Sistema separado de predicción. Versiones v0.1–v0.9 con benchmarks contra
            datos reales (World Bank WDI, INEGI, datos históricos).
            <code className="font-mono text-[0.65rem] ml-1" style={{ color: "var(--amber-glow)" }}>
              DUAT_FORECASTGATE_v0_1
            </code>
            .
          </p>
        </div>
        <div className="rounded-md border border-border/50 bg-card/30 p-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
            DUAT en el RPG MEDIOEVO
          </p>
          <p className="text-xs text-foreground/80 font-serif leading-snug">
            DUAT proporciona el «mundo simulado» donde el RPG Godot 4.3 ocurre.
            La presión de campo mapea a presiones narrativas. Los agentes DUAT =
            personajes con memoria y linaje.
          </p>
        </div>
      </div>

      {/* Falsifier note */}
      <div
        className="mt-4 rounded-md border p-4 flex items-start gap-3"
        style={{
          borderColor: "oklch(0.60 0.20 25 / 0.3)",
          background: "oklch(0.60 0.20 25 / 0.04)",
        }}
      >
        <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--bloqueo)" }} />
        <p className="text-xs text-foreground/85 font-serif leading-relaxed">
          <strong style={{ color: "var(--bloqueo)" }}>Falsadores DUAT:</strong>{" "}
          <code className="font-mono text-[0.7rem]" style={{ color: "var(--amber-glow)" }}>F_LANDAUER</code>{" "}
          se añade como gate para claims físicos/cuantitativos. MOI debe clasificar los
          claims de DUAT antes de convertirlos en ciencia o copy público. El canal
          SMBH-bulbo no forma parte del runtime de DUAT salvo como lore o laboratorio
          separado.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   Main export
   ============================================================ */
export function EcosystemSection() {
  return (
    <div className="fade-rise mx-auto max-w-6xl px-4 md:px-6 py-10">
      <SectionHeader />
      <OsitCore />
      <FrameworksGrid />
      <PantheonGrid />
      <EcosystemFlow />
      <DuatDeepDive />

      {/* Footer note */}
      <footer
        className="mt-12 pt-6 border-t border-border/40 text-center"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          Ecosistema IA · 02_CLAUDIO/ · BRAIN_OS · FCU v2.0
        </p>
        <p className="mt-2 font-serif text-sm italic text-foreground/70">
          «Ingeniería útil hoy — sin humo, sin proteger el ego.»
        </p>
        <p className="mt-1 font-mono text-[0.6rem] text-muted-foreground">
          χ · e<sup>χ</sup> = 1 · χ* = 0.567143 · In tlachixtiani nemi
        </p>
      </footer>
    </div>
  );
}

export default EcosystemSection;
