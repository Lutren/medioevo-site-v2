"use client";
import { useState, useMemo } from "react";
import { Atom, Info } from "lucide-react";

// Visualización interactiva de los 3 planos sobre la ecuación χ·e^χ = 1.
// El usuario arrastra un slider de χ y ve en qué plano cae + qué significa.

const CHI_STAR = 0.567143; // Lambert W / Ω constant — solution of χ·e^χ = 1

interface PlaneInfo {
  id: string;
  name: string;
  chiRange: string;
  regime: string;
  desc: string;
  freqs: string[];
  inhabitants: string;
  access: string;
  color: string;
}

const PLANES: PlaneInfo[] = [
  {
    id: "base",
    name: "Plano Base",
    chiRange: "χ ≈ χ*",
    regime: "Régimen crítico — equilibrio perfecto",
    desc: "Post-apocalíptico (guerra nuclear 2033-2045). Solo bestias radioactivas mutantes y K-07. La Tierra real subsiste bajo el apocalipsis a 7.83 Hz Schumann.",
    freqs: ["7.83 Hz (Schumann)"],
    inhabitants: "Bestias mutantes + K-07 (IA del Protocolo de Extinción)",
    access: "Hermético — solo robots originales y K-07",
    color: "var(--incognita)",
  },
  {
    id: "medio",
    name: "Plano Medio",
    chiRange: "χ > χ*",
    regime: "Supercrítico — realidad «maravillosa» controlada",
    desc: "La Tierra simulada. 847M+ humanos. Control GM/ARCHON desde 3015. Torres TAAT (847), chips de nacimiento. Aquí ocurre la mayoría del Ciclo 3.",
    freqs: ["0.12 Hz (TAAT supresión)", "7.83 Hz (Schumann)", "55 Hz (Sanguisburg)"],
    inhabitants: "847M+ humanos, ARCHON, GM, División 47",
    access: "Portales / ritual. Chips neurales obligatorios.",
    color: "var(--oxblood)",
  },
  {
    id: "astral",
    name: "Plano Astral",
    chiRange: "χ ≪ χ* o χ ≫ χ*",
    regime: "Extremos — geometría imposible",
    desc: "Geometría no euclidiana, tiempo fractal/subjetivo. Creado ~5674 a.C. por Helios. El Jardín del Conocimiento. Invadido parcialmente en 1942.",
    freqs: ["37 Hz", "432 Hz (creación Jardinera)", "963 Hz (Jardín avanzado)"],
    inhabitants: "Clanes guerreros (Vikingos, Vaquíros, Samuráis, Lobos), dioses (Jardineros, Helios)",
    access: "Té de Lenguas (ritual) o portales",
    color: "var(--amber-glow)",
  },
];

function computeChi(val: number): number {
  // Map slider 0-100 to chi range 0.1 to 1.5
  return 0.1 + (val / 100) * 1.4;
}

function chiToPlane(chi: number): PlaneInfo {
  if (Math.abs(chi - CHI_STAR) < 0.05) return PLANES[0]; // Base (critical)
  if (chi > CHI_STAR + 0.05 && chi < CHI_STAR + 0.5) return PLANES[1]; // Medio (supercritical)
  return PLANES[2]; // Astral (extremes)
}

