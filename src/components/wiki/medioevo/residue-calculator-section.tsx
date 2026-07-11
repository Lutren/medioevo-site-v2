"use client";
import { useState, useMemo } from "react";
import { Calculator, Gauge, Info } from "lucide-react";
import { EPISTEMIC_META } from "@/lib/medioevo";

// Calculadora interactiva del residuo R (OSIT).
// El usuario ajusta componentes de residuo y ve cómo se compone + qué acción tomar.

const COMPONENTS = [
  { id: "sem", label: "sem (gap semántico)", desc: "Diferencia entre lo que se dice y lo que se entiende" },
  { id: "mem", label: "mem (gap de memoria)", desc: "Información que falta del contexto previo" },
  { id: "lat", label: "lat (gap de latencia)", desc: "Retraso en el acceso a la información" },
  { id: "priv", label: "priv (gap de privacidad)", desc: "Información oculta por privacidad" },
  { id: "conf", label: "conf × 1.25 (contradicción)", desc: "Evidencia que se contradice — peso 1.25" },
  { id: "cost", label: "cost (gap de costo)", desc: "Costo computacional de obtener la info" },
  { id: "act", label: "act (gap de acción)", desc: "Distancia entre saber y poder actuar" },
] as const;

const RESIDUE_BANDS = [
  { lo: 0.0, hi: 0.15, label: "Óptimo", color: "var(--canon)", action: "Avanzar directo", chip: "chip-canon" },
  { lo: 0.15, hi: 0.35, label: "Manejable", color: "oklch(0.7 0.12 120)", action: "Avanzar, registrar decisiones", chip: "chip-canon" },
  { lo: 0.35, hi: 0.6, label: "Alerta", color: "var(--amber-glow)", action: "Avanzar con revisión, pruebas pequeñas", chip: "chip-inferido" },
  { lo: 0.6, hi: 0.8, label: "Alto riesgo", color: "oklch(0.65 0.16 40)", action: "Revisar antes de actuar", chip: "chip-inferido" },
  { lo: 0.8, hi: 1.01, label: "Bloqueo", color: "var(--bloqueo)", action: "Bloquear, dividir tarea, pedir evidencia", chip: "chip-bloqueo" },
];

function getBand(r: number) {
  return RESIDUE_BANDS.find((b) => r >= b.lo && r < b.hi) || RESIDUE_BANDS[RESIDUE_BANDS.length - 1];
}

function getEpistemicState(r: number): string {
  if (r < 0.15) return "CERTEZA";
  if (r < 0.35) return "INFERENCIA";
  if (r < 0.6) return "INFERENCIA";
  if (r < 0.8) return "INCOGNITA";
  return "BLOQUEO";
}

