"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Shield,
  EyeOff,
  Skull,
  Crown,
  Radio,
  FlaskConical,
  Network,
  Users,
  Swords,
  Eye,
  Atom,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { getFactions, EPISTEMIC_META, type Faction } from "@/lib/medioevo";

/* ───────────────────────────────────────────────────────────────────────────
 * Hardcoded canon — Architecture of Power comparison table
 * Source: LEYES_Y_PROTOCOLOS.md / MEDIOEVO_010_GOBIERNO_PODER_SISTEMAS_v24
 * ─────────────────────────────────────────────────────────────────────────── */
const POWER_ARCHITECTURE: { belief: string; reality: string }[] = [
  { belief: "El Gobierno Mundial (GM) gobierna", reality: "ARCHON controla todo" },
  { belief: "PM Caius es líder electo", reality: "Caius es avatar de ARCHON" },
  { belief: "Torres TAAT = telecomunicaciones", reality: "Torres = supresión de consciencia" },
  { belief: "Chips = conveniencia", reality: "Chips = extracción + control" },
  { belief: "División 47 investiga crímenes", reality: "D47 existe para NO resolver" },
  { belief: "Los servicios funcionan para ti", reality: "Los servicios te extraen" },
];

/* Faction slug → icon hint (purely visual) */
const FACTION_ICON: Record<string, typeof Shield> = {
  "archon-gm-governance-mechanica": Network,
  "division-47": Shield,
  "los-jardineros": Crown,
  "helios-y-sus-fragmentos": Radio,
  "teyolia-clan-nemontemi": EyeOff,
  "los-carmesi": Skull,
  "los-hemacronos-sanguisburg": FlaskConical,
  "los-observadores-division-historica": Eye,
  "onu-pharmatek": Users,
  "laboratorio-de-frecuencias-gm": FlaskConical,
  "el-vacio-la-mafia-del-vacio": Swords,
  maat: Atom,
};

/* ───────────────────────────────────────────────────────────────────────────
 * Lightweight inline markdown renderer for faction bodies.
 * Handles: **bold**, [CANON]/[INFERIDO]/[ESPECULATIVO]/[BLOQUEO]/[INCOGNITA]
 * epistemic chip tags. Returns ReactNode[].
 * ─────────────────────────────────────────────────────────────────────────── */
function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[A-ZÁÉÍÓÚÑ]+\])/g;
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
        <em key={`${keyBase}-i${k++}`} className="text-amber-200/80 italic">
          {tok.slice(1, -1)}
        </em>,
      );
    } else {
      const label = tok.slice(1, -1);
      const meta = EPISTEMIC_META[label];
      if (meta) {
        parts.push(
          <span
            key={`${keyBase}-c${k++}`}
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
  | { type: "para"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "hr" };

/* Parse the markdown-ish body into blocks. */
function parseBody(body: string): Block[] {
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }
    if (trimmed === "---" || trimmed === "***") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }
    // Table: consecutive lines starting with |
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const cells = tableLines.map((l) =>
        l
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim()),
      );
      // drop separator row (---)
      const filtered = cells.filter(
        (row) => !row.every((c) => /^[-:\s]+$/.test(c)),
      );
      if (filtered.length >= 1) {
        const header = filtered[0];
        const rows = filtered.slice(1);
        blocks.push({ type: "table", header, rows });
      }
      continue;
    }
    // Bullet list: consecutive lines starting with - or *
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }
    // Paragraph: accumulate until blank/special line
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      lines[i].trim() !== "---" &&
      !lines[i].trim().startsWith("|") &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "para", text: paraLines.join(" ") });
  }
  return blocks;
}

