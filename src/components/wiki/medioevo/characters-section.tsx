"use client";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Search,
  Users,
  Shield,
  Skull,
  Eye,
  Atom,
  Radio,
  ChevronRight,
  Sparkles,
  ScrollText,
  BookOpen,
} from "lucide-react";
import {
  getCharacters,
  getCharBookRefs,
  EPISTEMIC_META,
  type Character,
} from "@/lib/medioevo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ───────────────────────────────────────────────────────────────────────────
 * Grimorio de Personajes — 18 entradas oscilando en torno a χ* = 0.567143.
 * Each character is treated as a frequency, not a "hero/villain" binary,
 * following the saga's thesis that ARCHON is procedure, not antagonist.
 * ─────────────────────────────────────────────────────────────────────── */

type Group =
  | "Protagonistas"
  | "División 47"
  | "Antagonistas"
  | "Entidades"
  | "Familias";

/* Manual taxonomy — derived from the saga's narrative structure, not the
 * loose `category` field (which is just a book-cycle tag like "B1"). */
const GROUP_OF: Record<string, Group> = {
  "Leonardo Daedalus": "Protagonistas",
  "Faith Nollan": "Protagonistas",
  "Anya Volkov": "Protagonistas",
  "Don Humo (Xochipilli)": "Protagonistas",
  "Nico Wayfinder": "Protagonistas",
  "Maku / Sentella": "División 47",
  "Malika Chronothane": "División 47",
  "Led y Lix": "División 47",
  Locke: "División 47",
  ARCHON: "Antagonistas",
  "Vladus Carnifex": "Antagonistas",
  Caius: "Antagonistas",
  MAAT: "Entidades",
  "Helios / La Bestia / El Viejito": "Entidades",
  "K-07": "Entidades",
  DJ432: "Entidades",
  "Colombo, Sánchez, Penny, Harvey": "Familias",
  "Dra. Helena Tús": "Familias",
};

/* Atmospheric frequency signature per character — drawn from saga canon
 * (Schumann 7.83 / Jardinero 432 / D47 & ARCHON 847 / Tyr 55 / Astral 963). */
const FREQ_SIG: Record<string, string> = {
  "Leonardo Daedalus": "55 Hz",
  "Faith Nollan": "847 Hz",
  "Anya Volkov": "7.83 Hz",
  "Don Humo (Xochipilli)": "432 Hz",
  "Nico Wayfinder": "432 Hz",
  "Maku / Sentella": "—",
  "Malika Chronothane": "0.12 Hz",
  "Led y Lix": "—",
  Locke: "847 Hz",
  "Colombo, Sánchez, Penny, Harvey": "—",
  ARCHON: "847 Hz",
  "Dra. Helena Tús": "—",
  Caius: "963 Hz",
  "Vladus Carnifex": "—",
  MAAT: "55 Hz",
  "Helios / La Bestia / El Viejito": "963 Hz",
  "K-07": "7.83 Hz",
  DJ432: "432 Hz",
};

interface GroupMeta {
  icon: typeof Users;
  accent: string;
  blurb: string;
}

const GROUP_META: Record<Group, GroupMeta> = {
  Protagonistas: {
    icon: Users,
    accent: "var(--amber-glow)",
    blurb: "Cinco POV · B1",
  },
  "División 47": {
    icon: Shield,
    accent: "var(--oxblood)",
    blurb: "Resistencia · D47",
  },
  Antagonistas: {
    icon: Skull,
    accent: "var(--bloqueo)",
    blurb: "Procedimientos · No villanos",
  },
  Entidades: {
    icon: Eye,
    accent: "var(--jade)",
    blurb: "IA · Fragmentos · Bestias",
  },
  Familias: {
    icon: Atom,
    accent: "var(--incognita)",
    blurb: "Civiles · Linajes",
  },
};

const GROUP_FILTERS: { id: Group | "Todos"; label: string }[] = [
  { id: "Todos", label: "Todos" },
  { id: "Protagonistas", label: "Protagonistas" },
  { id: "División 47", label: "División 47" },
  { id: "Antagonistas", label: "Antagonistas" },
  { id: "Entidades", label: "Entidades" },
  { id: "Familias", label: "Familias" },
];