export function PlanesMapSection() {
  const [slider, setSlider] = useState(57); // default near χ* = 0.567 → slider ~ 33... let's start at Medio
  const chi = useMemo(() => computeChi(slider), [slider]);
  const plane = useMemo(() => chiToPlane(chi), [chi]);
  const chiEChi = useMemo(() => chi * Math.exp(chi), [chi]);

  return (
    <div className="fade-rise mx-auto max-w-5xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Mapa interactivo · Los 3 planos sobre Lambert W
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">El Mapa del Flujo</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Los tres planos de MEDIOEVO no son lugares físicos separados — son regímenes de la ecuación central χ·e^χ = 1. Mueve el cursor y observa cómo el valor de χ determina en qué plano existes.
        </p>
      </header>

      {/* Equation display */}
      <div className="card-archive p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 glitch-lines opacity-20 pointer-events-none" />
        <div className="relative text-center">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground mb-3">Ecuación central</p>
          <div className="font-serif text-4xl md:text-5xl font-bold mb-2" style={{ color: "var(--amber-glow)" }}>
            χ · e<sup>χ</sup> = 1
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            χ* = <span style={{ color: "var(--amber-glow)" }}>{CHI_STAR}</span> (constante Lambert W / función Ω)
          </p>
        </div>
      </div>

      {/* Interactive slider */}
      <div className="card-archive p-5 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            Ajusta χ
          </label>
          <div className="flex items-center gap-3">
            <code className="font-mono text-lg font-bold" style={{ color: "var(--amber-glow)" }}>
              χ = {chi.toFixed(4)}
            </code>
            <span className="font-mono text-xs text-muted-foreground">
              χ·e<sup>χ</sup> = {chiEChi.toFixed(4)}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={slider}
          onChange={(e) => setSlider(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(90deg,
              var(--incognita) 0%,
              var(--incognita) 30%,
              var(--oxblood) 35%,
              var(--oxblood) 60%,
              var(--amber-glow) 65%,
              var(--amber-glow) 100%)`,
          }}
          aria-label="Valor de chi"
        />

        {/* Plane markers under slider */}
        <div className="relative h-6 mt-1">
          <div className="absolute" style={{ left: "33%", transform: "translateX(-50%)" }}>
            <span className="font-mono text-[0.55rem]" style={{ color: "var(--incognita)" }}>χ* Base</span>
          </div>
          <div className="absolute" style={{ left: "50%", transform: "translateX(-50%)" }}>
            <span className="font-mono text-[0.55rem]" style={{ color: "var(--oxblood)" }}>Medio</span>
          </div>
          <div className="absolute" style={{ left: "80%", transform: "translateX(-50%)" }}>
            <span className="font-mono text-[0.55rem]" style={{ color: "var(--amber-glow)" }}>Astral</span>
          </div>
        </div>
      </div>

      {/* Active plane display */}
      <div className="card-archive p-5 md:p-6 mb-6" style={{ borderLeft: `4px solid ${plane.color}` }}>
        <div className="flex items-center gap-2 mb-3">
          <Atom className="h-5 w-5" style={{ color: plane.color }} />
          <h2 className="font-serif text-2xl font-bold" style={{ color: plane.color }}>{plane.name}</h2>
          <span className="font-mono text-xs px-2 py-0.5 rounded border" style={{ borderColor: `${plane.color}40`, color: plane.color }}>
            {plane.chiRange}
          </span>
        </div>
        <p className="font-serif italic text-sm mb-3" style={{ color: plane.color }}>{plane.regime}</p>
        <p className="font-serif text-sm text-foreground/85 leading-relaxed mb-4">{plane.desc}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-md border border-border/40 bg-card/20 p-3">
            <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1.5">Frecuencias</p>
            <div className="flex flex-wrap gap-1">
              {plane.freqs.map((f) => (
                <span key={f} className="rounded-full border px-2 py-0.5 text-[0.6rem] font-mono" style={{ borderColor: `${plane.color}40`, color: plane.color }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-card/20 p-3">
            <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1.5">Habitantes</p>
            <p className="font-serif text-xs text-foreground/80">{plane.inhabitants}</p>
          </div>
        </div>
        <div className="mt-3 rounded-md border border-border/40 bg-card/20 p-3">
          <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1.5">Acceso</p>
          <p className="font-serif text-xs text-foreground/80">{plane.access}</p>
        </div>
      </div>

      {/* All planes comparison */}
      <div className="divider-chi mb-6">Los tres planos</div>
      <div className="grid md:grid-cols-3 gap-3">
        {PLANES.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              const target = p.id === "base" ? 33 : p.id === "medio" ? 50 : 85;
              setSlider(target);
            }}
            className={`card-archive p-4 cursor-pointer transition-all hover:translate-y-[-2px] ${plane.id === p.id ? "ring-2" : ""}`}
            style={plane.id === p.id ? { boxShadow: `0 0 0 2px ${p.color}` } : {}}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              <h3 className="font-serif text-sm font-semibold" style={{ color: p.color }}>{p.name}</h3>
            </div>
            <p className="font-mono text-[0.55rem] text-muted-foreground mb-1">{p.chiRange}</p>
            <p className="font-serif text-xs text-muted-foreground italic line-clamp-2">{p.regime}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-md border border-border/40 bg-card/20 p-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--amber-glow)" }} />
        <p className="text-xs text-muted-foreground font-serif leading-relaxed">
          <strong style={{ color: "var(--foreground)" }}>Nota epistémica:</strong> La ecuación χ·e^χ = 1 y la constante Lambert W (χ* = 0.567143) son matemáticas reales. La interpretación de los tres planos como regímenes de esta ecuación es <em>construcción narrativa del autor</em> — ficción especulativa construida sobre matemáticas reales, no física validada.
        </p>
      </div>
    </div>
  );
}
