"use client";
import { type SectionId } from "./nav";
import { SAGA_STATS } from "@/lib/medioevo";

const FREQS = [
  { hz: "0.12", desc: "TAAT supresión" },
  { hz: "7.83", desc: "Schumann" },
  { hz: "37", desc: "Astral" },
  { hz: "55", desc: "Sanguisburg" },
  { hz: "432", desc: "Jardineros" },
  { hz: "847", desc: "División 47" },
  { hz: "963", desc: "Jardín adv." },
];

export function Footer({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <footer className="mt-auto border-t border-border/40 bg-sidebar/30 relative overflow-hidden">
      {/* Frequency spectrum strip */}
      <div className="border-b border-border/30 bg-background/40">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground/70 shrink-0">Espectro de frecuencias</p>
            <div className="flex items-end gap-1.5 flex-1 justify-end min-w-0">
              {FREQS.map((f, i) => (
                <div key={f.hz} className="flex flex-col items-center gap-0.5 shrink-0" title={`${f.hz} Hz · ${f.desc}`}>
                  <span className="freq-pulse block rounded-sm" style={{ height: `${8 + i * 3}px`, width: "3px", background: i % 2 === 0 ? "var(--amber-glow)" : "var(--oxblood)", opacity: 0.6 }} />
                  <span className="font-mono text-[0.5rem] text-muted-foreground/60">{f.hz}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-oxblood/50 font-serif text-base font-bold" style={{ color: "var(--amber-glow)", background: "oklch(0.62 0.18 28 / 0.12)" }}>χ</span>
              <span className="font-serif text-lg font-semibold title-shimmer">MEDIOEVO</span>
            </div>
            <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">
              «Primera entrada: 7,692 años.» El Archivo canónico. Una sola falla en el flujo de comunicación.
            </p>
            <p className="mt-3 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground/50">
              El que observa vive · <span style={{ color: "var(--amber-glow)" }}>In tlachixtiani nemi</span>
            </p>
          </div>

          {/* El Archivo */}
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">El Archivo</p>
            <ul className="space-y-1.5 text-sm">
              {[
                { id: "biblioteca" as const, l: "Biblioteca (45 libros)" },
                { id: "personajes" as const, l: "Grimorio de personajes" },
                { id: "glosario" as const, l: "Glosario del Flujo" },
                { id: "mundo" as const, l: "Mundo · 3 planos · mapas" },
              ].map((x) => (
                <li key={x.id}>
                  <button onClick={() => onNavigate(x.id)} className="text-muted-foreground hover:text-amber-glow transition-colors text-left">
                    {x.l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Conocimiento */}
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">Conocimiento</p>
            <ul className="space-y-1.5 text-sm">
              {[
                { id: "filosofia" as const, l: "Filosofía del Flujo" },
                { id: "cronologia" as const, l: "Cronología · 7,692 años" },
                { id: "atlas" as const, l: "Atlas · tech · frecuencias" },
                { id: "factcheck" as const, l: "Verificador epistémico OSIT" },
                { id: "autor" as const, l: "El Autor · Tyr" },
              ].map((x) => (
                <li key={x.id}>
                  <button onClick={() => onNavigate(x.id)} className="text-muted-foreground hover:text-amber-glow transition-colors text-left">
                    {x.l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Constantes */}
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">Constantes canónicas</p>
            <div className="space-y-2 text-xs font-mono text-muted-foreground">
              <div className="flex items-baseline gap-2">
                <code style={{ color: "var(--amber-glow)" }}>χ·e^χ=1</code>
                <span className="text-[0.6rem] opacity-70">Lambert W · 0.567143</span>
              </div>
              <div className="flex items-baseline gap-2">
                <code style={{ color: "var(--oxblood)" }}>7,692</code>
                <span className="text-[0.6rem] opacity-70">= 12 × 641 (primo)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <code style={{ color: "var(--canon)" }}>847</code>
                <span className="text-[0.6rem] opacity-70">torres TAAT · División 47</span>
              </div>
              <div className="pt-2 mt-2 border-t border-border/20 text-[0.6rem] space-y-0.5">
                <p>{SAGA_STATS.books} libros · {SAGA_STATS.chapters} capítulos</p>
                <p>5.1M palabras · {SAGA_STATS.maps} mapas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-serif italic">
            Saga MEDIOEVO · de Luis Rene Gonzalez Lopez (Tyr / Claudio Cobain)
          </p>
          <div className="flex items-center gap-3 text-[0.6rem] font-mono text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <span className="freq-pulse h-1.5 w-1.5 rounded-full" style={{ background: "var(--canon)" }} />
              CANON
            </span>
            <span className="flex items-center gap-1">
              <span className="freq-pulse h-1.5 w-1.5 rounded-full" style={{ background: "var(--inferido)", animationDelay: "0.5s" }} />
              INFERENCIA
            </span>
            <span className="flex items-center gap-1">
              <span className="freq-pulse h-1.5 w-1.5 rounded-full" style={{ background: "var(--incognita)", animationDelay: "1s" }} />
              INCÓGNITA
            </span>
            <span className="flex items-center gap-1">
              <span className="freq-pulse h-1.5 w-1.5 rounded-full" style={{ background: "var(--bloqueo)", animationDelay: "1.5s" }} />
              BLOQUEO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
