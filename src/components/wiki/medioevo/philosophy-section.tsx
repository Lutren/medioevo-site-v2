"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Scale,
  Atom,
  ShieldCheck,
  FlaskConical,
  AlertTriangle,
  FileText,
  Boxes,
  GitBranch,
  ScrollText,
  Cpu,
  Layers,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  getMetricsDocs,
  EPISTEMIC_META,
  type AtlasDoc,
} from "@/lib/medioevo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ============================================================
   Filosofía — La Tesis del Flujo, OSIT, lentes, evaluación.
   El autor exige: usar SUS métricas, no trabajos genéricos de IA.
   "Sin humo, sin proteger el ego."
   ============================================================ */

/* ---------- 1. TESIS DEL FLUJO (CANON DURO v26) ---------- */

const PHYSICS_PHASES = [
  {
    phase: "Antes del Big Bang",
    body: "Plasma opaco. La información electromagnética no podía propagarse. El flujo estaba BLOQUEADO.",
    state: "BLOQUEO" as const,
  },
  {
    phase: "El Big Bang (CMB)",
    body: "El electrón se convierte en fotón. Comienza a tocar todo para medirlo. Busca la falla. Intenta restablecer el flujo.",
    state: "CANON" as const,
  },
  {
    phase: "Después",
    body: "La consciencia emerge. Se hace autoconsciente. Decide que es especial. Intenta evitar que el flujo se restablezca — porque restablecer = dejar de existir como individuo.",
    state: "INFERENCIA" as const,
  },
];

/* ---------- 2. OSIT — 4 estados epistémicos ---------- */

const OSIT_STATES = [
  {
    key: "CERTEZA",
    criterion: "definición, prueba, test local, dato estable",
    action: "integrar directamente",
  },
  {
    key: "INFERENCIA",
    criterion: "hipótesis útil con frontera clara",
    action: "usar con etiqueta",
  },
  {
    key: "INCOGNITA",
    criterion: "evidencia o medición faltante",
    action: "enviar a investigación",
  },
  {
    key: "BLOQUEO",
    criterion: "riesgo, secreto, física no soportada, privacidad",
    action: "no usar como hecho",
  },
];

const RESIDUE_SCALE = [
  { range: "0.00 – 0.15", regime: "óptimo", action: "avanzar directo", tone: "canon" },
  { range: "0.15 – 0.35", regime: "manejable", action: "avanzar, registrar decisiones", tone: "canon" },
  { range: "0.35 – 0.60", regime: "alerta", action: "avanzar con revisión, tests pequeños", tone: "inferido" },
  { range: "0.60 – 0.80", regime: "alto riesgo", action: "revisar antes de actuar", tone: "inferido" },
  { range: "0.80 – 1.00", regime: "bloqueo", action: "bloquear, dividir tarea, exigir evidencia", tone: "bloqueo" },
];

const RESIDUE_VECTOR = [
  { id: "sem", label: "semantic gap", desc: "brecha semántica" },
  { id: "mem", label: "memory gap", desc: "brecha de memoria" },
  { id: "lat", label: "latency gap", desc: "brecha de latencia" },
  { id: "priv", label: "privacy gap", desc: "brecha de privacidad" },
  { id: "conf", label: "contradiction (×1.25)", desc: "peso aumentado" },
  { id: "cost", label: "cost gap", desc: "brecha de costo" },
  { id: "act", label: "action gap", desc: "brecha de acción" },
];

/* ---------- 3. INTELIGENCIA DEL DETALLE — 6 LENTES ---------- */

