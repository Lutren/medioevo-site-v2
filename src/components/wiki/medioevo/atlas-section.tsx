"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Cpu,
  Gem,
  Radio,
  Sparkles,
  Languages,
  Leaf,
  PawPrint,
  Rocket,
  Scale,
  Terminal,
  Activity,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAtlasDocs, EPISTEMIC_META, type AtlasDoc } from "@/lib/medioevo";

/* ───────────────────────────────────────────────────────────────────────────
 * Tab → atlas doc mapping
 * ─────────────────────────────────────────────────────────────────────────── */
type TabId =
  | "TECNOLOGIAS"
  | "ARTEFACTOS"
  | "CIENCIA_Y_FRECUENCIAS"
  | "MAGIA_Y_FRECUENCIAS"
  | "IDIOMAS_Y_CODIGOS"
  | "FLORA"
  | "FAUNA"
  | "VEHICULOS"
  | "LEYES_Y_PROTOCOLOS";

const TABS: { id: TabId; label: string; icon: typeof Cpu }[] = [
  { id: "TECNOLOGIAS", label: "Tecnologías", icon: Cpu },
  { id: "ARTEFACTOS", label: "Artefactos", icon: Gem },
  { id: "CIENCIA_Y_FRECUENCIAS", label: "Ciencia & Frecuencias", icon: Activity },
  { id: "MAGIA_Y_FRECUENCIAS", label: "Magia", icon: Sparkles },
  { id: "IDIOMAS_Y_CODIGOS", label: "Idiomas", icon: Languages },
  { id: "FLORA", label: "Flora", icon: Leaf },
  { id: "FAUNA", label: "Fauna", icon: PawPrint },
  { id: "VEHICULOS", label: "Vehículos", icon: Rocket },
  { id: "LEYES_Y_PROTOCOLOS", label: "Leyes", icon: Scale },
];

/* ───────────────────────────────────────────────────────────────────────────
 * Sistema de Frecuencias — hardcoded canon visual spectrum.
 * Source: MAGIA_Y_FRECUENCIAS / CIENCIA_Y_FRECUENCIAS / Grimorio v27.
 * Log-scaled 0.1 Hz → 1000 Hz (4 decades).
 * ─────────────────────────────────────────────────────────────────────────── */
const FREQUENCIES: {
  hz: number;
  label: string;
  desc: string;
  color: string;
  tag: string;
}[] = [
  { hz: 0.12, label: "0.12 Hz", desc: "Infrasonido Torres TAAT · supresión de consciencia", color: "var(--bloqueo)", tag: "SUPRESIÓN" },
  { hz: 7.83, label: "7.83 Hz", desc: "Resonancia Schumann · la Tierra real subsiste", color: "var(--canon)", tag: "TIERRA" },
  { hz: 37, label: "37 Hz", desc: "Plano Astral · acceso fractal", color: "var(--incognita)", tag: "ASTRAL" },
  { hz: 55, label: "55 Hz", desc: "Sanguisburg · hemocronos", color: "var(--oxblood)", tag: "SANGRE" },
  { hz: 432, label: "432 Hz", desc: "Creación Jardinera · Don Humo se dispersa a 432 Hz", color: "var(--amber-glow)", tag: "CREACIÓN" },
  { hz: 847, label: "847 Hz", desc: "División 47 · leitmotiv numérico de la saga", color: "var(--oxblood)", tag: "D47" },
  { hz: 963, label: "963 Hz", desc: "Jardinero avanzado · sistema superior", color: "var(--jade)", tag: "JARDÍN" },
];

const FREQ_MIN = 0.1;
const FREQ_MAX = 1000;
const freqPos = (hz: number) => {
  const p = (Math.log10(hz) - Math.log10(FREQ_MIN)) / (Math.log10(FREQ_MAX) - Math.log10(FREQ_MIN));
  return Math.max(0, Math.min(100, p * 100));
};
const FREQ_TICKS = [0.1, 1, 10, 100, 1000];

