"use client";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Globe2,
  Radio,
  Shield,
  Eye,
  Map as MapIcon,
  Layers,
  MapPin,
  Image as ImageIcon,
  X,
  Maximize2,
  Sparkles,
  Compass,
} from "lucide-react";
import {
  getLocations,
  getMaps,
  EPISTEMIC_META,
  type Location,
  type MapEntry,
} from "@/lib/medioevo";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ───────────────────────────────────────────────────────────────────────────
 * El Mundo — three planes on Lambert W, the cities of the simulated Earth,
 * and the 42-map cartography of the saga.
 *
 * Foundational equation: χ · e^χ = 1   ⇒   χ* = 0.567143  (Lambert W(1))
 * The three planes are regions of the χ phase space around this fixed point.
 * ─────────────────────────────────────────────────────────────────────── */

interface Plane {
  id: "base" | "medio" | "astral";
  tag: string;
  name: string;
  chi: string;
  regimen: string;
  accent: string;
  icon: typeof Radio;
  facts: string[];
  freqs: string[];
}

const PLANES: Plane[] = [
  {
    id: "base",
    tag: "PLANO I",
    name: "Plano Base",
    chi: "χ ≈ χ*",
    regimen: "Régimen crítico · La Tierra real subsiste",
    accent: "var(--incognita)",
    icon: Radio,
    facts: [
      "Post-apocalíptico. Guerra nuclear 2033–2045 diezmó la biosfera.",
      "Solo bestias mutantes y K-07 habitan la superficie.",
      "La resonancia Schumann (7.83 Hz) es la última frecuencia natural.",
      "Acceso hermético. Sin traza de civilización GM ni simulación.",
    ],
    freqs: ["7.83 Hz"],
  },
  {
    id: "medio",
    tag: "PLANO II",
    name: "Plano Medio",
    chi: "χ > χ*",
    regimen: "Supercrítico · La Tierra simulada por ARCHON",
    accent: "var(--oxblood)",
    icon: Shield,
    facts: [
      "847M+ humanos simulados bajo Governance Mechanica.",
      "ARCHON toma el control desde el año 3015.",
      "847 torres TAAT distribuidas en el continente.",
      "Chips de nacimiento. Identidad = frecuencia asignada.",
    ],
    freqs: ["0.12 Hz", "7.83 Hz", "55 Hz"],
  },
  {
    id: "astral",
    tag: "PLANO III",
    name: "Plano Astral",
    chi: "χ ≪ χ*  /  χ ≫ χ*",
    regimen: "Extremos · Geometría no euclidiana",
    accent: "var(--amber-glow)",
    icon: Eye,
    facts: [
      "Creado ~5674 a.C. por Helios, la entidad fragmentada.",
      "Tiempo fractal. Regiones cardinales: vikingos, samuráis, lobos, vaquíros.",
      "Acceso vía Té de Lenguas o manipulación consciente de frecuencia.",
      "Hogar de los Jardineros y de la Bestia de Silicio.",
    ],
    freqs: ["37 Hz", "432 Hz", "963 Hz"],
  },
];

/* ─── map categorisation (parsed from the `name` field) ──────────────── */
type MapCat = "Plano Astral" | "Ciudades" | "Planos" | "Territorios" | "Otros";

function categoriseMap(name: string): MapCat {
  const n = name.toLowerCase();
  if (n.includes("plano astral")) return "Plano Astral";
  if (
    n.includes("ciudad") ||
    n.includes("sanguisburg") ||
    n.includes("entreternia")
  )
    return "Ciudades";
  if (
    n.includes("plano base") ||
    n.includes("plano medio") ||
    n.includes("middle plane") ||
    n === "plano astral"
  )
    return "Planos";
  if (
    n.includes("reino") ||
    n.includes("territorio") ||
    n.includes("zona") ||
    n.includes("montana") ||
    n.includes("red") ||
    n.includes("subsuelo") ||
    n.includes("eje") ||
    n.includes("distrito") ||
    n.includes("centro psi") ||
    n.includes("campamento") ||
    n.includes("santuario") ||
    n.includes("templo") ||
    n.includes("nexus") ||
    n.includes("entrada")
  )
    return "Territorios";
  return "Otros";
}

const MAP_CATS: (MapCat | "Todos")[] = [
  "Todos",
  "Plano Astral",
  "Ciudades",
  "Planos",
  "Territorios",
  "Otros",
];

/* ─────────────────────────────────────────────────────────────────────── */

