"use client";
import { useMemo, useState } from "react";
import { Search, BookText, X } from "lucide-react";
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/lib/glossary";
import { EPISTEMIC_META } from "@/lib/medioevo";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function GlossarySection() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [selected, setSelected] = useState<GlossaryTerm | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return GLOSSARY.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (ql) {
        return (
          t.term.toLowerCase().includes(ql) ||
          t.definition.toLowerCase().includes(ql) ||
          (t.related || []).some((r) => r.toLowerCase().includes(ql))
        );
      }
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term, "es"));
  }, [q, cat]);

  const grouped = useMemo(() => {
    const m: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      if (!m[t.category]) m[t.category] = [];
      m[t.category].push(t);
    }
    return m;
  }, [filtered]);

  return (
    <div className="fade-rise mx-auto max-w-6xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">Glosario · {GLOSSARY.length} términos canónicos</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Glosario del Flujo</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Cada término del universo MEDIOEVO, clasificado por estado epistémico OSIT. De la Tesis del Flujo a la constante Lambert W, de ARCHON al té de lenguas.
        </p>
      </header>

      {/* Search + filters */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar término, definición o relación…"
              className="w-full rounded-md border border-border/60 bg-input/50 pl-9 pr-3 py-2 text-sm font-serif outline-none focus:border-amber-glow/50 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            <button onClick={() => setCat("all")}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={cat === "all" ? { background: "oklch(0.62 0.18 28 / 0.18)", border: "1px solid oklch(0.62 0.18 28 / 0.4)" } : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
              Todos
            </button>
            {GLOSSARY_CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                style={cat === c ? { background: "oklch(0.62 0.18 28 / 0.18)", border: "1px solid oklch(0.62 0.18 28 / 0.4)" } : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-mono">{filtered.length} términos</p>
      </div>

      {/* Grouped results */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, terms]) => (
          <section key={category}>
            <div className="divider-chi mb-4">{category.toUpperCase()}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {terms.map((t) => {
                const meta = t.epistemic ? EPISTEMIC_META[t.epistemic] : null;
                return (
                  <button key={t.slug} onClick={() => setSelected(t)}
                    className="card-archive group p-4 text-left transition-all hover:translate-y-[-2px]">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-base font-semibold leading-tight">{t.term}</h3>
                      {meta && (
                        <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[0.55rem] font-mono ${meta.chip}`}>{meta.label}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-serif leading-relaxed line-clamp-3">{t.definition}</p>
                    {t.related && t.related.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.related.slice(0, 3).map((r) => (
                          <span key={r} className="rounded-full border border-border/40 px-1.5 py-0.5 text-[0.55rem] font-mono text-muted-foreground">
                            {r}
                          </span>
                        ))}
                        {t.related.length > 3 && <span className="text-[0.55rem] font-mono text-muted-foreground/60">+{t.related.length - 3}</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <BookText className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">El silencio como idioma. Ningún término coincide.</p>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ background: "oklch(0.16 0.010 50)" }}>
          <DialogTitle className="sr-only">Definición de término: {selected?.term}</DialogTitle>
          {selected && (
            <>
              <div className="px-5 pt-5 pb-3 border-b border-border/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-1">{selected.category}</p>
                    <h2 className="font-serif text-2xl font-bold leading-tight">{selected.term}</h2>
                  </div>
                  {selected.epistemic && (() => {
                    const meta = EPISTEMIC_META[selected.epistemic!];
                    return (
                      <span className={`shrink-0 rounded border px-2 py-1 text-[0.6rem] font-mono font-semibold ${meta.chip}`}>{meta.label}</span>
                    );
                  })()}
                </div>
              </div>
              <ScrollArea className="max-h-[60vh]">
                <div className="px-5 py-4">
                  <p className="font-serif text-sm leading-relaxed text-foreground/90" style={{ textIndent: 0 }}>{selected.definition}</p>
                  {selected.related && selected.related.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-2">Términos relacionados</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.related.map((r) => {
                          const found = GLOSSARY.find((g) => g.term === r);
                          return (
                            <button key={r}
                              onClick={() => found && setSelected(found)}
                              disabled={!found}
                              className="rounded-full border border-amber-glow/30 px-2.5 py-1 text-[0.65rem] font-mono transition-colors hover:border-amber-glow/60 disabled:opacity-40"
                              style={{ color: "var(--amber-glow)" }}>
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