/* ───────────────────────────────────────────────────────────────────────────
 * Lightweight markdown renderer
 * Supports: #, ##, ###, ####  · > blockquote · | tables | · -/* bullets ·
 * 1. ordered lists · --- hr · **bold** · *italic* · `code` · [CANON]/[INFERIDO]/[ESPECULATIVO]/[BLOQUEO]/[INCOGNITA] chips
 * ─────────────────────────────────────────────────────────────────────────── */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[A-ZÁÉÍÓÚÑ]+\])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={`${keyBase}-b${k++}`} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("*")) {
      parts.push(
        <em key={`${keyBase}-i${k++}`} className="italic" style={{ color: "oklch(0.84 0.04 75)" }}>
          {tok.slice(1, -1)}
        </em>,
      );
    } else if (tok.startsWith("`")) {
      parts.push(
        <code
          key={`${keyBase}-c${k++}`}
          className="font-mono text-[0.85em] rounded px-1.5 py-px"
          style={{ background: "oklch(0.26 0.012 55 / 0.6)", color: "oklch(0.84 0.06 75)" }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      const label = tok.slice(1, -1);
      const meta = EPISTEMIC_META[label];
      if (meta) {
        parts.push(
          <span
            key={`${keyBase}-e${k++}`}
            className={`mx-0.5 inline-flex items-center rounded border px-1.5 py-px font-mono text-[0.55rem] font-semibold uppercase tracking-wider align-middle ${meta.chip}`}
          >
            {meta.label}
          </span>,
        );
      } else {
        parts.push(tok);
      }
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type Block =
  | { type: "h"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "para"; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "hr" };

function parseMarkdown(raw: string): Block[] {
  const lines = raw.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }
    // Headings
    const hMatch = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (hMatch) {
      const level = hMatch[1].length as 1 | 2 | 3 | 4;
      blocks.push({ type: "h", level, text: hMatch[2] });
      i++;
      continue;
    }
    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }
    // Table
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const cells = tableLines.map((l) =>
        l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()),
      );
      const filtered = cells.filter((row) => !row.every((c) => /^[-:\s]+$/.test(c)));
      if (filtered.length >= 1) {
        blocks.push({ type: "table", header: filtered[0], rows: filtered.slice(1) });
      }
      continue;
    }
    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      lines[i].trim() !== "---" &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith(">") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^#{1,4}\s+/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "para", text: paraLines.join(" ") });
  }
  return blocks;
}

