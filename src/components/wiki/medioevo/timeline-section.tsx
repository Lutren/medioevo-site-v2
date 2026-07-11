"use client";
import { useEffect, useMemo, useState } from "react";
import { Clock, Radio, Layers, GitBranch, Infinity as InfinityIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getTimeline, type TimelineEvent } from "@/lib/medioevo";

/* ───────────────────────────────────────────────────────────────────────────
 * Hardcoded canon framing — the multi-plane time map.
 * Source: CRONOLOGIA.md / MEDIOEVO_004_MUNDO_PLANOS_DIOSES_v24
 * 7,692 = 12 cycles × 641 years (641 is PRIME — irreducible). NEVER 7,699.
 * ─────────────────────────────────────────────────────────────────────────── */
const PLANES = [
  {
    id: "PLANO BASE",
    short: "PB",
    label: "Plano Base",
    observer: "K-07 (observador)",
    flow: "Muy lento · 12 × 641 = 7,692 PB",
    desc: "El reloj cósmico. Cada ciclo dura 641 años — primo, irreductible. Donde la saga transcurre al final del Ciclo 3.",
    icon: Layers,
    color: "var(--canon)",
  },
  {
    id: "PLANO MEDIO",
    short: "PM",
    label: "Plano Medio",
    observer: "Leonardo / ARCHON",
    flow: "Rápido · ~300,000 PM",
    desc: "El reloj humano. Civilizaciones, guerras, IA. ARCHON desciende aquí en 1999 PM; la saga narrativa ocurre ~3025–3032 PM.",
    icon: GitBranch,
    color: "var(--amber-glow)",
  },
  {
    id: "PLANO ASTRAL",
    short: "PA",
    label: "Plano Astral",
    observer: "Helios",
    flow: "Fractal · no lineal",
    desc: "Geometría no euclidiana. Creado por Helios ~5674 a.C. Una fecha astral requiere especificar capa y nodo — no existe un «cuándo» único.",
    icon: InfinityIcon,
    color: "var(--inferido)",
  },
] as const;

type PlaneTab = "all" | "PLANO BASE" | "PLANO MEDIO" | "PLANO ASTRAL";

const TABS: { id: PlaneTab; label: string }[] = [
  { id: "all", label: "Todos los planos" },
  { id: "PLANO BASE", label: "Plano Base" },
  { id: "PLANO MEDIO", label: "Plano Medio" },
  { id: "PLANO ASTRAL", label: "Plano Astral" },
];

function planeMeta(planeId: string) {
  return PLANES.find((p) => p.id === planeId);
}

function EraChip({ era }: { era: string }) {
  if (!era) return null;
  return (
    <span className="inline-flex shrink-0 items-center rounded border border-border/60 bg-card/40 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground">
      {era}
    </span>
  );
}

function TimelineRow({ ev, idx }: { ev: TimelineEvent; idx: number }) {
  const meta = planeMeta(ev.plane);
  const color = meta?.color ?? "var(--amber-glow)";
  return (
    <li className="relative pl-8 pb-7 last:pb-0">
      {/* dot */}
      <span
        className="absolute left-[7px] top-1.5 h-3 w-3 rounded-full border-2 bg-background freq-pulse"
        style={{ borderColor: color, boxShadow: `0 0 12px ${color}` }}
      />
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
        <span
          className="font-mono text-sm font-semibold tracking-wide shrink-0 sm:w-44"
          style={{ color: "var(--amber-glow)" }}
        >
          {ev.date}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base leading-relaxed text-foreground/90">
            {ev.event}
          </p>
          {ev.era && (
            <div className="mt-1.5">
              <EraChip era={ev.era} />
            </div>
          )}
        </div>
      </div>
      <span className="sr-only">Evento {idx + 1}</span>
    </li>
  );
}

function PlaneGroup({
  planeId,
  events,
}: {
  planeId: string;
  events: TimelineEvent[];
}) {
  const meta = planeMeta(planeId);
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <section className="mb-10 last:mb-0">
      {/* Plane header strip with flow-line animation */}
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
          style={{ borderColor: `${meta.color}55`, background: `${meta.color}15`, color: meta.color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              {meta.label}
            </h3>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              {meta.short} · {meta.flow}
            </span>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-0.5 font-serif italic">
            {meta.desc}
          </p>
        </div>
      </div>
      {/* Flow-line ticker */}
      <div
        className="flow-line h-px mb-5 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${meta.color}40, transparent 70%)`,
        }}
      />

      {/* Vertical rail */}
      <ol className="relative">
        {/* rail line */}
        <span
          className="absolute left-[13px] top-2 bottom-2 w-px"
          style={{
            background: `linear-gradient(180deg, ${meta.color}66, ${meta.color}11)`,
          }}
        />
        {events.map((ev, i) => (
          <TimelineRow key={`${planeId}-${i}`} ev={ev} idx={i} />
        ))}
      </ol>
    </section>
  );
}

