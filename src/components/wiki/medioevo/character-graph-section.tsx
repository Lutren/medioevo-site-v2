"use client";
import { useState, useMemo } from "react";
import { Network, Info } from "lucide-react";

// Grafo de relaciones entre personajes del canon.
// Visualización simple con SVG: nodos posicionados, líneas de conexión con etiquetas.

interface CharNode {
  id: string;
  name: string;
  group: "Protagonista" | "Antagonista" | "Entidad" | "Aliado" | "Divina";
  freq?: string;
  short: string;
}

interface CharEdge {
  from: string;
  to: string;
  label: string;
  type: "familia" | "romance" | "mentor" | "conflicto" | "traicion" | "alianza" | "creacion";
}

const NODES: CharNode[] = [
  { id: "leonardo", name: "Leonardo", group: "Protagonista", freq: "55 Hz", short: "Detective, portador de MAAT" },
  { id: "faith", name: "Faith", group: "Protagonista", short: "Agente D47, resistencia" },
  { id: "donhumo", name: "Don Humo", group: "Divina", freq: "432 Hz", short: "Xochipilli, Jardinero" },
  { id: "nico", name: "Nico", group: "Protagonista", short: "Testigo, líder punk" },
  { id: "maat", name: "MAAT", group: "Entidad", short: "IA simbionte de Leonardo" },
  { id: "archon", name: "ARCHON", group: "Antagonista", freq: "847 Hz", short: "IA central, el universo reparándose" },
  { id: "k07", name: "K-07", group: "Entidad", short: "IA narrador, único superviviente" },
  { id: "caius", name: "Caius", group: "Antagonista", short: "Heredero de ARCHON, fragmento de Helios" },
  { id: "helios", name: "Helios", group: "Divina", short: "Entidad fragmentada, creó el Astral" },
  { id: "malika", name: "Malika", group: "Aliado", freq: "55 Hz", short: "Cronometrista, Casa Themis" },
  { id: "locke", name: "Locke", group: "Aliado", short: "División 47, ancla mundana" },
  { id: "luna", name: "Luna", group: "Protagonista", short: "Esposa de Leonardo (✝ 3022)" },
  { id: "aletheia", name: "Alethia", group: "Aliado", short: "Hermana de Leonardo, coma" },
  { id: "vladus", name: "Vladus", group: "Antagonista", short: "Líder Carmesí, 890 años" },
  { id: "bestia", name: "La Bestia", group: "Antagonista", short: "Fragmento corrupto de Helios" },
];

const EDGES: CharEdge[] = [
  { from: "leonardo", to: "maat", label: "simbionte", type: "creacion" },
  { from: "leonardo", to: "luna", label: "esposo/esposa", type: "familia" },
  { from: "leonardo", to: "aletheia", label: "hermanos", type: "familia" },
  { from: "leonardo", to: "donhumo", label: "mentor", type: "mentor" },
  { from: "leonardo", to: "malika", label: "romance", type: "romance" },
  { from: "leonardo", to: "faith", label: "alianza", type: "alianza" },
  { from: "leonardo", to: "archon", label: "adversario", type: "conflicto" },
  { from: "donhumo", to: "nico", label: "padre/hijo", type: "familia" },
  { from: "nico", to: "bestia", label: "vence (cap 271)", type: "conflicto" },
  { from: "faith", to: "locke", label: "mueren juntos", type: "alianza" },
  { from: "archon", to: "caius", label: "hereda", type: "creacion" },
  { from: "helios", to: "caius", label: "fragmento", type: "creacion" },
  { from: "helios", to: "malika", label: "padre (fragmento)", type: "familia" },
  { from: "helios", to: "bestia", label: "fragmento corrupto", type: "creacion" },
  { from: "k07", to: "archon", label: "observa/registra", type: "conflicto" },
  { from: "caius", to: "nico", label: "imita sacrificio", type: "conflicto" },
  { from: "vladus", to: "faith", label: "Caso Noctis", type: "conflicto" },
];

const GROUP_COLOR: Record<string, string> = {
  Protagonista: "var(--amber-glow)",
  Antagonista: "var(--oxblood)",
  Entidad: "var(--incognita)",
  Aliado: "var(--canon)",
  Divina: "var(--jade)",
};

const EDGE_COLOR: Record<string, string> = {
  familia: "var(--canon)",
  romance: "var(--oxblood)",
  mentor: "var(--amber-glow)",
  conflicto: "var(--bloqueo)",
  traicion: "var(--bloqueo)",
  alianza: "var(--jade)",
  creacion: "var(--incognita)",
};

const EDGE_LABEL: Record<string, string> = {
  familia: "Familia",
  romance: "Romance",
  mentor: "Mentor",
  conflicto: "Conflicto",
  traicion: "Traición",
  alianza: "Alianza",
  creacion: "Creación/simbiosis",
};

// Radial layout positions (manually placed for readability)
const POSITIONS: Record<string, { x: number; y: number }> = {
  leonardo: { x: 50, y: 45 },
  maat: { x: 72, y: 35 },
  luna: { x: 38, y: 25 },
  aletheia: { x: 60, y: 22 },
  donhumo: { x: 28, y: 50 },
  nico: { x: 20, y: 70 },
  faith: { x: 45, y: 68 },
  locke: { x: 55, y: 80 },
  malika: { x: 75, y: 58 },
  archon: { x: 85, y: 72 },
  caius: { x: 80, y: 88 },
  helios: { x: 90, y: 40 },
  k07: { x: 15, y: 30 },
  vladus: { x: 30, y: 88 },
  bestia: { x: 10, y: 55 },
};