function MarkdownView({ raw, slug }: { raw: string; slug: string }) {
  const blocks = parseMarkdown(raw);
  return (
    <div
      className="prose-medioevo max-w-none"
      style={{ textIndent: 0 }}
    >
      {blocks.map((b, idx) => {
        const key = `${slug}-${idx}`;
        switch (b.type) {
          case "h":
            if (b.level === 1)
              return (
                <h1 key={key} className="font-serif text-2xl md:text-3xl font-bold mt-6 mb-3" style={{ color: "var(--amber-glow)" }}>
                  {renderInline(b.text, key)}
                </h1>
              );
            if (b.level === 2)
              return (
                <h2 key={key} className="font-serif text-xl md:text-2xl font-semibold mt-6 mb-2 pb-1 border-b border-border/40">
                  {renderInline(b.text, key)}
                </h2>
              );
            if (b.level === 3)
              return (
                <h3 key={key} className="font-serif text-lg font-semibold mt-5 mb-2 flex items-center gap-2">
                  <span className="h-3 w-1 rounded-full" style={{ background: "var(--amber-glow)" }} />
                  {renderInline(b.text, key)}
                </h3>
              );
            return (
              <h4 key={key} className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mt-4 mb-1.5">
                {renderInline(b.text, key)}
              </h4>
            );
          case "para":
            return (
              <p key={key} style={{ textIndent: 0, marginBottom: "1rem" }}>
                {renderInline(b.text, key)}
              </p>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="my-4 border-l-2 pl-4 py-1 italic"
                style={{ borderColor: "oklch(0.62 0.18 28 / 0.5)", color: "oklch(0.80 0.014 70)" }}
              >
                {b.lines.map((l, j) => (
                  <p key={j} style={{ textIndent: 0, marginBottom: j < b.lines.length - 1 ? "0.5rem" : 0 }}>
                    {renderInline(l, `${key}-q${j}`)}
                  </p>
                ))}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key} className="my-3 space-y-1.5 pl-1" style={{ listStyle: "none" }}>
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--amber-glow)" }} />
                    <span>{renderInline(it, `${key}-l${j}`)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="my-3 space-y-1.5 pl-1" style={{ listStyle: "none" }}>
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="font-mono text-xs shrink-0 mt-0.5" style={{ color: "var(--amber-glow)" }}>
                      {String(j + 1).padStart(2, "0")}.
                    </span>
                    <span>{renderInline(it, `${key}-l${j}`)}</span>
                  </li>
                ))}
              </ol>
            );
          case "hr":
            return (
              <div key={key} className="divider-chi my-6">
                <span>χ</span>
              </div>
            );
          case "table":
            return (
              <div key={key} className="my-4 overflow-x-auto rounded-md border border-border/50 bg-card/40">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-card/60">
                      {b.header.map((h, j) => (
                        <th key={j} className="px-3 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          {renderInline(h, `${key}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri} className="border-b border-border/30 last:border-b-0 odd:bg-card/20">
                        {r.map((c, ci) => (
                          <td key={ci} className="px-3 py-2 align-top">
                            {renderInline(c, `${key}-r${ri}c${ci}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * Frequency spectrum visual
 * ─────────────────────────────────────────────────────────────────────────── */
function FrequencySpectrum() {
  return (
    <section className="mb-10">
      <div className="divider-chi mb-6">
        SISTEMA DE FRECUENCIAS · CANON · GRIMORIO v27
      </div>
      <div className="card-archive chi-watermark tex-vellum relative overflow-hidden p-5 md:p-7">
        <div className="glitch-lines absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
            <Terminal className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              k07-archive://frecuencias/spectrum.log
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6rem] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full freq-pulse" style={{ background: "var(--canon)" }} />
              LIVE
            </span>
          </div>

          {/* Spectrum bar */}
          <div className="relative h-32 mb-3">
            {/* baseline */}
            <div
              className="absolute left-0 right-0 bottom-8 h-px"
              style={{ background: "linear-gradient(90deg, oklch(0.40 0.06 50 / 0.4), oklch(0.74 0.13 75 / 0.3), oklch(0.40 0.06 50 / 0.4))" }}
            />
            {/* spikes */}
            {FREQUENCIES.map((f) => {
              const pos = freqPos(f.hz);
              // height grows with log magnitude but capped for visual balance
              const heightPct = 30 + (Math.log10(f.hz / FREQ_MIN) / Math.log10(FREQ_MAX / FREQ_MIN)) * 60;
              return (
                <div
                  key={f.hz}
                  className="absolute bottom-8 flex flex-col items-center"
                  style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                >
                  <span
                    className="font-mono text-[0.55rem] mb-1 whitespace-nowrap"
                    style={{ color: f.color }}
                  >
                    {f.label}
                  </span>
                  <div
                    className="freq-pulse rounded-t-sm"
                    style={{
                      width: "3px",
                      height: `${heightPct}%`,
                      background: `linear-gradient(180deg, ${f.color}, ${f.color}30)`,
                      boxShadow: `0 0 8px ${f.color}`,
                    }}
                  />
                  <span
                    className="h-2 w-2 rounded-full -mt-px"
                    style={{ background: f.color, boxShadow: `0 0 6px ${f.color}` }}
                  />
                </div>
              );
            })}
            {/* decade ticks */}
            {FREQ_TICKS.map((t) => (
              <div
                key={t}
                className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${freqPos(t)}%` }}
              >
                <span className="font-mono text-[0.55rem] text-muted-foreground/60">{t} Hz</span>
              </div>
            ))}
          </div>

          {/* Frequency legend / cards */}
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {FREQUENCIES.map((f) => (
              <div
                key={f.hz}
                className="flex items-start gap-3 rounded-md border border-border/40 bg-card/30 px-3 py-2"
              >
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full freq-pulse"
                  style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }}
                />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <code
                      className="font-mono text-sm font-bold"
                      style={{ color: f.color }}
                    >
                      {f.label}
                    </code>
                    <span
                      className="font-mono text-[0.5rem] uppercase tracking-wider px-1 py-px rounded border"
                      style={{ borderColor: `${f.color}40`, color: f.color }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-serif mt-0.5 leading-snug">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground/70 text-center">
            Escala logarítmica · 0.1 Hz → 1000 Hz · 4 décadas
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * Section
 * ─────────────────────────────────────────────────────────────────────────── */
export function AtlasSection() {
  const [docs, setDocs] = useState<AtlasDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("TECNOLOGIAS");

  useEffect(() => {
    getAtlasDocs()
      .then((d) => {
        setDocs(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const docsById = useMemo(() => {
    const m: Record<string, AtlasDoc> = {};
    for (const d of docs) m[d.id] = d;
    return m;
  }, [docs]);

  const current = docsById[tab];

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* Header */}
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          El Mundo · Atlas
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Atlas</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Terminal de referencia del archivo K-07. Tecnologías, artefactos,
          frecuencias, idiomas, flora, fauna, vehículos y leyes del mundo
          MEDIOEVO. Cada entrada marcada por estado epistémico OSIT.
        </p>
      </header>

      {/* Frequency spectrum panel — always visible at top */}
      <FrequencySpectrum />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="w-full">
        <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
          <TabsList className="flex w-full overflow-x-auto h-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="flex-1 md:flex-none whitespace-nowrap py-1.5 gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-6 rounded bg-card/40 animate-pulse" style={{ width: `${60 + (i * 7) % 40}%` }} />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[200px_1fr] gap-6">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Documentos del Atlas
                </p>
                <ul className="space-y-1">
                  {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.id;
                    const d = docsById[t.id];
                    return (
                      <li key={t.id}>
                        <button
                          onClick={() => setTab(t.id)}
                          className="rail-item w-full text-left flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors"
                          aria-current={isActive}
                          style={{
                            color: isActive ? "var(--amber-glow)" : undefined,
                            background: isActive ? "oklch(0.74 0.13 75 / 0.08)" : undefined,
                          }}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="flex-1 truncate">{t.label}</span>
                          {d && (
                            <span className="font-mono text-[0.55rem] text-muted-foreground">
                              {d.raw.length > 1000 ? `${Math.round(d.raw.length / 1000)}k` : d.raw.length}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Active doc */}
            <div className="min-w-0">
              {TABS.map((t) => (
                <TabsContent key={t.id} value={t.id} className="mt-0 focus-visible:outline-none">
                  {tab === t.id && docsById[t.id] && (
                    <article className="card-archive chi-watermark tex-vellum relative overflow-hidden p-5 md:p-8">
                      <div className="glitch-lines absolute inset-0 opacity-20 pointer-events-none" />
                      <div className="relative">
                        {/* Doc header */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
                          <Terminal className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
                          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                            k07-archive://atlas/{docsById[t.id]!.file}
                          </span>
                          <span className="ml-auto font-mono text-[0.55rem] text-muted-foreground">
                            {docsById[t.id]!.raw.length} chars
                          </span>
                        </div>
                        <MarkdownView raw={docsById[t.id]!.raw} slug={t.id} />
                      </div>
                    </article>
                  )}
                  {tab === t.id && !docsById[t.id] && (
                    <div className="card-archive p-8 text-center text-muted-foreground">
                      <Terminal className="mx-auto h-8 w-8 mb-3 opacity-40" />
                      <p className="font-serif italic">
                        Documento no disponible en el archivo: {t.id}
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}

export default AtlasSection;
