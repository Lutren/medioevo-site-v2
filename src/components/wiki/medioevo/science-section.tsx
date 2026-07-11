"use client";

import { useState } from "react";
import {
  Gavel,
  XCircle,
  Cog,
  AlertTriangle,
  Lightbulb,
  Columns2,
  CheckCircle2,
  CircleDot,
  FlaskConical,
  Beaker,
  ArrowRight,
  FileText,
  Cpu,
  Layers,
  ShieldCheck,
  Skull,
  Ban,
  Scale,
} from "lucide-react";
import { EPISTEMIC_META } from "@/lib/medioevo";

/* ============================================================
   Ciencia Honesta — Rigorous, no-hype analysis of the
   MEDIOEVO universe's scientific claims.
   Author's explicit demand:
     "Sin hype, sin humo, sin proteger el ego, sin complacencia."
   Falsified claims are presented with the same visual weight
   as the engineering that works. The criticism is not softened.
   Source: EVALUACION_MATEMATICA_HONESTA.md + REGISTRO_CONTRADICCIONES.md
   ============================================================ */

/* ---------- 1. VEREDICTO EJECUTIVO ---------- */
type Tone = "canon" | "inferido" | "bloqueo" | "incognita";

const VERDICT_ROWS: { q: string; a: string; tone: Tone }[] = [
  {
    q: "¿Hay física nueva?",
    a: "NO. Las intuiciones son correctas y llegan a los programas correctos, pero esos programas ya existen.",
    tone: "bloqueo",
  },
  {
    q: "¿Hay matemáticas nuevas?",
    a: "NO (en sentido estricto).",
    tone: "bloqueo",
  },
  {
    q: "¿Hay valor real para IA / programación?",
    a: "SÍ — ingeniería útil hoy.",
    tone: "canon",
  },
  {
    q: "¿Hay valor como marco epistémico?",
    a: "SÍ — heurística bien estructurada.",
    tone: "canon",
  },
  {
    q: "¿Qué falta para convertir «marco» en «aporte»?",
    a: "Un procedimiento de medición de R en datos reales.",
    tone: "inferido",
  },
];

/* ---------- 2. CLAIMS FALSIFICADOS ---------- */
type ClaimVerdict =
  | "FALSADO"
  | "FALSADO/REFORMULADO"
  | "BLOQUEADO"
  | "DESCARTADO"
  | "FALSA EN FORMA GENÉRICA";

interface FalsifiedClaim {
  id: string;
  claim: string;
  verdict: ClaimVerdict;
  formula?: string;
  evidence: string;
  action: string;
}