export function ResidueCalculatorSection() {
  const [values, setValues] = useState<Record<string, number>>({
    sem: 0.2, mem: 0.1, lat: 0.1, priv: 0.15, conf: 0.3, cost: 0.1, act: 0.2,
  });

  const compositeR = useMemo(() => {
    // R_or = 1 - Π(1 - r_i), with conf weighted ×1.25
    let product = 1;
    for (const c of COMPONENTS) {
      const v = values[c.id] * (c.id === "conf" ? 1.25 : 1);
      product *= (1 - Math.min(1, v));
    }
    return 1 - product;
  }, [values]);

  const band = getBand(compositeR);
  const state = getEpistemicState(compositeR);
  const meta = EPISTEMIC_META[state];

  const usableInfo = useMemo(() => {
    // U(X;R) = H(X) · Φ(R), where Φ(R) = 1 - R
    // Use entropy proxy H = log2(7) ≈ 2.807 (7 components)
    const H = Math.log2(7);
    const phi = 1 - compositeR;
    return H * phi;
  }, [compositeR]);

  const update = (id: string, v: number) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  };

  return (
    <div className="fade-rise mx-auto max-w-5xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Cronómetro OSIT · Calculadora de residuo R
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">El Medidor del Observador</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          El residuo R mide la incertidumbre del observador antes de actuar. Ajusta los 7 componentes y observa cómo se compone (noisy-OR), en qué banda caes, y qué acción recomienda OSIT.
        </p>
      </header>

      {/* Formula */}
      <div className="card-archive p-4 mb-6 text-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">Fórmula canónica</p>
        <code className="font-mono text-lg" style={{ color: "var(--amber-glow)" }}>
          R_or = 1 − Π(1 − r_i) &nbsp;·&nbsp; U(X;R) = H(X) · Φ(R) &nbsp;·&nbsp; Φ(R) = 1 − R
        </code>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Sliders */}
        <div className="card-archive p-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            7D ResidueVector
          </p>
          <div className="space-y-4">
            {COMPONENTS.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono text-xs" style={{ color: c.id === "conf" ? "var(--bloqueo)" : "var(--foreground)" }}>
                    {c.label}
                  </label>
                  <code className="font-mono text-xs" style={{ color: "var(--amber-glow)" }}>
                    {values[c.id].toFixed(2)}
                    {c.id === "conf" && <span className="text-bloqueo ml-1">×1.25</span>}
                  </code>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={values[c.id]}
                  onChange={(e) => update(c.id, Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: "var(--border)" }}
                  aria-label={c.label}
                />
                <p className="text-[0.6rem] text-muted-foreground font-serif italic mt-0.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {/* Residue gauge */}
          <div className="card-archive p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">Residuo compuesto R</p>
            </div>
            <div className="text-center mb-4">
              <div className="font-serif text-6xl font-bold" style={{ color: band.color }}>
                {compositeR.toFixed(3)}
              </div>
              <p className="font-mono text-sm mt-1" style={{ color: band.color }}>{band.label}</p>
            </div>
            {/* Gauge bar */}
            <div className="relative h-3 rounded-full overflow-hidden border border-border/40 mb-1">
              <div className="absolute inset-0 flex">
                {RESIDUE_BANDS.map((b, i) => (
                  <div key={i} style={{ width: `${((b.hi - b.lo) * 100)}%`, background: b.color, opacity: 0.35 }} />
                ))}
              </div>
              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all" style={{ left: `${compositeR * 100}%`, transform: "translateX(-50%)" }} />
            </div>
            <div className="flex justify-between font-mono text-[0.5rem] text-muted-foreground/60">
              <span>0.0</span><span>0.15</span><span>0.35</span><span>0.6</span><span>0.8</span><span>1.0</span>
            </div>
          </div>

          {/* Epistemic state + action */}
          <div className="card-archive p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">Estado epistémico OSIT</p>
              <span className={`rounded border px-2 py-1 text-[0.65rem] font-mono font-semibold ${meta.chip}`}>
                {meta.label}
              </span>
            </div>
            <p className="font-serif text-sm mb-2" style={{ color: band.color }}>
              <strong>Acción recomendada:</strong> {band.action}
            </p>
            <p className="text-xs text-muted-foreground font-serif italic">{meta.desc}</p>
          </div>

          {/* Usable info */}
          <div className="card-archive p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">Información utilizable U(X;R)</p>
            </div>
            <div className="flex items-baseline gap-2">
              <code className="font-mono text-2xl font-bold" style={{ color: "var(--canon)" }}>
                {usableInfo.toFixed(3)}
              </code>
              <span className="font-mono text-xs text-muted-foreground">bits (de H=log₂(7)≈2.807)</span>
            </div>
            <p className="text-[0.65rem] text-muted-foreground font-serif italic mt-1">
              A mayor R, menos información es utilizable. Cuando R → 1, U → 0.
            </p>
          </div>
        </div>
      </div>

      {/* Honest note */}
      <div className="mt-6 flex items-start gap-2 rounded-md border border-bloqueo/30 bg-bloqueo/5 p-4">
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--bloqueo)" }} />
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-1" style={{ color: "var(--bloqueo)" }}>Brecha crítica</p>
          <p className="text-xs text-muted-foreground font-serif leading-relaxed">
            «R se ASIGNA, no se MIDE.» En el corpus OSIT del autor, los valores de r_i se fijan a mano o por pesos heurísticos. Nunca se derivan de un procedimiento de medición calibrado contra ground-truth en datos reales. Esta calculadora es una demostración pedagógica del marco — no una herramienta validada. El siguiente paso del autor es definir el procedimiento operacional para medir R en datos reales.
          </p>
        </div>
      </div>
    </div>
  );
}