/* ─── markdown table parser ──────────────────────────────────────────────
 * The `fields` object in the data only contains the first row of the
 * canonical ficha. We re-parse the markdown table embedded in `arc` to
 * recover Edad / Ubicación / Linaje etc. for richer cards.
 * ─────────────────────────────────────────────────────────────────────── */
function parseTable(arc: string): { key: string; value: string }[] {
  const lines = arc.split("\n");
  const rows: { key: string; value: string }[] = [];
  let inTable = false;
  let headerSeen = false;
  let sepSeen = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t.startsWith("|")) {
      inTable = false;
      continue;
    }
    if (!inTable) {
      inTable = true;
      headerSeen = true;
      sepSeen = false;
      continue; // skip header row
    }
    if (headerSeen && !sepSeen) {
      // separator row (|---|---|)
      sepSeen = true;
      continue;
    }
    const cells = t
      .split("|")
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length >= 2) {
      rows.push({ key: cells[0], value: cells.slice(1).join(" · ") });
    }
  }
  return rows;
}

/* Extract a short preview from the arc — strip *[CANON] tag + table. */
function getPreview(arc: string): string {
  const lines = arc.split("\n");
  const cleaned: string[] = [];
  let skippingTable = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("|")) {
      skippingTable = true;
      continue;
    }
    if (skippingTable) {
      if (t === "") {
        skippingTable = false;
        continue;
      }
      continue;
    }
    if (t.startsWith("*[CANON]") || t.startsWith("*[INFERIDO]") || t.startsWith("*[ESPECULATIVO]")) continue;
    cleaned.push(t);
  }
  const text = cleaned.join(" ").replace(/\*\*/g, "").replace(/\*/g, "").trim();
  return text.slice(0, 220);
}

/* ─────────────────────────────────────────────────────────────────────── */