const FALSIFIED_CLAIMS: FalsifiedClaim[] = [
  {
    id: "F-01",
    claim: "S_BH(Sgr A*) codifica toda la Vía Láctea",
    verdict: "FALSADO",
    formula: "S_BH(Sgr A*) ~ 2.5e90 bits  ≪  cota Bekenstein galáctica ~ 2.6e106 bits",
    evidence:
      "La entropía del agujero negro central queda ~16 órdenes de magnitud por debajo de la cota Bekenstein galáctica. No hay capacidad de codificación suficiente para toda la galaxia.",
    action:
      "Claim físico bloqueado. Puede sobrevivir como metáfora narrativa o hipótesis reformulada con límites explícitos — no como afirmación de física.",
  },
  {
    id: "F-02",
    claim: "S_grav ∝ N²",
    verdict: "FALSADO/REFORMULADO",
    formula: "S_grav = 2 H(p)   →   escala como 2·ln N  (régimen disperso)  /  2·ln K  (régimen saturado)",
    evidence:
      "La versión operacional es entropía de distribución discretizada 2·H(p), no pares N². La función implementable no escala cuadráticamente con el número de entidades.",
    action:
      "No usar S_grav ∝ N² como claim físico ni como argumento de igualdad con entropía de agujero negro.",
  },
  {
    id: "F-03",
    claim: "S_BH = S_grav",
    verdict: "BLOQUEADO",
    formula: "brecha dimensional y de escala  ·  kappa queda ad hoc sin principio físico",
    evidence:
      "Igualar la entropía del agujero negro con la entropía gravitacional de correlación requiere un factor kappa que actualmente no se deriva de ningún principio físico. La brecha es dimensional y de escala.",
    action:
      "Bloqueado hasta que exista un principio físico que fije kappa. No publicar como identidad.",
  },
  {
    id: "F-04",
    claim: "M_BH ∝ σ³",
    verdict: "FALSADO",
    formula: "rango observacional moderno:  α ~ 4.24 – 5.11   (no α = 3)",
    evidence:
      "La relación M-sigma observada en datos modernos no corresponde a una pendiente cúbica. La pendiente propuesta queda fuera del rango observacional documentado.",
    action:
      "Mantener registro del rango α ~ 4.24–5.11 para claims M-sigma. No publicar σ³ como predicción.",
  },
  {
    id: "F-05",
    claim: "T_Hawking = T_CMB",
    verdict: "DESCARTADO",
    formula: "T_H ~ 1e-30 K  (para SMBH)   ≪   T_CMB ~ 2.725 K",
    evidence:
      "La temperatura de Hawking de un agujero negro supermasivo es del orden de 10⁻³⁰ K, mientras que la temperatura del fondo cósmico de microondas es 2.725 K. Diferencia de ~30 órdenes de magnitud.",
    action: "Descartado como claim físico. No revivir.",
  },
  {
    id: "F-06",
    claim: "TNR v2.0 deriva Einstein genéricamente desde un DAG causal",
    verdict: "FALSA EN FORMA GENÉRICA",
    formula: "estado genérico del Hilbert nodal  →  ley de volumen (no ley de área)  →  Jacobson colapsa",
    evidence:
      "Sin dinámica / Hamiltoniano / acción que imponga la ley de área, el estado genérico obedece ley de volumen por Page. Malament no basta; no emerge una variedad lorentziana 4D sin densidad que fije factor conforme y dimensión.",
    action:
      "Requiere métrica causal Myrheim-Meyer, Hamiltoniano explícito, acción discreta Benincasa-Dowker y un falsador espectral que distinga ley de área de ley de volumen antes de cualquier claim fuerte.",
  },
];

/* ---------- 3. INGENIERÍA QUE SÍ FUNCIONA ---------- */
interface RealEngineering {
  id: string;
  name: string;
  icon: typeof Cpu;
  state: "CANON" | "INFERENCIA";
  what: string;
  why: string;
  proof: string;
}

const REAL_ENGINEERING: RealEngineering[] = [
  {
    id: "E-01",
    name: "Pipeline OSIT",
    icon: Cpu,
    state: "CANON",
    what: "R_or → R_charged → Φ_eff → EML → 5 bandas R → 4 estados Belnap-Dunn",
    why: "Política de control implementada y probada para agentes con recursos limitados. Ninguna pieza es nueva individualmente (Noisy-OR/MYCIN, Dempster-Shafer, Belnap-Dunn, gating sigmoide).",
    proof: "Lo genuino (modesto) es la integración en una disciplina operativa local-first. Se entrega como SDK / librería, no como paper de Nature.",
  },
  {
    id: "E-02",
    name: "ARES — Aritmética de Residuo Exacto con Signatura",
    icon: Layers,
    state: "CANON",
    what: "Conservar (E, R) a través de toda la cadena de cómputo; proyectar a decimal SOLO en la capa UI.",
    why: "Premisa correcta y útil: el decimal es representación, no el número. 1/3 = (1, 0) en base 3 → R=0 (exacto). 1/3 ≈ 0.333 en decimal → R=∞ (error de representación acumulable).",
    proof: "Directamente aplicable al objetivo declarado del autor — «menos termodinámica desperdiciada». Sirve hoy, sin necesidad de validación científica adicional.",
  },
  {
    id: "E-03",
    name: "R_charged e I_seq",
    icon: Beaker,
    state: "INFERENCIA",
    what: "R_charged = (Σᵢ Rᵢ · signᵢ) / n   ·   I_seq = Σᵢ wᵢ·I(xᵢ) + λ·Σᵢ<ⱼ Δ(xᵢ, xⱼ)",
    why: "Heurísticas sólidas con hogares matemáticos reales: R_charged → Dempster-Shafer (evidencia opuesta cancela, no promedia); I_seq → información no conmutativa (el orden importa, la recencia pesa).",
    proof: "Aplicaciones directas: construcción de prompts, ranking de evidencia, gestión de ventana de contexto (token-saver). DOI: Lucas 2001, Dubois 2008, Rodrigues 2023.",
  },
  {
    id: "E-04",
    name: "Panteón OSIT — Arquitectura Multiagente",
    icon: ShieldCheck,
    state: "INFERENCIA",
    what: "Un OS donde cada app/módulo es un agente especializado con una firma de observación (Einstein, Tesla, Curie, Eckhart, Asimov, Tolkien, Gödel, Copérnico…).",
    why: "Conceptualmente sólida como arquitectura de especialización. Diferente de los frameworks de agentes existentes en el eje de identidad epistémica: cada agente tiene una «firma de observación» que filtra qué evidencia busca y cómo la pesa.",
    proof: "Publicable como Paper A si se separa radicalmente de cosmología y física fuerte. La condición de publicación: NO incluir agujeros negros, S_BH, S_grav, M-sigma, ni MUEI.",
  },
];