function AstralPlaceholder() {
  const meta = planeMeta("PLANO ASTRAL")!;
  const Icon = meta.icon;
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
          style={{ borderColor: `${meta.color}55`, background: `${meta.color}15`, color: meta.color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">
            {meta.label}
          </h3>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
            {meta.flow}
          </span>
        </div>
      </div>
      <div className="flow-line h-px mb-5 rounded-full"
           style={{ background: `linear-gradient(90deg, ${meta.color}40, transparent 70%)` }} />
      <div className="card-archive chi-watermark tex-vellum p-6 text-center">
        <InfinityIcon className="mx-auto h-7 w-7 mb-3 freq-pulse" style={{ color: meta.color }} />
        <p className="font-serif text-lg italic text-foreground/90 mb-2">
          «El tiempo astral no es una línea. Es un fractal.»
        </p>
        <p className="text-sm text-muted-foreground font-serif max-w-xl mx-auto">
          Una fecha astral requiere especificar capa y nodo. No existe un «cuándo» único. El
          archivo del K-07 no registra eventos astrales como sucesión — solo como
          superposición.
        </p>
        <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground/60">
          [INCOGNITA] · esperando entrada de Tyr
        </p>
      </div>
    </section>
  );
}

export function TimelineSection() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PlaneTab>("all");

  useEffect(() => {
    getTimeline()
      .then((ev) => {
        setEvents(ev);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter out header rows (empty plane) — they're framing data, not events.
  const realEvents = useMemo(
    () => events.filter((e) => e.plane && e.plane.trim() !== ""),
    [events],
  );

  const grouped = useMemo(() => {
    const map: Record<string, TimelineEvent[]> = {
      "PLANO BASE": [],
      "PLANO MEDIO": [],
      "PLANO ASTRAL": [],
    };
    for (const e of realEvents) {
      const key = e.plane.toUpperCase();
      if (map[key]) map[key].push(e);
      else map["PLANO ASTRAL"].push(e);
    }
    return map;
  }, [realEvents]);

  const countFor = (id: PlaneTab) =>
    id === "all" ? realEvents.length : grouped[id]?.length ?? 0;

  const renderForTab = (id: PlaneTab) => {
    if (id === "all") {
      return PLANES.map((p) =>
        p.id === "PLANO ASTRAL" && grouped[p.id].length === 0 ? (
          <AstralPlaceholder key={p.id} />
        ) : (
          <PlaneGroup key={p.id} planeId={p.id} events={grouped[p.id]} />
        ),
      );
    }
    if (id === "PLANO ASTRAL") {
      return grouped[id].length === 0 ? (
        <AstralPlaceholder />
      ) : (
        <PlaneGroup planeId={id} events={grouped[id]} />
      );
    }
    return <PlaneGroup planeId={id} events={grouped[id]} />;
  };

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* Header */}
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          El Mundo · Cronología
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Cronología</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          El tiempo no es lineal en MEDIOEVO. Cada plano tiene su propio flujo.
          Una fecha siempre requiere especificar en qué plano ocurre.
        </p>
      </header>

      {/* Three-plane map */}
      <section className="mb-8">
        <div className="divider-chi mb-6">
          TRES PLANOS · TRES RELOJES · MEDIOEVO_004
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.id} className="card-archive chi-watermark tex-vellum p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-md border"
                    style={{ borderColor: `${p.color}55`, background: `${p.color}15`, color: p.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold">{p.label}</h3>
                  <span
                    className="ml-auto font-mono text-[0.55rem] uppercase tracking-wider px-1.5 py-0.5 rounded border"
                    style={{ borderColor: `${p.color}40`, color: p.color }}
                  >
                    {p.short}
                  </span>
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground w-20 shrink-0 pt-0.5">
                      Observador
                    </dt>
                    <dd className="font-serif text-foreground/90">{p.observer}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground w-20 shrink-0 pt-0.5">
                      Flujo
                    </dt>
                    <dd className="font-serif text-foreground/90">{p.flow}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted-foreground font-serif italic leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7,692 callout — NEVER 7,699 */}
      <section className="mb-10">
        <div
          className="relative overflow-hidden rounded-md border p-6 text-center"
          style={{
            borderColor: "oklch(0.62 0.18 28 / 0.4)",
            background:
              "linear-gradient(180deg, oklch(0.62 0.18 28 / 0.08), oklch(0.74 0.13 75 / 0.04))",
          }}
        >
          <div className="glitch-lines absolute inset-0 opacity-50 pointer-events-none" />
          <div className="relative">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Fin del Ciclo 3 · Primera entrada de K-07
            </p>
            <p
              className="font-serif text-5xl md:text-7xl font-bold mb-2"
              style={{ color: "var(--amber-glow)" }}
            >
              7,692
            </p>
            <p className="font-mono text-sm text-foreground/85 mb-1">
              = 12 ciclos × 641 años
            </p>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              641 es primo · irreductible
            </p>
            <p
              className="inline-block rounded border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider"
              style={{
                borderColor: "oklch(0.60 0.20 25 / 0.5)",
                background: "oklch(0.60 0.20 25 / 0.1)",
                color: "var(--bloqueo)",
              }}
            >
              ⚠ NUNCA 7,699 — error de transcripción bloqueado
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as PlaneTab)} className="w-full">
        <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
          <TabsList className="flex w-full md:w-auto overflow-x-auto h-auto">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="flex-1 md:flex-none whitespace-nowrap py-1.5"
              >
                <span>{t.label}</span>
                <span className="ml-1.5 font-mono text-[0.6rem] text-muted-foreground">
                  {countFor(t.id)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 rounded-md bg-card/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {TABS.map((t) => (
              <TabsContent key={t.id} value={t.id} className="mt-0 focus-visible:outline-none">
                {tab === t.id && renderForTab(t.id)}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>

      {!loading && realEvents.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">El reloj se ha detenido. Sin eventos.</p>
        </div>
      )}
    </div>
  );
}

export default TimelineSection;