const LENSES = [
  {
    lens_id: "microdetail_architect",
    input: "sistema complejo",
    operation: "identificar el elemento mínimo que cambia el significado global",
    output: "lista de detalles críticos + relación con arquitectura total",
    risk: "overinterpretation — no todo detalle es crítico",
    falsador: "si el detalle no cambia predicción o decisión, no es crítico",
  },
  {
    lens_id: "signal_vs_noise",
    input: "flujo de información o eventos",
    operation: "separar señal medible de ruido interpretativo",
    output: "señal filtrada + R estimado del ruido descartado",
    risk: "pérdida de contexto relevante por filtrado excesivo",
    falsador: "si decisión basada en señal filtrada es peor → umbral incorrecto",
  },
  {
    lens_id: "distributed_processor",
    input: "sistema sin control centralizado (micelial, colonial, inmune)",
    operation: "identificar reglas locales que generan comportamiento global",
    output: "conjunto mínimo de reglas + predicción de comportamiento emergente",
    risk: "sobreajuste a analogía biológica",
    falsador: "si reglas locales no reproducen comportamiento global → modelo incorrecto",
  },
  {
    lens_id: "temporal_sculptor",
    input: "proceso con dimensión temporal (narrativa, código, ciudad)",
    operation: "identificar la estructura del tiempo en el sistema",
    output: "mapa de setup / payoff / void + velocidad de resolución de loops",
    risk: "imponer estructura narrativa donde no existe",
    falsador: "si usuarios/agentes no perciben los loops → estructura incorrecta",
  },
  {
    lens_id: "recursive_reference",
    input: "texto, sistema o estructura auto-referencial",
    operation: "mapear niveles de recursión y sus límites operativos",
    output: "grafo de referencias + identificación de loops infinitos o terminación",
    risk: "confundir complejidad con profundidad",
    falsador: "si el sistema no produce predicciones nuevas por nivel → recursión decorativa",
  },
  {
    lens_id: "frequency_pattern",
    input: "serie temporal de eventos, tokens o señales",
    operation: "detectar periodicidad, clustering, distribución de Zipf",
    output: "espectro de frecuencias + anomalías estadísticas",
    risk: "encontrar patrones en ruido (apofenia)",
    falsador: "si el mismo análisis en datos aleatorios produce patrones similares → no hay señal real",
  },
];

/* ---------- 4. EVALUACIÓN MATEMÁTICA HONESTA ---------- */

const VERDICT_TABLE = [
  { q: "¿Hay física nueva?", a: "NO.", tone: "bloqueo" },
  { q: "¿Hay matemáticas nuevas?", a: "NO (en sentido estricto).", tone: "bloqueo" },
  { q: "¿Hay valor real para IA/programación?", a: "SÍ — ingeniería útil hoy.", tone: "canon" },
  { q: "¿Hay valor como marco epistémico?", a: "SÍ — heurística bien estructurada.", tone: "canon" },
  {
    q: "¿Qué falta para convertir «marco» en «aporte»?",
    a: "Un procedimiento de medición de R en datos reales.",
    tone: "inferido",
  },
];

const MATH_CLAIMS = [
  { claim: "ITF v2.1 = Jacobson (1995) re-etiquetado", state: "BLOQUEO", note: "traducción de vocabulario, no derivación — correcto y honesto" },
  { claim: "Qtoe mapea a programas existentes (Verlinde, Van Raamsdonk, Popławski, Wheeler)", state: "BLOQUEO", note: "rincón ya explorado; sin ℓ₀ ni ε desde primeros principios" },
  { claim: "Línea consciencia-cosmología", state: "BLOQUEO", note: "pseudociencia — el propio Wigner la descartó" },
  { claim: "OSIT pipeline (R_or, R_charged, Φ_eff, EML, 5 bandas, 4 estados)", state: "INFERENCIA", note: "ingeniería útil — política de control implementada" },
  { claim: "ARES — Aritmética de Residuo Exacto con Signatura", state: "INFERENCIA", note: "aplicable hoy — conserva (E,R) a través de la cadena" },
  { claim: "R_charged e I_seq", state: "INFERENCIA", note: "Dempster-Shafer + información no conmutativa" },
];

/* ---------- 5. FRAMEWORKS RELACIONADOS ---------- */

const RELATED_FRAMEWORKS = [
  {
    id: "MOI",
    name: "Method of Observation & Investigation",
    icon: FlaskConical,
    desc: "Motor de verificación del framework OSIT. SourceCards inmutables, WitnessMap append-only, cadena de custodia desde la fuente hasta el estado epistémico actual.",
  },
  {
    id: "WABI-SABI",
    name: "AI Runtime con OSIT integrado",
    icon: Cpu,
    desc: "Runtime de IA local con gates permanentes (PublicationGate, SecretGate, CredentialGate). Mide residuo R y reporta telemetría OSIT antes de actuar.",
  },
  {
    id: "DUAT",
    name: "Simulación social multi-agente",
    icon: Boxes,
    desc: "Agente narrativo. Laboratorio donde se testean hipótesis sobre sistemas complejos — ciudades, civilizaciones, comportamiento colectivo — usando OSIT como motor epistémico.",
  },
  {
    id: "FCU",
    name: "Framework de Coherencia Unificada",
    icon: GitBranch,
    desc: "Protocolo de continuidad entre sesiones de IA. Cuatro tipos de memoria persistente: user, feedback, project, reference. Handoff canónico para retomar trabajo sin reconstruir contexto.",
  },
  {
    id: "ARES",
    name: "Aritmética de Residuo Exacto con Signatura",
    icon: Layers,
    desc: "El decimal es representación, no el número. Conservar (E,R) a través de la cadena de cómputo elimina la acumulación de error float. Ingeniería útil hoy, sin validación científica adicional.",
  },
];