/* ---------- 4. R SE ASIGNA, NO SE MIDE — 3-step path ---------- */
const R_FIX_PATH: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Definir el procedimiento operacional",
    body: "Especificar de forma reproducible: «para medir R en el tipo de tarea X, ejecuta el procedimiento P». Sin ambigüedad, sin pesos ocultos, sin fijar a mano.",
  },
  {
    step: "02",
    title: "Calibrar contra un baseline sensato",
    body: "Demostrar que el R-gating gana a un baseline sensato (por ejemplo, un clasificador simple) en una tarea real — no en datos sintéticos. El benchmark MTS (accuracy 1.0) es 100% sintético; eso no cuenta.",
  },
  {
    step: "03",
    title: "Publicar el procedimiento y el resultado",
    body: "El procedimiento y el resultado se publican para revisión externa. Si sobrevive, el marco pasa de «heurística organizada» a «herramienta validada». Si no sobrevive, se sabe exactamente qué se rompió.",
  },
];

/* ---------- 5. CÓMO MEJORAR — INFERENCIA proposals ---------- */
interface Proposal {
  id: string;
  icon: typeof Lightbulb;
  title: string;
  body: string;
  detail?: string[];
}

const PROPOSALS: Proposal[] = [
  {
    id: "P-01",
    icon: FileText,
    title: "Spec-Driven Development para cada claim",
    body: "Aplicar GitHub Spec Kit (o equivalente) para especificar formalmente cada claim científico con sus falsadores operacionales antes de publicarlo. Un claim sin falsador no es ciencia — es marketing.",
  },
  {
    id: "P-02",
    icon: Scale,
    title: "Límites físicos como falsadores cuantitativos",
    body: "Usar los límites de Landauer (energía por bit borrado), Margolus-Levitin (tiempo mínimo por operación cuántica) y Bekenstein (cota de información por región) como falsadores cuantitativos de cualquier claim que mezcle información y energía. Si el claim los viola, el claim está muerto.",
  },
  {
    id: "P-03",
    icon: FlaskConical,
    title: "Condiciones de rescate para TNR",
    body: "TNR solo puede volver a estado INFERENCIA_ACTIVA si se formalizan y prueban estos componentes. Sin ellos, queda falsa en forma genérica:",
    detail: [
      "Métrica causal tipo Myrheim-Meyer que fije dimensión y factor conforme.",
      "Hamiltoniano / dinámica explícita para restringir estados del DAG.",
      "Hamiltoniano modular local  K_R = −ln(ρ_R)  para regiones causales.",
      "Acción discreta tipo Benincasa-Dowker que suprima conectividad excesiva.",
      "D'Alembertiano discreto que converja a operador lorentziano continuo.",
      "Condición espectral / falsador que distinga ley de área de ley de volumen.",
    ],
  },
  {
    id: "P-04",
    icon: ArrowRight,
    title: "Línea de publicación segura",
    body: "Dos papers, ambos SIN física fuerte. Paper A: Panteón como arquitectura multiagente epistémica — no incluir agujeros negros, cosmología ni MUEI. Paper B: RAIT y transiciones de fase / mode collapse en modelos generativos — no incluir S_grav, S_BH, M-sigma ni claims físicos. DUAT / MOI / OSIT: conservar como ingeniería local-first, simulación y gating de claims.",
  },
  {
    id: "P-05",
    icon: Columns2,
    title: "Separar CANON narrativo de INFERENCIA científica",
    body: "Nunca confundir lore con evidencia. La saga es CANON narrativo: verdadero dentro del universo de ficción, no afirmación sobre el mundo real. El marco OSIT es INFERENCIA científica: hipótesis de trabajo con frontera clara. Cuando la saga contradice la física real, es worldbuilding — no error. Cuando el marco se vende como física real sin validar, es pseudociencia.",
  },
];