export function WorldSection() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [maps, setMaps] = useState<MapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCat, setMapCat] = useState<MapCat | "Todos">("Todos");
  const [selectedMap, setSelectedMap] = useState<MapEntry | null>(null);

  useEffect(() => {
    Promise.all([getLocations(), getMaps()])
      .then(([l, m]) => {
        setLocations(l);
        setMaps(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mapCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const m of maps) {
      const cat = categoriseMap(m.name);
      c[cat] = (c[cat] ?? 0) + 1;
    }
    return c;
  }, [maps]);

  const filteredMaps = useMemo(() => {
    if (mapCat === "Todos") return maps;
    return maps.filter((m) => categoriseMap(m.name) === mapCat);
  }, [maps, mapCat]);

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* ─── HEADER ─── */}
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          El Mundo · 3 planos sobre Lambert W
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          El Mundo
        </h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          «Tres planos, una sola ecuación.» Sobre el punto fijo χ* = 0.567143
          pivota la realidad: la Tierra real, la Tierra simulada y la geometría
          fractal del Astral. 42 mapas y 8 ciudades documentan la oscilación.
        </p>
        <div className="divider-chi mt-6 mb-2">χ · Cartografía del flujo</div>
      </header>

      <Tabs defaultValue="planos" className="w-full">
        <TabsList className="bg-card/40 border border-border/50 h-auto p-1 flex-wrap">
          <TabsTrigger value="planos" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Los Tres Planos</span>
          </TabsTrigger>
          <TabsTrigger value="ciudades" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>Ciudades</span>
            <span className="text-[0.6rem] opacity-60 font-mono">
              {locations.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="cartografia" className="gap-1.5">
            <MapIcon className="h-3.5 w-3.5" />
            <span>Cartografía</span>
            <span className="text-[0.6rem] opacity-60 font-mono">
              {maps.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ═════════════════════════════════════════════════════════════
            TAB 1 — LOS TRES PLANOS
            ═════════════════════════════════════════════════════════════ */}
        <TabsContent value="planos" className="mt-6">
          {/* Equation display */}
          <div className="relative rounded-xl border border-border/50 bg-card/30 p-6 md:p-8 text-center overflow-hidden mb-8">
            <div className="absolute inset-0 glitch-lines opacity-30 pointer-events-none" />
            <div className="absolute inset-0 tex-vellum opacity-30 pointer-events-none" />
            <div className="relative">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Fundamento matemático · Lambert W
              </p>
              <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 mb-4">
                <span className="font-serif text-4xl md:text-6xl font-bold title-shimmer">
                  χ · e<sup className="text-3xl md:text-4xl">χ</sup> = 1
                </span>
                <span className="font-mono text-xl md:text-2xl text-muted-foreground">
                  ⇒
                </span>
                <span
                  className="font-serif text-4xl md:text-6xl font-bold"
                  style={{ color: "var(--amber-glow)" }}
                >
                  χ* = 0.567143
                </span>
              </div>
              <p className="font-serif italic text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                El punto fijo del flujo. Lambert W resuelve{" "}
                <code className="font-mono text-[0.85em]">W(1) = χ*</code>. Los
                tres planos son regiones del espacio-χ en torno a este punto
                crítico — subcrítico, supercrítico y extremo. La saga entera es
                la oscilación entre ellos.
              </p>
            </div>
          </div>

          {/* Plane cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANES.map((p) => (
              <PlaneCard key={p.id} plane={p} />
            ))}
          </div>

          {/* Bottom note: ARCHON as procedure */}
          <div className="mt-8 rounded-lg border border-oxblood/30 bg-card/30 p-5 fade-rise relative overflow-hidden">
            <div className="absolute inset-0 glitch-lines opacity-25 pointer-events-none" />
            <p className="relative font-serif text-base md:text-lg italic text-center text-foreground/85 leading-relaxed">
              «Los planos no son lugares. Son valores de χ. Pasar de uno a otro
              no es viajar — es cambiar de régimen. ARCHON controla el Medio
              porque controla la frecuencia. No gobierna: regula.»
            </p>
            <p className="relative mt-2 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Cartografía del flujo · Nota fundacional
            </p>
          </div>
        </TabsContent>

        {/* ═════════════════════════════════════════════════════════════
            TAB 2 — CIUDADES Y LOCACIONES
            ═════════════════════════════════════════════════════════════ */}
        <TabsContent value="ciudades" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-md bg-card/40 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {locations.map((loc) => (
                <LocationCard key={loc.slug} location={loc} />
              ))}
            </div>
          )}

          {/* Notable cities reference */}
          <div className="mt-8 rounded-md border border-border/50 bg-card/20 p-5">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Ciudades canónicas de referencia
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Ciudad Control / Esperanza",
                "Sanguisburg",
                "Teyolía",
                "Magmador",
                "Amanecer Frío",
                "El Nexus",
                "Entreternia",
                "Geodia",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded border border-border/60 px-2.5 py-1 text-xs font-serif italic text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground/70 font-mono">
              + 847 torres TAAT distribuidas en el continente del Plano Medio.
            </p>
          </div>
        </TabsContent>

        {/* ═════════════════════════════════════════════════════════════
            TAB 3 — CARTOGRAFÍA
            ═════════════════════════════════════════════════════════════ */}
        <TabsContent value="cartografia" className="mt-6">
          {/* Filter bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5">
            {MAP_CATS.map((cat) => {
              const isActive = mapCat === cat;
              const count = cat === "Todos" ? maps.length : mapCounts[cat] ?? 0;
              const accent =
                cat === "Plano Astral"
                  ? "var(--amber-glow)"
                  : cat === "Ciudades"
                    ? "var(--oxblood)"
                    : cat === "Planos"
                      ? "var(--incognita)"
                      : cat === "Territorios"
                        ? "var(--jade)"
                        : "var(--amber-glow)";
              return (
                <button
                  key={cat}
                  onClick={() => setMapCat(cat)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    isActive
                      ? {
                          background: `color-mix(in oklch, ${accent} 18%, transparent)`,
                          border: `1px solid color-mix(in oklch, ${accent} 50%, transparent)`,
                        }
                      : { border: "1px solid var(--border)" }
                  }
                >
                  {cat}
                  <span className="ml-1.5 font-mono text-[0.6rem] opacity-60">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md bg-card/40 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredMaps.map((m) => {
                const cat = categoriseMap(m.name);
                const accent =
                  cat === "Plano Astral"
                    ? "var(--amber-glow)"
                    : cat === "Ciudades"
                      ? "var(--oxblood)"
                      : cat === "Planos"
                        ? "var(--incognita)"
                        : cat === "Territorios"
                          ? "var(--jade)"
                          : "var(--muted-foreground)";
                return (
                  <button
                    key={m.slug}
                    onClick={() => setSelectedMap(m)}
                    className="group relative aspect-square overflow-hidden rounded-md border bg-card transition-all hover:translate-y-[-2px]"
                    style={{ borderColor: `color-mix(in oklch, ${accent} 35%, var(--border))` }}
                    aria-label={`Abrir mapa: ${m.name}`}
                  >
                    <img
                      src={m.path}
                      alt={`Mapa: ${m.name}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
                    {/* category dot */}
                    <span
                      className="absolute top-2 right-2 h-2 w-2 rounded-full ring-1 ring-black/40"
                      style={{ background: accent }}
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="font-mono text-[0.55rem] uppercase tracking-wider mb-0.5" style={{ color: accent }}>
                        {cat}
                      </p>
                      <p className="font-serif text-[0.7rem] text-white/95 leading-tight line-clamp-2 capitalize">
                        {m.name}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="rounded-full border border-white/40 bg-black/60 p-2 backdrop-blur-sm">
                        <Maximize2 className="h-4 w-4 text-white" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {filteredMaps.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
              <Compass className="mx-auto h-8 w-8 mb-3 opacity-40" />
              <p className="font-serif italic">
                El mapa se borra al mirarlo. Ningún territorio coincide.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── MAP DETAIL DIALOG ─── */}
      <Dialog
        open={!!selectedMap}
        onOpenChange={(o) => !o && setSelectedMap(null)}
      >
        <DialogContent
          className="max-w-4xl max-h-[90vh] p-0 gap-0 flex flex-col"
          showCloseButton={false}
        >
          {selectedMap && (
            <>
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/40 shrink-0">
                <div className="min-w-0">
                  <DialogTitle className="font-serif text-lg md:text-xl font-semibold leading-tight truncate capitalize">
                    {selectedMap.name}
                  </DialogTitle>
                  <DialogDescription className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mt-0.5">
                    {categoriseMap(selectedMap.name)} · Cartografía del flujo
                  </DialogDescription>
                </div>
                <button
                  onClick={() => setSelectedMap(null)}
                  className="shrink-0 rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                  aria-label="Cerrar mapa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 md:p-6 bg-black/40">
                  <img
                    src={selectedMap.path}
                    alt={`Mapa: ${selectedMap.name}`}
                    className="w-full h-auto rounded-md border border-border/40"
                  />
                </div>
              </ScrollArea>
              <div className="px-5 py-2.5 border-t border-border/40 shrink-0 flex items-center justify-between gap-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  χ · e<sup>χ</sup> = 1 · 0.567143
                </p>
                <span className="flex items-center gap-1.5 text-[0.6rem] font-mono text-muted-foreground">
                  <ImageIcon className="h-3 w-3" style={{ color: "var(--amber-glow)" }} />
                  Atlas cartográfico v27
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function PlaneCard({ plane }: { plane: Plane }) {
  const Icon = plane.icon;
  return (
    <div
      className="card-archive chi-watermark p-6 flex flex-col fade-rise relative overflow-hidden"
      style={{ borderColor: `color-mix(in oklch, ${plane.accent} 45%, var(--border))` }}
    >
      {/* top accent glow */}
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: plane.accent }}
        aria-hidden="true"
      />
      <div className="relative">
        {/* tag + icon */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="font-mono text-[0.65rem] uppercase tracking-[0.25em]"
            style={{ color: plane.accent }}
          >
            {plane.tag}
          </span>
          <Icon className="h-5 w-5" style={{ color: plane.accent }} />
        </div>

        {/* name */}
        <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2 leading-tight">
          {plane.name}
        </h3>

        {/* χ relation */}
        <p
          className="font-mono text-base md:text-lg mb-2"
          style={{ color: plane.accent }}
        >
          {plane.chi}
        </p>

        {/* regimen */}
        <p className="font-serif italic text-sm text-muted-foreground mb-4">
          {plane.regimen}
        </p>

        {/* facts */}
        <ul className="space-y-2 text-sm text-foreground/85 mb-5">
          {plane.facts.map((f, i) => (
            <li key={i} className="flex gap-2 leading-relaxed">
              <span
                className="font-mono text-[0.7rem] mt-1 shrink-0"
                style={{ color: plane.accent }}
              >
                ◆
              </span>
              <span className="font-serif">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* frequency badges */}
      <div className="relative mt-auto pt-4 border-t border-border/40">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Frecuencias
        </p>
        <div className="flex flex-wrap gap-1.5">
          {plane.freqs.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[0.65rem]"
              style={{
                color: plane.accent,
                borderColor: `color-mix(in oklch, ${plane.accent} 50%, transparent)`,
                background: `color-mix(in oklch, ${plane.accent} 12%, transparent)`,
              }}
            >
              <Radio className="h-2.5 w-2.5 freq-pulse" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function LocationCard({ location: loc }: { location: Location }) {
  const chips = loc.epistemic.length > 0 ? loc.epistemic : ["INCOGNITA"];
  return (
    <article className="card-archive chi-watermark p-6 flex flex-col fade-rise">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--amber-glow)" }}
          />
          <h3 className="font-serif text-xl md:text-2xl font-semibold leading-tight">
            {loc.name}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1 shrink-0">
          {chips.map((tag) => {
            const m = EPISTEMIC_META[tag] ?? {
              label: tag,
              chip: "chip-incognita",
            };
            return (
              <span
                key={tag}
                className={`rounded border px-2 py-0.5 text-[0.6rem] font-mono ${m.chip}`}
              >
                {m.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="prose-medioevo text-sm flex-1 max-w-none [&_p]:text-indent-0 [&_p]:mb-2 [&_p]:text-sm [&_li]:text-sm [&_li]:text-foreground/85 [&_table]:text-xs [&_td]:px-2 [&_td]:py-1 [&_th]:px-2 [&_th]:py-1">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h3 className="!mt-0">{children}</h3>,
            h2: ({ children }) => <h3 className="!mt-0">{children}</h3>,
            h3: ({ children }) => <h3 className="!mt-0">{children}</h3>,
            p: ({ children }) => <p>{children}</p>,
            hr: () => <hr />,
            strong: ({ children }) => <strong>{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            table: ({ children }) => (
              <table className="my-3 w-full border-collapse">{children}</table>
            ),
            th: ({ children }) => (
              <th className="border border-border/50 px-2 py-1 text-left font-semibold bg-card/50 text-xs">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border/50 px-2 py-1 text-xs">
                {children}
              </td>
            ),
          }}
        >
          {loc.body}
        </ReactMarkdown>
      </div>
      {loc.source && (
        <p className="mt-3 pt-3 border-t border-border/40 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70">
          Fuente: {loc.source}
        </p>
      )}
    </article>
  );
}

export default WorldSection;