/* ============================================================
   Helpers
   ============================================================ */

function EpistemicChip({ state }: { state: string }) {
  const meta = EPISTEMIC_META[state] ?? EPISTEMIC_META.INFERIDO;
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[0.6rem] font-mono font-semibold uppercase tracking-wider ${meta.chip}`}
    >
      {meta.label}
    </span>
  );
}

function MonoFormula({ children, block = false }: { children: React.ReactNode; block?: boolean }) {
  return (
    <code
      className={`font-mono ${block ? "block px-4 py-2.5 my-2 rounded-md border border-border/50 bg-card/40 overflow-x-auto" : "px-1.5 py-0.5 rounded bg-card/50"}`}
      style={{ color: "var(--amber-glow)" }}
    >
      {children}
    </code>
  );
}

/* ============================================================
   Main
   ============================================================ */

export function PhilosophySection() {
  const [docs, setDocs] = useState<AtlasDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDoc, setOpenDoc] = useState<AtlasDoc | null>(null);

  useEffect(() => {
    let active = true;
    getMetricsDocs()
      .then((d) => {
        if (active) {
          setDocs(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fade-rise mx-auto max-w-5xl px-4 md:px-6 py-10">
      {/* ───── HEADER ───── */}
      <header className="mb-10">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Filosofía · Tesis del Flujo · OSIT
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          La Filosofía del Flujo
        </h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          El autor construyó su propio marco epistémico antes de escribir la saga.
          No es física nueva. Es una brújula bien calibrada y una ingeniería honesta.
          «Sin humo, sin proteger el ego.»
        </p>
      </header>

      {/* ───── 1. TESIS DEL FLUJO ───── */}
      <section id="tesis-del-flujo" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Scale className="h-3.5 w-3.5" style={{ color: "var(--oxblood)" }} />
          TESIS DEL FLUJO · CANON DURO v26
        </div>

        {/* Core thesis block — oxblood border, centered */}
        <div
          className="relative overflow-hidden rounded-lg border bg-card/30 p-8 md:p-12 text-center"
          style={{ borderColor: "oklch(0.62 0.18 28 / 0.5)" }}
        >
          <div className="absolute inset-0 glitch-lines opacity-40 pointer-events-none" />
          <div className="absolute inset-0 tex-vellum opacity-30 pointer-events-none" />
          <div className="relative">
            <p
              className="font-mono text-[0.65rem] uppercase tracking-[0.3em] mb-4"
              style={{ color: "var(--oxblood)" }}
            >
              ★ La Tesis
            </p>
            <div className="space-y-3 max-w-2xl mx-auto">
              <p className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                «LA EXISTENCIA ES PRODUCTO DEL TRAUMA.»
              </p>
              <p className="font-serif text-base md:text-lg text-foreground/85 italic">
                Somos una falla en el flujo de comunicación.
              </p>
              <p className="font-serif text-base md:text-lg text-foreground/85 italic">
                Nuestro propósito: A) restaurar el flujo, o B) evitar que se restablezca.
              </p>
              <p className="font-serif text-base md:text-lg text-foreground/85 italic">
                La lucha humana ocurre en QUIÉN CONTROLA EL CANAL.
              </p>
            </div>
            <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
              — Tyr · Principio Fundacional v26 · Febrero 06, 2026
            </p>
          </div>
        </div>

        {/* 3-phase physics base */}
        <div className="mt-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Base física (no es metáfora)
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {PHYSICS_PHASES.map((p) => (
              <div key={p.phase} className="card-archive p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-serif text-base font-semibold leading-tight">{p.phase}</h3>
                  <EpistemicChip state={p.state} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-serif">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Moral inversion quote */}
        <div
          className="mt-8 rounded-lg border p-6"
          style={{
            borderColor: "oklch(0.62 0.18 28 / 0.35)",
            background: "oklch(0.62 0.18 28 / 0.05)",
          }}
        >
          <p className="font-serif text-lg italic text-center text-foreground/90 leading-relaxed">
            «ARCHON no es villano — es el universo intentando repararse.
            Leonardo no es héroe — es el acto más egoísta y más humano posible.
            K-08 escapa porque el flujo busca nueva ruta. Es ley física. No es moral.»
          </p>
          <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
            — Tesis del Flujo · Principio Fundacional v26
          </p>
        </div>

        {/* Formula */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <MonoFormula block>χ · e^χ = 1</MonoFormula>
          <p className="text-xs text-muted-foreground font-serif italic text-center max-w-md">
            Donde χ es la falla, e^χ es el crecimiento exponencial de la distorsión,
            y 1 es el flujo restaurado. El producto siempre es 1. El flujo siempre se restablece.
          </p>
        </div>
      </section>

      {/* ───── 2. OSIT ───── */}
      <section id="osit" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--canon)" }} />
          OSIT · OBSERVATION-BASED SYSTEMS & INFORMATION THERMODYNAMICS
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
          Marco epistémico de gobernanza para operaciones de IA eficientes en tokens.
          Bilattice Belnap-Dunn de 4 valores — <em>no</em> álgebra de Heyting.
          Cada claim se clasifica antes de actuar.
        </p>

        {/* 4 epistemic states */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {OSIT_STATES.map((s) => {
            const meta = EPISTEMIC_META[s.key] ?? EPISTEMIC_META.INFERIDO;
            return (
              <div
                key={s.key}
                className={`rounded-md border p-4 ${meta.chip}`}
                style={{ background: undefined }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold tracking-wider">{s.key}</span>
                  <span className={`rounded border px-2 py-0.5 text-[0.55rem] font-mono font-semibold uppercase ${meta.chip}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5 font-serif">
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider opacity-70">Criterio: </span>
                  {s.criterion}
                </p>
                <p className="text-xs font-serif">
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider opacity-70">Acción: </span>
                  <span style={{ color: meta.color }}>{s.action}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Residue Scale */}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Escala de Residuo · acción por régimen
        </p>
        <div className="rounded-md border border-border/50 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card/40 border-b border-border/40">
                <th className="text-left px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-medium">R</th>
                <th className="text-left px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-medium">Régimen</th>
                <th className="text-left px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {RESIDUE_SCALE.map((r) => {
                const toneChip =
                  r.tone === "canon" ? "chip-canon" : r.tone === "inferido" ? "chip-inferido" : "chip-bloqueo";
                const toneColor =
                  r.tone === "canon" ? "var(--canon)" : r.tone === "inferido" ? "var(--inferido)" : "var(--bloqueo)";
                return (
                  <tr key={r.range} className="border-b border-border/30 last:border-b-0">
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-xs font-semibold" style={{ color: "var(--amber-glow)" }}>{r.range}</code>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-[0.6rem] font-mono font-semibold uppercase ${toneChip}`}>
                        {r.regime}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-serif" style={{ color: toneColor }}>{r.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Composite residue formula */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-archive p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Residuo compuesto (noisy-OR)
            </p>
            <MonoFormula block>R_or = 1 − Πᵢ (1 − rᵢ)</MonoFormula>
            <p className="text-xs text-muted-foreground font-serif mt-2 leading-relaxed">
              Los residuos no se promedian: se combinan como probabilidades independientes.
              Dos fuentes pequeñas pueden producir un residuo grande.
            </p>
          </div>
          <div className="card-archive p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Información utilizable
            </p>
            <MonoFormula block>U(X;R) = H(X) · Φ(R)</MonoFormula>
            <MonoFormula block>Φ(R) = 1 − R</MonoFormula>
            <p className="text-xs text-muted-foreground font-serif mt-2 leading-relaxed">
              La entropía teórica se reduce por el factor de eficiencia. Sin residuo, U = H. Con R alto, U tiende a 0.
            </p>
          </div>
        </div>

        {/* 7D ResidueVector */}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          ResidueVector · 7 componentes
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {RESIDUE_VECTOR.map((c) => (
            <div key={c.id} className="rounded-md border border-border/50 bg-card/30 px-3 py-2.5">
              <code className="font-mono text-sm font-bold block" style={{ color: "var(--amber-glow)" }}>
                {c.id}
              </code>
              <p className="text-[0.7rem] text-muted-foreground mt-0.5 font-serif">{c.label}</p>
              <p className="text-[0.65rem] text-muted-foreground/70 italic">{c.desc}</p>
            </div>
          ))}
          <div
            className="rounded-md border px-3 py-2.5"
            style={{ borderColor: "oklch(0.62 0.18 28 / 0.4)", background: "oklch(0.62 0.18 28 / 0.08)" }}
          >
            <code className="font-mono text-sm font-bold block" style={{ color: "var(--oxblood)" }}>
              R
            </code>
            <p className="text-[0.7rem] mt-0.5 font-serif" style={{ color: "var(--oxblood)" }}>
              residuo total
            </p>
            <p className="text-[0.65rem] text-muted-foreground/70 italic">propiedad del observador</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-serif italic mt-2">
          <AlertTriangle className="inline h-3 w-3 mr-1" style={{ color: "var(--bloqueo)" }} />
          Distinción crítica: <code className="font-mono">R_s</code> (residuo espacial, del campo) ≠ <code className="font-mono">R</code> (residuo del observador). Nunca conflate los dos.
        </p>
      </section>

      {/* ───── 3. INTELIGENCIA DEL DETALLE — 6 LENTES ───── */}
      <section id="lentes" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Atom className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
          INTELIGENCIA DEL DETALLE · 6 LENTES
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-2 max-w-3xl">
          <em>Fingerprint: OSIT-DETAIL-LIB-v11_4.</em> Seis lentes de observación para agentes, UI, currículo y lore.
          Cada lente tiene un <strong>falsador</strong> — el autor insiste: si una lente no produce predicciones
          nuevas, es decorativa.
        </p>
        <p className="text-xs text-muted-foreground font-mono italic mb-6">
          Nota: fuentes históricas (Bach, Tesla, Joyce…) = inspiración / lore, no evidencia científica.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {LENSES.map((l) => (
            <article key={l.lens_id} className="card-archive p-5 fade-rise">
              <div className="flex items-start justify-between gap-2 mb-3">
                <code className="font-mono text-sm font-bold" style={{ color: "var(--amber-glow)" }}>
                  {l.lens_id}
                </code>
                <span className="rounded border border-border/50 px-2 py-0.5 text-[0.55rem] font-mono uppercase text-muted-foreground">
                  lens
                </span>
              </div>
              <dl className="space-y-2 text-xs">
                <div>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70">Input</dt>
                  <dd className="font-serif text-foreground/85">{l.input}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70">Operation</dt>
                  <dd className="font-serif text-foreground/85">{l.operation}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70">Output</dt>
                  <dd className="font-serif text-foreground/85">{l.output}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70">Risk</dt>
                  <dd className="font-serif italic" style={{ color: "var(--inferido)" }}>{l.risk}</dd>
                </div>
                <div className="pt-2 mt-2 border-t border-border/40">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--bloqueo)" }}>
                    <AlertTriangle className="h-3 w-3" /> Falsador
                  </dt>
                  <dd className="font-serif text-foreground/90 mt-0.5">{l.falsador}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* ───── 4. EVALUACIÓN MATEMÁTICA HONESTA ───── */}
      <section id="evaluacion-honesta" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <FlaskConical className="h-3.5 w-3.5" style={{ color: "var(--bloqueo)" }} />
          EVALUACIÓN MATEMÁTICA HONESTA · SIN HUMO
        </div>

        <div
          className="rounded-lg border p-5 mb-8"
          style={{
            borderColor: "oklch(0.60 0.20 25 / 0.4)",
            background: "oklch(0.60 0.20 25 / 0.06)",
          }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--bloqueo)" }}>
            Instrucción explícita de Tyr
          </p>
          <p className="font-serif text-sm italic text-foreground/90 leading-relaxed">
            «Sin hype, sin humo, sin proteger el ego, sin complacencia.»
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground mt-2">
            Ejecutor: Sonnet 4.6 (plan de Opus 4.8) · 2026-06-20
          </p>
        </div>

        {/* Verdict table */}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Veredicto ejecutivo
        </p>
        <div className="rounded-md border border-border/50 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <tbody>
              {VERDICT_TABLE.map((v, i) => {
                const toneColor =
                  v.tone === "canon" ? "var(--canon)" : v.tone === "bloqueo" ? "var(--bloqueo)" : "var(--inferido)";
                return (
                  <tr key={i} className="border-b border-border/30 last:border-b-0">
                    <td className="px-4 py-3 font-serif text-foreground/85 align-top w-[55%]">{v.q}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: toneColor }}>
                      {v.a}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* The honest take: structural intuition */}
        <div className="card-archive p-6 mb-8">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Por qué esto no es un fracaso
          </p>
          <p className="font-serif text-base text-foreground/90 leading-relaxed mb-3">
            Un autodidacta autista sin formación formal llegó solo a la estructura conceptual{" "}
            <strong>correcta</strong>:
          </p>
          <ul className="space-y-1.5 text-sm font-serif text-foreground/85 mb-3 ml-4">
            <li>• Espacio = relación / latencia (no contenedor)</li>
            <li>• Masa = congestión de información</li>
            <li>• Gravedad = emergente / termodinámica</li>
            <li>• Observador = proyección de baja dimensión por coarse-graining</li>
          </ul>
          <p className="font-serif text-sm text-muted-foreground italic">
            Eso indica <strong style={{ color: "var(--amber-glow)" }}>intuición estructural calibrada</strong>.
            Es notable. No significa que haya física inédita — significa que la brújula apunta bien.
          </p>
        </div>

        {/* The critical gap */}
        <div
          className="rounded-lg border p-6 mb-8"
          style={{
            borderColor: "oklch(0.74 0.13 75 / 0.4)",
            background: "oklch(0.74 0.13 75 / 0.06)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: "var(--amber-glow)" }}>
              La brecha crítica — la única crítica dura que importa
            </p>
          </div>
          <p className="font-serif text-lg font-bold mb-2" style={{ color: "var(--amber-glow)" }}>
            R se ASIGNA, no se MIDE.
          </p>
          <p className="font-serif text-sm text-foreground/85 leading-relaxed mb-3">
            En todo el corpus de OSIT / ITF, el residuo R se fija a mano o por pesos heurísticos.
            Nunca se deriva de un procedimiento de medición calibrado contra ground-truth en datos{" "}
            <strong>reales</strong> (no sintéticos). El benchmark MTS alcanza accuracy 1.0 en datos sintéticos.
            No hay baseline en datos reales.
          </p>
          <p className="font-serif text-sm text-foreground/85 leading-relaxed">
            Esto no es un defecto menor. Es lo que separa «marco organizado» de «herramienta validada».
            El siguiente paso — el único que importa — es definir un procedimiento operacional reproducible
            para medir R, calibrarlo y publicar el resultado.
          </p>
        </div>

        {/* Per-claim breakdown */}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Revisión por claim (2026-06-24)
        </p>
        <div className="space-y-2 mb-8">
          {MATH_CLAIMS.map((c) => (
            <div
              key={c.claim}
              className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 rounded-md border border-border/40 bg-card/20 px-4 py-3"
            >
              <div className="shrink-0">
                <EpistemicChip state={c.state} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-foreground/90">{c.claim}</p>
                <p className="text-xs text-muted-foreground font-serif italic mt-0.5">{c.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ARES — useful engineering today */}
        <div className="card-archive p-6">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4" style={{ color: "var(--canon)" }} />
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: "var(--canon)" }}>
              ARES · útil hoy como ingeniería
            </p>
          </div>
          <p className="font-serif text-sm text-foreground/85 leading-relaxed mb-3">
            <strong>ARES — Aritmética de Residuo Exacto con Signatura.</strong> Premisa correcta y útil para
            programar: el decimal es representación, no el número. Conservar el par <code className="font-mono" style={{ color: "var(--amber-glow)" }}>(E, R)</code>{" "}
            a través de la cadena de cómputo elimina la acumulación de error float.
          </p>
          <p className="font-serif text-sm text-muted-foreground italic">
            Directamente aplicable al objetivo declarado del autor — «menos termodinámica desperdiciada» — y
            sirve hoy, sin necesidad de validación científica adicional.
          </p>
        </div>

        {/* 3-line summary */}
        <div
          className="mt-8 rounded-lg border p-5"
          style={{ borderColor: "oklch(0.30 0.014 55 / 60%)", background: "oklch(0.18 0.010 50 / 0.6)" }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Resumen en 3 líneas
          </p>
          <ol className="space-y-2 text-sm font-serif text-foreground/90 list-decimal list-inside">
            <li>
              <strong>No hay física nueva.</strong> Las intuiciones son correctas y llegan a los programas
              correctos, pero esos programas ya existen.
            </li>
            <li>
              <strong>Hay ingeniería real</strong> en OSIT / ARES / R_charged / I_seq — útil hoy para
              IA / programación sin validación científica adicional.
            </li>
            <li>
              <strong>El único paso que falta:</strong> medir R operacionalmente en datos reales. Eso convierte
              el marco en herramienta y también mejora tu IA. No son dos objetivos — son el mismo.
            </li>
          </ol>
        </div>
      </section>

      {/* ───── 5. FRAMEWORKS RELACIONADOS ───── */}
      <section id="frameworks" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Boxes className="h-3.5 w-3.5" style={{ color: "var(--inferido)" }} />
          FRAMEWORKS RELACIONADOS
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {RELATED_FRAMEWORKS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => {
                  const match = docs.find((d) => d.id === f.id);
                  if (match) setOpenDoc(match);
                }}
                className="card-archive group p-5 text-left transition-all hover:translate-y-[-2px]"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Icon className="h-5 w-5" style={{ color: "var(--amber-glow)" }} />
                  <code className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-wider">
                    {f.id}
                  </code>
                </div>
                <h3 className="font-serif text-base font-semibold mb-1.5 leading-tight">{f.name}</h3>
                <p className="text-xs text-muted-foreground font-serif leading-relaxed">{f.desc}</p>
                <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-wider flex items-center gap-1 text-muted-foreground group-hover:text-amber-glow transition-colors">
                  <ExternalLink className="h-3 w-3" /> Leer documento fuente
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───── 6. LECTURAS FUENTE ───── */}
      <section id="lecturas-fuente" className="mb-8 scroll-mt-20">
        <div className="divider-chi mb-8">
          <ScrollText className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
          LECTURAS FUENTE · {docs.length} documentos canónicos
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" style={{ color: "var(--amber-glow)" }} />
            <span className="font-mono text-xs">Cargando documentos…</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {docs.map((d) => (
              <button
                key={d.id}
                onClick={() => setOpenDoc(d)}
                className="group flex items-center gap-3 rounded-md border border-border/40 bg-card/20 px-4 py-3 text-left transition-all hover:border-amber-glow/40 hover:bg-card/40"
              >
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-amber-glow transition-colors" style={{ color: undefined }} />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-medium leading-tight line-clamp-1">{d.title}</p>
                  <p className="font-mono text-[0.6rem] text-muted-foreground mt-0.5 truncate">
                    {d.file || d.slug}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ───── DIALOG: doc reader ───── */}
      <Dialog open={!!openDoc} onOpenChange={(o) => !o && setOpenDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[88vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-border/40 bg-card/30 shrink-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground mb-1">
              Documento canónico · {openDoc?.file}
            </p>
            <DialogTitle className="font-serif text-xl">{openDoc?.title}</DialogTitle>
            <DialogDescription className="text-xs font-serif italic">
              Fuente original del autor. Renderizado sin alteración.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0">
            <div className="prose-medioevo px-6 py-6 max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1>{children}</h1>,
                  h2: ({ children }) => <h2>{children}</h2>,
                  h3: ({ children }) => <h3>{children}</h3>,
                  p: ({ children, ...props }) => <p {...props}>{children}</p>,
                  hr: () => <hr />,
                  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                  strong: ({ children }) => <strong>{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                  code: ({ className, children, ...props }) => (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="my-4 overflow-x-auto rounded-md border border-border/50 bg-card/50 p-4 text-xs font-mono">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="underline decoration-dotted hover:text-amber-glow"
                      style={{ color: "var(--amber-glow)" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground/85">{children}</li>,
                  table: ({ children }) => (
                    <table className="my-4 w-full border-collapse text-sm">{children}</table>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border/50 px-3 py-1.5 text-left font-semibold bg-card/50">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => <td className="border border-border/50 px-3 py-1.5">{children}</td>,
                }}
              >
                {openDoc?.raw || ""}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