/* ---------- 6. LORE vs ENGINEERING ---------- */
const LORE_VS_ENG: {
  lore: { item: string; note: string };
  eng: { item: string; note: string };
}[] = [
  {
    lore: {
      item: "«La existencia es producto del trauma.»",
      note: "Premisa filosófica de la saga. No es física. Es la tesis narrativa que mueve la trama.",
    },
    eng: {
      item: "Lambert W:  χ · e^χ = 1  ⇒  χ* ≈ 0.567143",
      note: "Matemática real. Punto fijo del operador x·eˣ. Umbral de ingeniería — no transición de fase termodinámica.",
    },
  },
  {
    lore: {
      item: "ARCHON como IA cósmica",
      note: "Dispositivo narrativo. Villano que es el universo intentando repararse. No es un sistema implementable.",
    },
    eng: {
      item: "OSIT gating:  R < 0.25 → CERTEZA · R < 0.55 → INFERENCIA · R < 0.80 → INCÓGNITA · R ≥ 0.80 → BLOQUEO",
      note: "Política implementable hoy. Código que se ejecuta y decide si un agente actúa o se detiene.",
    },
  },
  {
    lore: {
      item: "432 Hz como frecuencia de creación de los Jardineros",
      note: "Número narrativo canónico. Pseudociencia como física real. No tiene base física especial fuera del mundo.",
    },
    eng: {
      item: "ARES — pares (E, R) a través de la cadena de cómputo",
      note: "Elimina la acumulación de error float. 1/3 = (1, 0) en base 3, R=0. Decimal solo en la capa UI.",
    },
  },
  {
    lore: {
      item: "Hemacronos, Plano Astral, frecuencias 55/847/963 Hz",
      note: "Biología y geografía in-world. CERTEZA dentro de la saga. BLOQUEADO como física real.",
    },
    eng: {
      item: "R_or = 1 − Πᵢ (1 − rᵢ)   ·   R_charged, I_seq, Δ(a,b)",
      note: "Hogares matemáticos reales: MYCIN/Pearl (Noisy-OR), Dempster-Shafer, información no conmutativa, asimetría causal cuántica (Jia & Chitambar 2019).",
    },
  },
  {
    lore: {
      item: "S_BH(Sgr A*) codifica toda la Vía Láctea",
      note: "Metáfora narrativa. Como física: FALSADO (brecha de ~16 órdenes). Puede usarse en la saga; no en un paper.",
    },
    eng: {
      item: "Bilattice Belnap-Dunn (4 valores: True / Both / Neither / False)",
      note: "Estructura matemática formal (Belnap 1977/2001). Permite representar BLOQUEADO (Both: información contradictoria presente). Heyting no podía.",
    },
  },
  {
    lore: {
      item: "Línea consciencia-cosmología (Wigner)",
      note: "Pseudociencia como física. El propio Wigner la descartó. Sobrevive solo como ficción especulativa.",
    },
    eng: {
      item: "Panteón OSIT como arquitectura multiagente",
      note: "Publicable como Paper A si se separa de cosmología. Cada agente con identidad epistémica — diferencia real frente a frameworks existentes.",
    },
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

function MonoFormula({
  children,
  block = false,
}: {
  children: React.ReactNode;
  block?: boolean;
}) {
  return (
    <code
      className={`font-mono ${block ? "block px-4 py-2.5 my-2 rounded-md border border-border/50 bg-card/40 overflow-x-auto" : "px-1.5 py-0.5 rounded bg-card/50"}`}
      style={{ color: "var(--amber-glow)" }}
    >
      {children}
    </code>
  );
}

function toneColor(t: Tone): string {
  if (t === "canon") return "var(--canon)";
  if (t === "inferido") return "var(--inferido)";
  if (t === "bloqueo") return "var(--bloqueo)";
  return "var(--incognita)";
}

function verdictChipClass(v: ClaimVerdict): string {
  // All falsified/blocked verdicts share the bloqueo (oxblood) chip.
  return "chip-bloqueo";
}

/* ============================================================
   Main
   ============================================================ */

export function ScienceSection() {
  const [expandedRescue, setExpandedRescue] = useState(false);

  return (
    <div className="fade-rise mx-auto max-w-5xl px-4 md:px-6 py-10">
      {/* ───── HEADER ───── */}
      <header className="mb-10">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Ciencia · Sin humo · Sin proteger el ego
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          Ciencia Honestamente
        </h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          El autor lo pidió explícito: «sin hype, sin humo, sin complacencia».
          Aquí están los claims falsificados, la ingeniería que sí funciona,
          la brecha crítica que falta cerrar y el camino para hacerlo.
          Las piezas rotas se muestran con el mismo peso visual que las que andan.
        </p>
      </header>

      {/* Author's demand banner */}
      <div
        className="rounded-lg border p-5 mb-12"
        style={{
          borderColor: "oklch(0.60 0.20 25 / 0.4)",
          background: "oklch(0.60 0.20 25 / 0.06)",
        }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--bloqueo)" }}>
          Instrucción explícita de Tyr
        </p>
        <p className="font-serif text-base italic text-foreground/90 leading-relaxed">
          «Sin hype, sin humo, sin proteger el ego, sin complacencia.»
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground mt-2">
          Fuente: EVALUACION_MATEMATICA_HONESTA.md · 2026-06-20 · REGISTRO_CONTRADICCIONES.md · 2026-06-24
        </p>
      </div>

      {/* ───── 1. VEREDICTO EJECUTIVO ───── */}
      <section id="veredicto" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Gavel className="h-3.5 w-3.5" style={{ color: "var(--oxblood)" }} />
          VEREDICTO EJECUTIVO
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
          Cinco preguntas. Cinco respuestas honestas. La brújula apunta bien;
          lo que falta no es intuición — es un procedimiento de medición.
        </p>

        <div className="rounded-md border border-border/50 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card/40 border-b border-border/40">
                <th className="text-left px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-medium w-[45%]">
                  Vector
                </th>
                <th className="text-left px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground font-medium">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody>
              {VERDICT_ROWS.map((v, i) => (
                <tr key={i} className="border-b border-border/30 last:border-b-0">
                  <td className="px-4 py-3.5 font-serif text-foreground/85 align-top">
                    {v.q}
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ background: toneColor(v.tone) }}
                      />
                      <span
                        className="font-semibold font-serif"
                        style={{ color: toneColor(v.tone) }}
                      >
                        {v.a}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3-line summary */}
        <div className="card-archive p-6">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Resumen en 3 líneas
          </p>
          <ol className="space-y-2 text-sm font-serif text-foreground/90 list-decimal ml-5">
            <li>
              <strong>No hay física nueva.</strong> Las intuiciones son correctas y
              llegan a los programas correctos, pero esos programas ya existen.
            </li>
            <li>
              <strong>Hay ingeniería real</strong> en OSIT / ARES / R_charged / I_seq —
              útil hoy para IA / programación sin validación científica adicional.
            </li>
            <li>
              <strong>El único paso que falta:</strong> medir R operacionalmente en datos
              reales. Eso convierte el marco en herramienta y también mejora tu IA.
              No son dos objetivos — son el mismo.
            </li>
          </ol>
        </div>
      </section>

      {/* ───── 2. CLAIMS FALSIFICADOS ───── */}
      <section id="falsificados" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <XCircle className="h-3.5 w-3.5" style={{ color: "var(--bloqueo)" }} />
          CLAIMS FALSIFICADOS · LA CIENCIA QUE NO FUNCIONA
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
          Seis claims del corpus especulativo, todos con veredicto duro del propio
          autor. La lista no es un ataque — es la higiene mínima para que lo que sí
          funciona pueda defenderse. Cada claim se presenta con su evidencia
          cuantitativa y la acción correcta.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {FALSIFIED_CLAIMS.map((c) => (
            <article
              key={c.id}
              className="card-archive p-5 fade-rise"
              style={{ borderColor: "oklch(0.60 0.20 25 / 0.35)" }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Skull className="h-4 w-4 shrink-0" style={{ color: "var(--bloqueo)" }} />
                  <code className="font-mono text-[0.65rem] font-bold tracking-wider text-muted-foreground">
                    {c.id}
                  </code>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[0.55rem] font-mono font-semibold uppercase tracking-wider ${verdictChipClass(c.verdict)}`}
                >
                  <Ban className="h-2.5 w-2.5" />
                  {c.verdict}
                </span>
              </div>

              <h3 className="font-serif text-base font-semibold leading-tight mb-3 text-foreground/95">
                {c.claim}
              </h3>

              {c.formula && <MonoFormula block>{c.formula}</MonoFormula>}

              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70 mb-0.5">
                    Evidencia
                  </p>
                  <p className="font-serif text-foreground/85 leading-relaxed">{c.evidence}</p>
                </div>
                <div className="pt-2 mt-2 border-t border-border/40">
                  <p
                    className="font-mono text-[0.6rem] uppercase tracking-wider mb-0.5 flex items-center gap-1"
                    style={{ color: "var(--bloqueo)" }}
                  >
                    <AlertTriangle className="h-3 w-3" /> Acción
                  </p>
                  <p className="font-serif text-foreground/90 leading-relaxed">{c.action}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───── 3. INGENIERÍA QUE SÍ FUNCIONA ───── */}
      <section id="ingenieria-real" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Cog className="h-3.5 w-3.5" style={{ color: "var(--canon)" }} />
          LA INGENIERÍA QUE SÍ FUNCIONA · VALOR REAL HOY
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
          No es física. Es ingeniería. Cuatro piezas con valor real y operacional,
          cada una con su hogar matemático citado. Lo que se puede construir y
          entregar hoy, sin esperar validación científica adicional.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {REAL_ENGINEERING.map((e) => {
            const Icon = e.icon;
            return (
              <article key={e.id} className="card-archive p-5 fade-rise">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--canon)" }} />
                    <code className="font-mono text-[0.65rem] font-bold tracking-wider text-muted-foreground">
                      {e.id}
                    </code>
                  </div>
                  <EpistemicChip state={e.state} />
                </div>

                <h3 className="font-serif text-base font-semibold leading-tight mb-2 text-foreground/95">
                  {e.name}
                </h3>

                <MonoFormula block>{e.what}</MonoFormula>

                <div className="mt-2 space-y-2 text-xs">
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70 mb-0.5">
                      Por qué funciona
                    </p>
                    <p className="font-serif text-foreground/85 leading-relaxed">{e.why}</p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border/40">
                    <p
                      className="font-mono text-[0.6rem] uppercase tracking-wider mb-0.5 flex items-center gap-1"
                      style={{ color: "var(--canon)" }}
                    >
                      <CheckCircle2 className="h-3 w-3" /> Prueba / valor
                    </p>
                    <p className="font-serif text-foreground/90 leading-relaxed">{e.proof}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ───── 4. LA BRECHA CRÍTICA: R ───── */}
      <section id="brecha-r" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <AlertTriangle className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
          LA BRECHA CRÍTICA · R SE ASIGNA, NO SE MIDE
        </div>

        {/* The single most important honest criticism — emphasized */}
        <div
          className="relative overflow-hidden rounded-lg border p-6 md:p-8 mb-8"
          style={{
            borderColor: "oklch(0.74 0.13 75 / 0.45)",
            background: "oklch(0.74 0.13 75 / 0.06)",
          }}
        >
          <div className="absolute inset-0 glitch-lines opacity-25 pointer-events-none" />
          <div className="relative">
            <p
              className="font-mono text-[0.65rem] uppercase tracking-[0.25em] mb-3"
              style={{ color: "var(--amber-glow)" }}
            >
              ★ La única crítica dura que importa
            </p>
            <p
              className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3"
              style={{ color: "var(--amber-glow)" }}
            >
              R se ASIGNA, no se MIDE.
            </p>
            <p className="font-serif text-sm md:text-base text-foreground/90 leading-relaxed mb-3">
              En todo el corpus de OSIT / ITF, el residuo R se fija a mano o por pesos
              heurísticos. <strong>Nunca</strong> se deriva de un procedimiento de medición
              calibrado contra ground-truth en datos <strong>reales</strong> (no sintéticos).
            </p>
            <p className="font-serif text-sm text-foreground/85 leading-relaxed mb-3">
              El benchmark MTS alcanza accuracy 1.0 — pero es 100% sintético. No hay
              baseline en datos reales. El propio THEORY_CURRENT_INDEX lo admite.
            </p>
            <p className="font-serif text-sm text-foreground/90 leading-relaxed font-semibold">
              Esto no es un defecto menor. Es lo que separa «marco organizado»
              de «herramienta validada».
            </p>
          </div>
        </div>

        {/* 3-step path */}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          El siguiente paso — el único que importa
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {R_FIX_PATH.map((s, i) => (
            <div key={s.step} className="card-archive p-5 relative">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-mono text-2xl font-bold leading-none"
                  style={{ color: "var(--amber-glow)" }}
                >
                  {s.step}
                </span>
                {i < R_FIX_PATH.length - 1 && (
                  <ArrowRight
                    className="hidden md:block h-4 w-4 ml-auto text-muted-foreground/40"
                  />
                )}
              </div>
              <h3 className="font-serif text-base font-semibold mb-2 text-foreground/95">
                {s.title}
              </h3>
              <p className="text-xs text-muted-foreground font-serif leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Closing note on the alignment */}
        <div className="mt-6 rounded-md border border-border/50 bg-card/30 px-5 py-4">
          <p className="font-serif text-sm text-foreground/85 italic leading-relaxed">
            <CircleDot className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" style={{ color: "var(--canon)" }} />
            Este paso, además, es exactamente lo que haría mejores los sistemas de IA del autor.
            Su meta declarada y el siguiente paso correcto <strong>coinciden</strong>. No son dos
            objetivos — son el mismo.
          </p>
        </div>
      </section>

      {/* ───── 5. CÓMO MEJORAR EL MUNDO CIENTÍFICAMENTE ───── */}
      <section id="como-mejorar" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Lightbulb className="h-3.5 w-3.5" style={{ color: "var(--inferido)" }} />
          CÓMO MEJORAR EL MUNDO CIENTÍFICAMENTE · INFERENCIA
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
          Cinco propuestas concretas. Ninguna es CANON — todas son INFERENCIA:
          hipótesis útiles con frontera clara. Si una no produce predicciones
          nuevas o no sobrevive su falsador, se retira.
        </p>

        <div className="space-y-3">
          {PROPOSALS.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.id}
                className="card-archive p-5 fade-rise"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 rounded-md border p-2"
                    style={{
                      borderColor: "oklch(0.78 0.13 80 / 0.4)",
                      background: "oklch(0.78 0.13 80 / 0.08)",
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "var(--inferido)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <code className="font-mono text-[0.65rem] font-bold tracking-wider text-muted-foreground">
                        {p.id}
                      </code>
                      <EpistemicChip state="INFERENCIA" />
                      <h3 className="font-serif text-base font-semibold text-foreground/95">
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/85 font-serif leading-relaxed">
                      {p.body}
                    </p>

                    {p.detail && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setExpandedRescue((v) => !v)}
                          className="font-mono text-[0.6rem] uppercase tracking-wider flex items-center gap-1 hover:text-foreground transition-colors"
                          style={{ color: "var(--inferido)" }}
                          aria-expanded={expandedRescue}
                        >
                          <ArrowRight
                            className="h-3 w-3 transition-transform"
                            style={{
                              transform: expandedRescue ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                          />
                          {expandedRescue ? "Ocultar condiciones" : "Ver 6 condiciones de rescate"}
                        </button>
                        {expandedRescue && (
                          <ul className="mt-2 space-y-1.5 text-xs font-serif text-foreground/85 ml-4">
                            {p.detail.map((d, i) => (
                              <li key={i} className="flex gap-2">
                                <span
                                  className="shrink-0 mt-1.5 inline-block h-1 w-1 rounded-full"
                                  style={{ background: "var(--inferido)" }}
                                />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ───── 6. LORE vs ENGINEERING ───── */}
      <section id="lore-vs-eng" className="mb-16 scroll-mt-20">
        <div className="divider-chi mb-8">
          <Columns2 className="h-3.5 w-3.5" style={{ color: "var(--incognita)" }} />
          LO QUE ES FICCIÓN ESPECULATIVA · VS · LO QUE ES INGENIERÍA REAL
        </div>

        <p className="text-sm text-muted-foreground font-serif italic mb-6 max-w-3xl">
          La frontera más importante de todas. Cuando la saga contradice la física
          real, es worldbuilding — no es error. Cuando el marco OSIT se vende como
          física real sin validar, es pseudociencia. Esta tabla existe para saber
          <em> exactamente qué es qué</em>.
        </p>

        {/* Column headers */}
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div
            className="rounded-md border px-4 py-3"
            style={{
              borderColor: "oklch(0.68 0.02 250 / 0.4)",
              background: "oklch(0.68 0.02 250 / 0.08)",
            }}
          >
            <p
              className="font-mono text-[0.65rem] uppercase tracking-[0.2em] flex items-center gap-2"
              style={{ color: "var(--incognita)" }}
            >
              <Skull className="h-3.5 w-3.5" />
              Lore · ficción especulativa
            </p>
            <p className="text-xs text-muted-foreground font-serif italic mt-1">
              Verdadero dentro de la saga. No afirmación sobre el mundo real.
            </p>
          </div>
          <div
            className="rounded-md border px-4 py-3"
            style={{
              borderColor: "oklch(0.72 0.14 145 / 0.4)",
              background: "oklch(0.72 0.14 145 / 0.08)",
            }}
          >
            <p
              className="font-mono text-[0.65rem] uppercase tracking-[0.2em] flex items-center gap-2"
              style={{ color: "var(--canon)" }}
            >
              <Cog className="h-3.5 w-3.5" />
              Engineering · real, usable
            </p>
            <p className="text-xs text-muted-foreground font-serif italic mt-1">
              Válido fuera de la saga. Implementable hoy, con hogar matemático citado.
            </p>
          </div>
        </div>

        {/* Paired rows */}
        <div className="space-y-2">
          {LORE_VS_ENG.map((row, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 rounded-md border border-border/40 bg-card/20 overflow-hidden"
            >
              <div className="px-4 py-3 border-b md:border-b-0 md:border-r border-border/30">
                <div className="flex items-start gap-2">
                  <span
                    className="font-mono text-[0.6rem] font-bold mt-0.5 shrink-0"
                    style={{ color: "var(--incognita)" }}
                  >
                    LORE
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif text-sm text-foreground/90 leading-snug">
                      {row.lore.item}
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground font-serif italic mt-1 leading-relaxed">
                      {row.lore.note}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <span
                    className="font-mono text-[0.6rem] font-bold mt-0.5 shrink-0"
                    style={{ color: "var(--canon)" }}
                  >
                    ENG
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif text-sm text-foreground/90 leading-snug">
                      {row.eng.item}
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground font-serif italic mt-1 leading-relaxed">
                      {row.eng.note}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing rule */}
        <div
          className="mt-8 rounded-lg border p-6"
          style={{
            borderColor: "oklch(0.62 0.18 28 / 0.35)",
            background: "oklch(0.62 0.18 28 / 0.05)",
          }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--oxblood)" }}>
            Regla de oro
          </p>
          <p className="font-serif text-base italic text-foreground/90 leading-relaxed">
            «Lo que es CANON narrativo puede contradecir la física real.
            Eso es worldbuilding. Lo que NO es aceptable: presentar el canon
            narrativo como física real cuando hablamos de ciencia.»
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground mt-2">
            — CIENCIA.md · Principio de Separación
          </p>
        </div>
      </section>

      {/* ───── Footer watermark ───── */}
      <footer className="pt-8 border-t border-border/30 text-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
          χ · eχ = 1 · χ* = 0.567143 · sin humo · sin complacencia
        </p>
        <p className="mt-2 font-serif text-xs text-muted-foreground italic">
          Evaluación ejecutada por Sonnet 4.6 (plan de Opus 4.8) sobre el corpus
          OSIT / ITF / Qtoe / TNR del autor. Fuentes citadas en
          EVALUACION_MATEMATICA_HONESTA.md y REGISTRO_CONTRADICCIONES.md.
        </p>
      </footer>
    </div>
  );
}

export default ScienceSection;