export function CharactersSection({ onOpenBook }: { onOpenBook?: (num: string, title: string, chapterIdx?: number) => void }) {
  const [chars, setChars] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<Group | "Todos">("Todos");
  const [selected, setSelected] = useState<Character | null>(null);
  const [bookRefs, setBookRefs] = useState<Record<string, { book: string; title: string; count: number }[]>>({});

  useEffect(() => {
    getCharacters()
      .then((c) => {
        setChars(c);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Load cross-references (optional — graceful if missing)
    getCharBookRefs()
      .then(setBookRefs)
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return chars.filter((c) => {
      if (group !== "Todos" && (GROUP_OF[c.name] ?? "Familias") !== group) return false;
      if (ql) {
        return (
          c.name.toLowerCase().includes(ql) ||
          c.arc.toLowerCase().includes(ql) ||
          c.category.toLowerCase().includes(ql)
        );
      }
      return true;
    });
  }, [chars, q, group]);

  /* group counts for the filter bar */
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of chars) {
      const g = GROUP_OF[c.name] ?? "Familias";
      counts[g] = (counts[g] ?? 0) + 1;
    }
    return counts;
  }, [chars]);

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* ─── HEADER ─── */}
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Grimorio · 18 entradas · OSIT clasificada
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">
          Grimorio de Personajes
        </h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          «Cada nombre es una frecuencia. Cada arco es un intento de medir la
          falla.» Dieciocho consciencias — humanas, artificiales y fragmentadas —
          que oscilan en torno al punto fijo χ* = 0.567143.
        </p>
        <div className="divider-chi mt-6 mb-2">χ · Frecuencias del reparto</div>
      </header>

      {/* ─── THESIS CALLOUT ─── */}
      <div className="mb-8 rounded-lg border border-border/60 bg-card/30 p-5 fade-rise relative overflow-hidden">
        <div className="absolute inset-0 glitch-lines opacity-40 pointer-events-none" />
        <div className="relative">
          <p className="font-serif text-base md:text-lg italic text-center text-foreground/85 leading-relaxed">
            «ARCHON no es villano. ARCHON es el universo intentando repararse.
            Leonardo no es héroe. K-07 escapa porque el flujo busca nueva ruta.
            Es ley física. No es moral.»
          </p>
          <p className="mt-2 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            Tesis del Flujo · Principio Fundacional v26
          </p>
        </div>
      </div>

      {/* ─── FILTERS ─── */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, arco o ciclo…"
              className="w-full rounded-md border border-border/60 bg-input/50 pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-glow/50 transition-colors"
              aria-label="Buscar personajes"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {GROUP_FILTERS.map((g) => {
              const isActive = group === g.id;
              const accent =
                g.id === "Todos"
                  ? "var(--amber-glow)"
                  : GROUP_META[g.id as Group].accent;
              const count =
                g.id === "Todos" ? chars.length : groupCounts[g.id] ?? 0;
              return (
                <button
                  key={g.id}
                  onClick={() => setGroup(g.id)}
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
                  {g.label}
                  <span className="ml-1.5 font-mono text-[0.6rem] opacity-60">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          {filtered.length} de {chars.length} entradas · Grimorio v27 · OSIT
        </p>
      </div>

      {/* ─── GRID ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-md bg-card/40 animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <CharacterCard
              key={c.slug}
              character={c}
              onOpen={() => setSelected(c)}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-20 text-muted-foreground">
          <ScrollText className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">
            El silencio como idioma. Ninguna frecuencia coincide.
          </p>
        </div>
      )}

      {/* ─── DETAIL DIALOG ─── */}
      <Dialog
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col p-0 gap-0">
          {selected && (
            <CharacterDetail character={selected} bookRefs={bookRefs} onOpenBook={onOpenBook} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function CharacterCard({
  character: c,
  onOpen,
}: {
  character: Character;
  onOpen: () => void;
}) {
  const g = GROUP_OF[c.name] ?? "Familias";
  const meta = GROUP_META[g];
  const Icon = meta.icon;
  const freq = FREQ_SIG[c.name] ?? "—";
  const parsed = parseTable(c.arc);
  const subtitle =
    parsed.find((r) => r.key.toLowerCase() === "rol")?.value ??
    parsed[0]?.value ??
    "";
  const preview = getPreview(c.arc);
  const chips =
    c.epistemic.length > 0 ? c.epistemic : ["INCOGNITA"];

  return (
    <button
      onClick={onOpen}
      className="card-archive chi-watermark group relative p-5 text-left transition-all hover:translate-y-[-3px] flex flex-col min-h-[19rem]"
      style={{ borderColor: `color-mix(in oklch, ${meta.accent} 30%, var(--border))` }}
    >
      {/* accent ribbon */}
      <span
        className="absolute left-0 top-5 bottom-5 w-[2px] rounded-r"
        style={{ background: `color-mix(in oklch, ${meta.accent} 70%, transparent)` }}
        aria-hidden="true"
      />

      {/* group tag + cycle */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="flex items-center gap-1.5 text-[0.65rem] font-mono uppercase tracking-[0.18em]"
          style={{ color: meta.accent }}
        >
          <Icon className="h-3 w-3" /> {g}
        </span>
        <span className="font-mono text-[0.6rem] text-muted-foreground/70 uppercase tracking-wider">
          {c.category || "—"}
        </span>
      </div>

      {/* name */}
      <h3 className="font-serif text-xl font-semibold mb-1 leading-tight pr-4">
        {c.name}
      </h3>
      {subtitle && (
        <p className="text-sm text-muted-foreground font-serif italic mb-3 line-clamp-1">
          {subtitle}
        </p>
      )}

      {/* ficha técnica */}
      {parsed.length > 0 && (
        <dl
          className="mb-3 space-y-1 pl-3 border-l-2"
          style={{
            borderColor: `color-mix(in oklch, ${meta.accent} 35%, transparent)`,
          }}
        >
          {parsed.slice(0, 4).map((row, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <dt className="font-mono text-muted-foreground/80 shrink-0 w-20 uppercase tracking-wider text-[0.6rem] pt-0.5">
                {row.key}
              </dt>
              <dd className="font-serif text-foreground/85 line-clamp-1 flex-1">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* preview */}
      {preview && (
        <p className="text-xs text-muted-foreground font-serif italic leading-relaxed line-clamp-3 mb-3 flex-1">
          {preview}…
        </p>
      )}

      {/* footer: epistemic + frequency */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-1.5">
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
          {freq !== "—" && (
            <span className="flex items-center gap-1 text-[0.6rem] font-mono text-muted-foreground">
              <Radio
                className="h-2.5 w-2.5 freq-pulse"
                style={{ color: "var(--amber-glow)" }}
              />
              {freq}
            </span>
          )}
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
          style={{ color: "var(--amber-glow)" }}
        />
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function CharacterDetail({
  character: c,
  bookRefs,
  onOpenBook,
}: {
  character: Character;
  bookRefs?: Record<string, { book: string; title: string; count: number }[]>;
  onOpenBook?: (num: string, title: string, chapterIdx?: number) => void;
}) {
  const g = GROUP_OF[c.name] ?? "Familias";
  const meta = GROUP_META[g];
  const Icon = meta.icon;
  const freq = FREQ_SIG[c.name] ?? "—";
  const chips = c.epistemic.length > 0 ? c.epistemic : ["INCOGNITA"];

  return (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="flex items-center gap-1.5 text-[0.65rem] font-mono uppercase tracking-[0.2em]"
            style={{ color: meta.accent }}
          >
            <Icon className="h-3 w-3" /> {g} · {meta.blurb}
          </span>
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
        <DialogTitle className="font-serif text-3xl md:text-4xl font-bold pr-8 leading-tight">
          {c.name}
        </DialogTitle>
        <DialogDescription className="font-mono text-[0.65rem] uppercase tracking-[0.2em] mt-1">
          Grimorio v27 · Ciclo {c.category || "—"} · Frecuencia {freq}
        </DialogDescription>
        {freq !== "—" && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Radio
              className="h-3 w-3 freq-pulse"
              style={{ color: "var(--amber-glow)" }}
            />
            <span className="font-mono text-muted-foreground">
              firma espectral: <span style={{ color: "var(--amber-glow)" }}>{freq}</span>
            </span>
          </div>
        )}
      </DialogHeader>

      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-5">
          <div className="prose-medioevo max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2>{children}</h2>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                p: ({ children }) => <p>{children}</p>,
                hr: () => <hr />,
                blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                strong: ({ children }) => <strong>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                code: ({ children, className }) => (
                  <code className={className}>{children}</code>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
                ),
                li: ({ children }) => <li className="text-foreground/85">{children}</li>,
                table: ({ children }) => (
                  <table className="my-4 w-full border-collapse text-sm">
                    {children}
                  </table>
                ),
                th: ({ children }) => (
                  <th className="border border-border/50 px-3 py-1.5 text-left font-semibold bg-card/50">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border/50 px-3 py-1.5">
                    {children}
                  </td>
                ),
              }}
            >
              {c.arc}
            </ReactMarkdown>
          </div>

          {/* Cross-references: books where this character appears */}
          {(() => {
            const refs = bookRefs[c.name] || [];
            if (refs.length === 0) return null;
            return (
              <div className="mt-6 pt-5 border-t border-border/40">
                <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  <BookOpen className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
                  Apariciones en {refs.length} libro{refs.length > 1 ? "s" : ""} del canon
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {refs.slice(0, 12).map((r) => (
                    <button
                      key={r.book}
                      onClick={() => onOpenBook?.(r.book, r.title)}
                      disabled={!onOpenBook}
                      className="group flex items-center gap-1.5 rounded-md border border-border/50 bg-card/30 px-2.5 py-1 text-xs hover:border-amber-glow/40 hover:bg-card/50 transition-colors disabled:cursor-default"
                      title={onOpenBook ? `Abrir ${r.title}` : undefined}
                    >
                      <code className="font-mono text-[0.6rem]" style={{ color: "var(--amber-glow)" }}>{r.book}</code>
                      <span className="font-serif truncate max-w-[140px]">{r.title}</span>
                      <span className="font-mono text-[0.55rem] text-muted-foreground">×{r.count}</span>
                      {onOpenBook && <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-amber-glow transition-colors" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </ScrollArea>

      <div className="px-6 py-3 border-t border-border/40 shrink-0 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          χ · e<sup>χ</sup> = 1 · 0.567143
        </p>
        <span className="flex items-center gap-1.5 text-[0.65rem] font-mono text-muted-foreground">
          <Sparkles className="h-3 w-3" style={{ color: "var(--amber-glow)" }} />
          Grimorio canónico
        </span>
      </div>
    </>
  );
}

export default CharactersSection;
