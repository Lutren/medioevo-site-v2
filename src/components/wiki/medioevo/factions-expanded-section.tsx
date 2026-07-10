"use client";
import { useState, useMemo } from "react";
import { Search, Users, MapPin, Sword, Shield, Skull, Globe2, Cpu } from "lucide-react";
import { EXPANDED_FACTIONS, type ExpandedFaction } from "@/lib/expanded-factions";
import { EPISTEMIC_META } from "@/lib/medioevo";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const CATEGORIES = [
  { id: "all", label: "Todas", icon: Users },
  { id: "Punk", label: "Tribus Punk", icon: Cpu },
  { id: "Astral", label: "Regiones Astrales", icon: Globe2 },
  { id: "Geodia", label: "Ciudadanos de Geodia", icon: MapPin },
  { id: "Resistencia", label: "Resistencia", icon: Shield },
  { id: "Hemacrona", label: "Hemacronos", icon: Skull },
  { id: "Sistema", label: "Sistema", icon: Sword },
  { id: "Divina", label: "Divinas", icon: Users },
] as const;

const CAT_COLOR: Record<string, string> = {
  Punk: "var(--oxblood)",
  Astral: "var(--amber-glow)",
  Geodia: "var(--canon)",
  Resistencia: "var(--jade)",
  Hemacrona: "var(--bloqueo)",
  Sistema: "var(--incognita)",
  Divina: "var(--canon)",
};

export function FactionsExpandedSection() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [selected, setSelected] = useState<ExpandedFaction | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return EXPANDED_FACTIONS.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (ql) {
        return (
          f.name.toLowerCase().includes(ql) ||
          f.philosophy.toLowerCase().includes(ql) ||
          f.ability.toLowerCase().includes(ql) ||
          f.location.toLowerCase().includes(ql)
        );
      }
      return true;
    });
  }, [q, cat]);

  const grouped = useMemo(() => {
    const m: Record<string, ExpandedFaction[]> = {};
    for (const f of filtered) {
      if (!m[f.category]) m[f.category] = [];
      m[f.category].push(f);
    }
    return m;
  }, [filtered]);

  return (
    <div className="fade-rise mx-auto max-w-6xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Facciones expandidas · {EXPANDED_FACTIONS.length} grupos canónicos
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Las Facciones del Flujo</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Las 7 tribus punk, las regiones cardinales del Astral, los ciudadanos de Geodia, la resistencia, las casas hemacronas y el sistema ARCHON. Cada facción con su filosofía, horror y debilidad — la lucha humana en QUIÉN CONTROLA EL CANAL.
        </p>
      </header>

      {/* Controls */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar facción, filosofía, habilidad o lugar…"
              className="w-full rounded-md border border-border/60 bg-input/50 pl-9 pr-3 py-2 text-sm font-serif outline-none focus:border-amber-glow/50 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const isActive = cat === c.id;
              return (
                <button key={c.id} onClick={() => setCat(c.id)}
                  className="shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                  style={isActive ? { background: "oklch(0.62 0.18 28 / 0.18)", border: "1px solid oklch(0.62 0.18 28 / 0.4)" } : { border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                  <Icon className="h-3 w-3" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-mono">{filtered.length} facciones</p>
      </div>

      {/* Grouped results */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, facs]) => {
          const color = CAT_COLOR[category] || "var(--amber-glow)";
          return (
            <section key={category}>
              <div className="divider-chi mb-4" style={{ color }}>{category.toUpperCase()}</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {facs.map((f) => {
                  const meta = f.epistemic ? EPISTEMIC_META[f.epistemic] : null;
                  return (
                    <button key={f.id} onClick={() => setSelected(f)}
                      className="card-archive group p-4 text-left transition-all hover:translate-y-[-2px]"
                      style={{ borderLeft: `3px solid ${color}` }}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-serif text-base font-semibold leading-tight">{f.name}</h3>
                        {meta && <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[0.5rem] font-mono ${meta.chip}`}>{meta.label}</span>}
                      </div>
                      <p className="text-xs font-serif italic mb-2" style={{ color }}>{f.philosophy}</p>
                      <p className="text-xs text-muted-foreground font-serif leading-relaxed line-clamp-2">{f.horror}</p>
                      {f.aesthetic && (
                        <p className="mt-2 text-[0.65rem] font-mono text-muted-foreground/60 line-clamp-1 border-t border-border/20 pt-1.5">
                          ✦ {f.aesthetic.slice(0, 70)}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">El silencio como idioma. Ninguna facción coincide.</p>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ background: "oklch(0.16 0.010 50)" }}>
          <DialogTitle className="sr-only">Detalle de facción: {selected?.name}</DialogTitle>
          {selected && (() => {
            const meta = selected.epistemic ? EPISTEMIC_META[selected.epistemic] : null;
            const color = CAT_COLOR[selected.category] || "var(--amber-glow)";
            return (
              <>
                <div className="px-5 pt-5 pb-3 border-b border-border/40" style={{ borderTop: `3px solid ${color}` }}>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mb-1" style={{ color }}>{selected.category}</p>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-2xl font-bold leading-tight">{selected.name}</h2>
                    {meta && <span className={`shrink-0 rounded border px-2 py-1 text-[0.6rem] font-mono font-semibold ${meta.chip}`}>{meta.label}</span>}
                  </div>
                  <p className="mt-1 font-serif italic text-sm" style={{ color }}>{selected.philosophy}</p>
                </div>
                <ScrollArea className="max-h-[60vh]">
                  <div className="px-5 py-4 space-y-3">
                    {selected.aesthetic && (
                      <Field label="Estética" value={selected.aesthetic} color={color} />
                    )}
                    <Field label="Relación con ARCHON" value={selected.archonRelation} color={color} />
                    <Field label="Horror específico" value={selected.horror} color="var(--bloqueo)" />
                    <Field label="Habilidad" value={selected.ability} color="var(--canon)" />
                    <Field label="Debilidad" value={selected.weakness} color="var(--inferido)" />
                    <Field label="Ubicación" value={selected.location} color="var(--incognita)" />
                  </div>
                </ScrollArea>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="font-serif text-sm leading-relaxed" style={{ color }}>{value}</p>
    </div>
  );
}