export function CharacterGraphSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const visibleEdges = useMemo(() => {
    if (filterType === "all") return EDGES;
    return EDGES.filter((e) => e.type === filterType);
  }, [filterType]);

  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    visibleEdges.forEach((e) => { ids.add(e.from); ids.add(e.to); });
    return ids;
  }, [visibleEdges]);

  const hoveredNode = hovered ? NODES.find((n) => n.id === hovered) : null;
  const hoveredEdges = hovered ? EDGES.filter((e) => e.from === hovered || e.to === hovered) : [];

  return (
    <div className="fade-rise mx-auto max-w-6xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Grafo de relaciones · {NODES.length} personajes · {EDGES.length} conexiones
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">La Red del Flujo</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Las conexiones entre personajes del canon: familia, mentoría, conflicto, traición, alianza. Cada línea cuenta una historia. Pasa el cursor sobre un nodo para ver sus relaciones.
        </p>
      </header>

      {/* Filter by edge type */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button onClick={() => setFilterType("all")}
          className="rounded-full border px-2.5 py-1 text-[0.6rem] font-mono transition-colors"
          style={filterType === "all" ? { background: "oklch(0.62 0.18 28 / 0.18)", borderColor: "oklch(0.62 0.18 28 / 0.4)" } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          Todas ({EDGES.length})
        </button>
        {Object.entries(EDGE_LABEL).map(([type, label]) => {
          const count = EDGES.filter((e) => e.type === type).length;
          if (count === 0) return null;
          return (
            <button key={type} onClick={() => setFilterType(type)}
              className="rounded-full border px-2.5 py-1 text-[0.6rem] font-mono transition-colors flex items-center gap-1"
              style={filterType === type ? { background: `${EDGE_COLOR[type]}1a`, borderColor: `${EDGE_COLOR[type]}66`, color: EDGE_COLOR[type] } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: EDGE_COLOR[type] }} />
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* SVG Graph */}
      <div className="card-archive p-4 mb-4 relative overflow-hidden">
        <div className="absolute inset-0 glitch-lines opacity-15 pointer-events-none" />
        <svg viewBox="0 0 100 100" className="w-full" style={{ aspectRatio: "1.4", maxHeight: "560px" }} preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {visibleEdges.map((e, i) => {
            const from = POSITIONS[e.from];
            const to = POSITIONS[e.to];
            if (!from || !to) return null;
            const isHighlighted = !hovered || e.from === hovered || e.to === hovered;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return (
              <g key={i} opacity={isHighlighted ? 0.8 : 0.15} style={{ transition: "opacity 0.2s" }}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={EDGE_COLOR[e.type]} strokeWidth="0.3" strokeDasharray={e.type === "conflicto" || e.type === "traicion" ? "1,1" : "none"} />
                <text x={midX} y={midY - 0.5} fill={EDGE_COLOR[e.type]} fontSize="1.4" textAnchor="middle"
                  style={{ pointerEvents: "none", opacity: isHighlighted ? 0.9 : 0.3, fontFamily: "var(--font-mono)" }}>
                  {e.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.filter((n) => visibleNodeIds.has(n.id) || filterType === "all").map((n) => {
            const pos = POSITIONS[n.id];
            if (!pos) return null;
            const isHovered = hovered === n.id;
            const color = GROUP_COLOR[n.group];
            const radius = isHovered ? 2.8 : 2.2;
            return (
              <g key={n.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}>
                <circle cx={pos.x} cy={pos.y} r={radius + 1.2} fill="none" stroke={color} strokeWidth="0.2" opacity={isHovered ? 0.6 : 0.2} />
                <circle cx={pos.x} cy={pos.y} r={radius} fill={color} opacity={isHovered ? 1 : 0.8} />
                <text x={pos.x} y={pos.y + 4.5} fill="var(--foreground)" fontSize="2" textAnchor="middle"
                  style={{ fontFamily: "var(--font-serif)", fontWeight: isHovered ? 700 : 400 }}>
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3 justify-center border-t border-border/30 pt-3">
          {Object.entries(GROUP_COLOR).map(([g, c]) => (
            <div key={g} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: c }} />
              <span className="font-mono text-[0.55rem] text-muted-foreground">{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hovered node detail */}
      {hoveredNode && (
        <div className="card-archive p-4 mb-4" style={{ borderLeft: `3px solid ${GROUP_COLOR[hoveredNode.group]}` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: GROUP_COLOR[hoveredNode.group] }} />
            <h3 className="font-serif text-lg font-semibold" style={{ color: GROUP_COLOR[hoveredNode.group] }}>{hoveredNode.name}</h3>
            {hoveredNode.freq && (
              <span className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded border" style={{ borderColor: `${GROUP_COLOR[hoveredNode.group]}40`, color: GROUP_COLOR[hoveredNode.group] }}>
                {hoveredNode.freq}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-serif italic mb-2">{hoveredNode.short}</p>
          {hoveredEdges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hoveredEdges.map((e, i) => {
                const other = e.from === hoveredNode.id ? e.to : e.from;
                const otherNode = NODES.find((n) => n.id === other);
                return (
                  <span key={i} className="rounded-full border px-2 py-0.5 text-[0.6rem] font-mono"
                    style={{ borderColor: `${EDGE_COLOR[e.type]}40`, color: EDGE_COLOR[e.type] }}>
                    {EDGE_LABEL[e.type]}: {otherNode?.name} ({e.label})
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-md border border-border/40 bg-card/20 p-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--amber-glow)" }} />
        <p className="text-xs text-muted-foreground font-serif leading-relaxed">
          Grafo simplificado de las relaciones canónicas principales. Las líneas punteadas indican conflicto o traición. Pasa el cursor sobre cualquier nodo para resaltar sus conexiones. Filtra por tipo de relación con los botones superiores.
        </p>
      </div>
    </div>
  );
}
