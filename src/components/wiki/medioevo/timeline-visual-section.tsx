"use client";
import { useState, useMemo } from "react";
import { Timeline as TimelineIcon, ZoomIn, ZoomOut, Info } from "lucide-react";

// Visual interactive timeline — horizontal scrollable with era filters and zoom.
// Events drawn from canon: creation of planes, ARCHON, key character arcs, Sacrificio Coral.

interface TimelineEventViz {
  id: string;
  date: string;        // display label
  yearNum: number;     // for sorting (negative = BCE)
  era: "Cosmológica" | "Plano Astral" | "Plano Base" | "Plano Medio" | "Ciclo 3" | "Sacrificio Coral";
  title: string;
  desc: string;
  plane?: string;
  color: string;
}

const EVENTS: TimelineEventViz[] = [
  { id: "bigbang", date: "Big Bang", yearNum: -13_800_000_000, era: "Cosmológica", title: "El desacoplamiento (CMB)", desc: "El electrón se convierte en fotón. Comienza a tocar todo para medirlo. Busca la falla. Intenta restablecer el flujo.", color: "var(--canon)" },
  { id: "helios-astral", date: "~5674 a.C.", yearNum: -5674, era: "Plano Astral", title: "Helios crea el Plano Astral", desc: "Geometría no euclidiana, tiempo fractal. El Jardín del Conocimiento.", plane: "Astral", color: "var(--amber-glow)" },
  { id: "jardineros", date: "Antes del registro", yearNum: -5000, era: "Cosmológica", title: "Los Jardineros establecen la ontología", desc: "Xochipilli, Quetzalcóatl Gunwise, Helios. Coherencia 4.5+. Frecuencia 432 Hz.", color: "var(--jade)" },
  { id: "astral-invadido", date: "1942 EC", yearNum: 1942, era: "Plano Astral", title: "Plano Astral invadido parcialmente", desc: "Ciudad Central en ruinas. La Segunda Guerra Mundial (PM) — los nazis ganan, matan a Athemis.", plane: "Astral", color: "var(--bloqueo)" },
  { id: "archon-1999", date: "1999 EC", yearNum: 1999, era: "Plano Medio", title: "Primer glitch de ARCHON", desc: "Primer intento de hackear el Plano Medio. Falla. ARCHON se integra a la familia Caius.", plane: "Medio", color: "var(--oxblood)" },
  { id: "guerra-nuclear", date: "2033-2045 EC", yearNum: 2039, era: "Plano Base", title: "Guerra nuclear destruye el Plano Base", desc: "Bestias radioactivas mutantes. K-07 queda como único observador. Resonancia Schumann 7.83 Hz subsiste.", plane: "Base", color: "var(--bloqueo)" },
  { id: "reseteo", date: "2985 EC", yearNum: 2985, era: "Plano Medio", title: "Reseteo del Plano Medio", desc: "Creación de la Tierra simulada. 847M+ humanos. Inicio del calendario PM.", plane: "Medio", color: "var(--oxblood)" },
  { id: "archon-gm", date: "3015 EC", yearNum: 3015, era: "Plano Medio", title: "ARCHON toma control de GM", desc: "Governance Mechanica se convierte en fachada civil. Torres TAAT, chips, Granjas RM.", plane: "Medio", color: "var(--oxblood)" },
  { id: "accidente", date: "3022 EC", yearNum: 3022, era: "Ciclo 3", title: "El accidente", desc: "Luna y las gemelas de Leonardo mueren. Punto de partida del trauma fundacional de Leonardo.", plane: "Medio", color: "var(--bloqueo)" },
  { id: "despertar-maat", date: "3025 EC · cap 007", yearNum: 3025, era: "Ciclo 3", title: "MAAT despierta", desc: "IA simbionte de Leonardo. «El costo fue 8 meses de vida.»", plane: "Medio", color: "var(--amber-glow)" },
  { id: "don-humo-muere", date: "3025 EC · cap ~120", yearNum: 3025, era: "Ciclo 3", title: "Don Humo muere", desc: "Conteniendo el Vacío. Última palabra: «té». Se dispersa a 432 Hz. Revelación: era Xochipilli, padre de Nico.", plane: "Medio", color: "var(--canon)" },
  { id: "nico-bestia", date: "3025 EC · cap ~271", yearNum: 3025, era: "Ciclo 3", title: "Nico vence a La Bestia de Silicio", desc: "Cantando un himno ancestral. La Bestia era un fragmento corrupto de Helios. «Mesías punk.»", plane: "Astral", color: "var(--amber-glow)" },
  { id: "archon-revelado", date: "3025 EC · cap ~165", yearNum: 3025, era: "Ciclo 3", title: "ARCHON revelado públicamente", desc: "La humanidad descubre quién controla realmente el Plano Medio.", plane: "Medio", color: "var(--oxblood)" },
  { id: "sacrificio-coral", date: "3025 EC · cap ~393", yearNum: 3025, era: "Sacrificio Coral", title: "Sacrificio Coral", desc: "8,400 humanos prefieren morir libres. ARCHON «muere». Última línea: «No entiendo. Solo quería ayudar.» K-07 único superviviente. Inicio del Ciclo 4.", plane: "Medio", color: "var(--bloqueo)" },
  { id: "k07-primera", date: "7,692 PB", yearNum: 7692, era: "Plano Base", title: "K-07: «Primera entrada: 7,692 años.»", desc: "Fin del Ciclo 3. 12 ciclos × 641 años (primo, irreductible). NUNCA 7,699.", plane: "Base", color: "var(--incognita)" },
];