function BodyRenderer({ body, slug }: { body: string; slug: string }) {
  const blocks = parseBody(body);
  return (
    <div className="space-y-3">
      {blocks.map((b, idx) => {
        if (b.type === "hr") {
          return (
            <div key={idx} className="divider-chi my-4">
              <span>χ</span>
            </div>
          );
        }
        if (b.type === "para") {
          return (
            <p key={idx} className="text-sm leading-relaxed text-foreground/85 font-serif">
              {renderInline(b.text, `${slug}-${idx}`)}
            </p>
          );
        }
        if (b.type === "list") {
          return (
            <ul key={idx} className="space-y-1.5 pl-1">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2 text-sm text-foreground/85 font-serif">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: "var(--amber-glow)" }}
                  />
                  <span>{renderInline(it, `${slug}-${idx}-l${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        // table
        return (
          <div
            key={idx}
            className="overflow-x-auto rounded-md border border-border/50 bg-card/40"
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-card/60">
                  {b.header.map((h, j) => (
                    <th
                      key={j}
                      className="px-3 py-2 font-mono uppercase tracking-wider text-muted-foreground"
                    >
                      {renderInline(h, `${slug}-${idx}-h${j}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-border/30 last:border-b-0 odd:bg-card/20"
                  >
                    {r.map((c, ci) => (
                      <td key={ci} className="px-3 py-2 align-top text-foreground/85 font-serif">
                        {renderInline(c, `${slug}-${idx}-r${ri}c${ci}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function EpistemicChips({ states }: { states: string[] }) {
  if (!states || states.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {states.map((s) => {
        const meta = EPISTEMIC_META[s] || {
          label: s,
          chip: "chip-incognita",
          color: "var(--incognita)",
        };
        return (
          <span
            key={s}
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-wider ${meta.chip}`}
          >
            <span
              className="h-1 w-1 rounded-full freq-pulse"
              style={{ background: meta.color }}
            />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * Section
 * ─────────────────────────────────────────────────────────────────────────── */
export function FactionsSection() {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFactions()
      .then((f) => {
        setFactions(f);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      {/* Header */}
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          El Mundo · Facciones
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Facciones</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          La lucha humana ocurre en QUIÉN CONTROLA EL CANAL. Estas son las
          entidades —terrenales, algorítmicas, divinas— que disputan el flujo de
          la consciencia. Cada facción opera en un plano distinto del
          conocimiento.
        </p>
      </header>

      {/* Architecture of Power — hardcoded canon comparison */}
      <section className="mb-10">
        <div className="divider-chi mb-6">
          ARQUITECTURA DEL PODER · CANON DURO · LEYES_Y_PROTOCOLOS
        </div>
        <div className="card-archive chi-watermark tex-vellum overflow-hidden">
          <div className="glitch-lines absolute inset-0 opacity-40 pointer-events-none" />
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/60">
                  <th className="px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground w-1/2">
                    Lo que la gente cree
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] w-1/2"
                      style={{ color: "var(--oxblood)" }}>
                    La realidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {POWER_ARCHITECTURE.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/30 last:border-b-0 odd:bg-card/15"
                  >
                    <td className="px-4 py-3 font-serif text-muted-foreground/90 italic line-through decoration-1 decoration-muted-foreground/30">
                      {row.belief}
                    </td>
                    <td className="px-4 py-3 font-serif text-foreground/95 font-medium">
                      {row.reality}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground/70">
          Fuente: MEDIOEVO_010_GOBIERNO_PODER_SISTEMAS_v24 · Atlas Medioevo
        </p>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-md bg-card/40 animate-pulse border border-border/30"
            />
          ))}
        </div>
      )}

      {/* Factions accordion */}
      {!loading && (
        <Accordion type="single" collapsible className="space-y-3" defaultValue="">
          {factions.map((f, idx) => {
            const Icon = FACTION_ICON[f.slug] || Shield;
            const fieldEntries = Object.entries(f.fields || {});
            return (
              <AccordionItem
                key={f.slug}
                value={f.slug}
                className="card-archive chi-watermark overflow-hidden rounded-md border-border/50 data-[state=open]:border-oxblood/40 transition-colors"
              >
                <AccordionTrigger className="px-4 md:px-5 hover:no-underline group">
                  <div className="flex items-start gap-3 pr-4 w-full">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
                      style={{
                        borderColor: "oklch(0.62 0.18 28 / 0.4)",
                        background: "oklch(0.62 0.18 28 / 0.1)",
                        color: "var(--amber-glow)",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-mono text-[0.55rem] text-muted-foreground/60">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-serif text-xl font-semibold text-foreground group-data-[state=open]:title-shimmer">
                          {f.name}
                        </h3>
                      </div>
                      <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
                        <EpistemicChips states={f.epistemic} />
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-5 pb-5">
                  <div className="divider-chi mb-4">
                    <span>FICHA · {f.slug.toUpperCase().replace(/-/g, " ")}</span>
                  </div>

                  {/* Fields as definition list */}
                  {fieldEntries.length > 0 && (
                    <dl className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {fieldEntries.map(([k, v]) => (
                        <div
                          key={k}
                          className="flex flex-col rounded-md border border-border/40 bg-card/30 px-3 py-2"
                        >
                          <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                            {k}
                          </dt>
                          <dd className="font-serif text-sm text-foreground/90 mt-0.5">
                            {renderInline(v, `${f.slug}-fld-${k}`)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {/* Body */}
                  <BodyRenderer body={f.body} slug={f.slug} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {!loading && factions.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Shield className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">El archivo está sellado. Sin facciones.</p>
        </div>
      )}
    </div>
  );
}

export default FactionsSection;