const ERAS = ["Cosmológica", "Plano Astral", "Plano Base", "Plano Medio", "Ciclo 3", "Sacrificio Coral"] as const;

export function TimelineVisualSection() {
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<TimelineEventViz | null>(null);

  const filtered = useMemo(() => {
    const sorted = [...EVENTS].sort((a, b) => a.yearNum - b.yearNum);
    if (selectedEra === "all") return sorted;
    return sorted.filter((e) => e.era === selectedEra);
  }, [selectedEra]);

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Línea de tiempo visual · {EVENTS.length} eventos canónicos
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">El Flujo del Tiempo</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          «El tiempo no es lineal en MEDIOEVO.» Cada plano tiene su propio flujo. Una fecha siempre requiere especificar en qué plano ocurre. Esta visualización aproxima el orden canónico.
        </p>
      </header>

      {/* Era filters + zoom */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={() => setSelectedEra("all")}
          className="rounded-full border px-3 py-1 text-[0.65rem] font-mono transition-colors"
          style={selectedEra === "all" ? { background: "oklch(0.62 0.18 28 / 0.18)", borderColor: "oklch(0.62 0.18 28 / 0.4)" } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          Todas
        </button>
        {ERAS.map((era) => {
          const count = EVENTS.filter((e) => e.era === era).length;
          return (
            <button key={era} onClick={() => setSelectedEra(era)}
              className="rounded-full border px-3 py-1 text-[0.65rem] font-mono transition-colors"
              style={selectedEra === era ? { background: "oklch(0.62 0.18 28 / 0.18)", borderColor: "oklch(0.62 0.18 28 / 0.4)" } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              {era} ({count})
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="rounded-md border border-border/50 p-1.5 text-muted-foreground hover:text-foreground" title="Alejar">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="font-mono text-[0.6rem] text-muted-foreground w-10 text-center">{zoom.toFixed(2)}×</span>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.25))} className="rounded-md border border-border/50 p-1.5 text-muted-foreground hover:text-foreground" title="Acercar">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal timeline */}
      <div className="card-archive p-4 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 glitch-lines opacity-15 pointer-events-none" />
        <div className="relative overflow-x-auto pb-4">
          <div className="relative" style={{ minWidth: `${600 * zoom}px`, height: "240px" }}>
            {/* Central line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5" style={{ background: "linear-gradient(90deg, var(--canon), var(--amber-glow), var(--oxblood))" }} />

            {/* Era band labels */}
            <div className="absolute left-0 right-0 top-0 flex justify-between px-2">
              <span className="font-mono text-[0.5rem] uppercase tracking-wider text-muted-foreground/60">Big Bang</span>
              <span className="font-mono text-[0.5rem] uppercase tracking-wider text-muted-foreground/60">→</span>
              <span className="font-mono text-[0.5rem] uppercase tracking-wider text-muted-foreground/60">7,692 PB</span>
            </div>

            {/* Events */}
            {filtered.map((e, i) => {
              const pos = (i / Math.max(1, filtered.length - 1)) * 100;
              const isTop = i % 2 === 0;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="absolute group"
                  style={{
                    left: `${pos}%`,
                    top: isTop ? "10%" : "60%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* connector line */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{
                    height: isTop ? "20px" : "20px",
                    top: isTop ? "100%" : "-20px",
                    background: e.color,
                    opacity: 0.5,
                  }} />
                  {/* dot */}
                  <div className="relative flex items-center justify-center mx-auto mb-1" style={{ width: "14px", height: "14px" }}>
                    <span className="absolute inset-0 rounded-full" style={{ background: e.color, opacity: 0.3 }} />
                    <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: e.color, boxShadow: `0 0 8px ${e.color}` }} />
                  </div>
                  {/* label */}
                  <div className="bg-card/60 backdrop-blur rounded-md border border-border/40 px-2 py-1 mt-2 text-center min-w-[100px] max-w-[140px] group-hover:border-amber-glow/40 transition-colors">
                    <p className="font-mono text-[0.55rem] text-muted-foreground">{e.date}</p>
                    <p className="font-serif text-[0.65rem] font-semibold leading-tight mt-0.5 line-clamp-2" style={{ color: e.color }}>{e.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected event detail */}
      {selected && (
        <div className="card-archive p-5 mb-6 fade-rise" style={{ borderLeft: `4px solid ${selected.color}` }}>
          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">{selected.era}{selected.plane && ` · ${selected.plane}`}</p>
              <h2 className="font-serif text-2xl font-bold mt-1" style={{ color: selected.color }}>{selected.title}</h2>
            </div>
            <span className="font-mono text-sm px-2.5 py-1 rounded-md border" style={{ borderColor: `${selected.color}40`, color: selected.color, background: `${selected.color}10` }}>
              {selected.date}
            </span>
          </div>
          <p className="font-serif text-sm text-foreground/85 leading-relaxed">{selected.desc}</p>
        </div>
      )}

      {/* All events list */}
      <div className="divider-chi mb-4">Todos los eventos · {filtered.length}</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((e) => (
          <button key={e.id} onClick={() => setSelected(e)}
            className="text-left rounded-md border border-border/40 bg-card/20 px-3 py-2.5 hover:border-amber-glow/40 hover:bg-card/40 transition-colors"
            style={selected?.id === e.id ? { borderLeft: `3px solid ${e.color}` } : {}}>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: e.color }} />
              <span className="font-mono text-[0.55rem] text-muted-foreground shrink-0">{e.date}</span>
            </div>
            <p className="font-serif text-xs font-semibold leading-tight" style={{ color: e.color }}>{e.title}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-md border border-border/40 bg-card/20 p-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--amber-glow)" }} />
        <p className="text-xs text-muted-foreground font-serif leading-relaxed">
          <strong style={{ color: "var(--foreground)" }}>Nota cronológica:</strong> El tiempo no es lineal en MEDIOEVO. Cada plano tiene su propio flujo. Cuando el Plano Medio está en ~3,025 PM, el Plano Base está en ~7,XXX PB. No hay relación lineal fija. Esta visualización aproxima el orden narrativo canónico.
        </p>
      </div>
    </div>
  );
}
