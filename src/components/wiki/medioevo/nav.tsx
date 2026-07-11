"use client";
import { BookOpen, Users, Globe2, Sword, Clock, Atom, Scale, ShieldCheck, Home, Map as MapIcon, Search, Keyboard, BookText, FlaskConical, Radio, Cpu, Images, Gauge, Network, GitCompare, Sparkles, CalendarRange } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export type SectionId =
  | "inicio" | "biblioteca" | "lector" | "personajes" | "grafo" | "comparador"
  | "mundo" | "planosmapa" | "facciones" | "cronologiaviz" | "cronologia"
  | "atlas" | "filosofia" | "residuo" | "ciencia" | "ecosistema" | "pulsera"
  | "oraculo" | "factcheck" | "glosario" | "galeria" | "autor";

export const SECTIONS: { id: SectionId; label: string; sub: string; icon: typeof Home }[] = [
  { id: "inicio", label: "Inicio", sub: "Tesis del Flujo", icon: Home },
  { id: "biblioteca", label: "Biblioteca", sub: "45 libros · 5.1M palabras", icon: BookOpen },
  { id: "personajes", label: "Personajes", sub: "Grimorio", icon: Users },
  { id: "grafo", label: "Red", sub: "Grafo de relaciones", icon: Network },
  { id: "comparador", label: "Comparador", sub: "Compara personajes", icon: GitCompare },
  { id: "mundo", label: "Mundo", sub: "3 planos · ciudades · mapas", icon: Globe2 },
  { id: "planosmapa", label: "Planos", sub: "Mapa interactivo Lambert W", icon: Atom },
  { id: "facciones", label: "Facciones", sub: "7 tribus punk · astrales · Geodia", icon: Sword },
  { id: "cronologiaviz", label: "Línea Visual", sub: "Timeline interactivo", icon: CalendarRange },
  { id: "cronologia", label: "Cronología", sub: "7,692 años", icon: Clock },
  { id: "atlas", label: "Atlas", sub: "Tech · artefactos · frecuencias", icon: Atom },
  { id: "filosofia", label: "Filosofía", sub: "OSIT · MOI · Tesis del Flujo", icon: Scale },
  { id: "residuo", label: "Residuo R", sub: "Calculadora OSIT", icon: Gauge },
  { id: "ciencia", label: "Ciencia", sub: "Análisis honesto · sin humo", icon: FlaskConical },
  { id: "ecosistema", label: "Ecosistema IA", sub: "DUAT · Wabi-Sabi · Vibe Forge", icon: Cpu },
  { id: "pulsera", label: "Pulsera Virtual", sub: "Habla con los personajes", icon: Radio },
  { id: "oraculo", label: "Oráculo", sub: "Citas aleatorias del flujo", icon: Sparkles },
  { id: "galeria", label: "Galería", sub: "Universo visual hibrido", icon: Images },
  { id: "glosario", label: "Glosario", sub: "Términos canónicos", icon: BookText },
  { id: "factcheck", label: "Fact Check", sub: "Verificador OSIT", icon: ShieldCheck },
  { id: "autor", label: "El Autor", sub: "Tyr · Claudio Cobain", icon: MapIcon },
];

interface NavProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function RailNav({ active, onNavigate }: NavProps) {
  return (
    <nav className="hidden md:flex flex-col gap-1 w-14 shrink-0 border-r border-border/40 py-4 sticky top-0 h-screen">
      {SECTIONS.map((s) => {
        const Icon = s.icon;
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            aria-current={isActive}
            onClick={() => onNavigate(s.id)}
            title={`${s.label} — ${s.sub}`}
            className="rail-item group relative mx-2 flex h-11 w-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
            {isActive && (
              <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-0.5 rounded-r" style={{ background: "var(--amber-glow)" }} />
            )}
            <span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-md border border-border/60 bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg group-hover:block">
              <span className="font-medium">{s.label}</span>
              <span className="ml-1.5 text-muted-foreground">· {s.sub}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function TopBar({ onNavigate, active, onOpenSearch }: { onNavigate: (id: SectionId) => void; active: SectionId; onOpenSearch: () => void }) {
  const current = SECTIONS.find((s) => s.id === active);
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <button onClick={() => onNavigate("inicio")} className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-oxblood/50 font-serif text-lg font-bold" style={{ color: "var(--amber-glow)", background: "oklch(0.62 0.18 28 / 0.12)" }}>
            χ
          </span>
          <span className="font-serif text-lg font-semibold tracking-wide title-shimmer hidden sm:inline">MEDIOEVO</span>
          <span className="hidden lg:inline text-[0.65rem] font-mono uppercase tracking-[0.2em] text-muted-foreground">El Archivo</span>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 rounded-md border border-border/50 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-amber-glow/40 transition-colors min-w-[210px]"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="font-serif italic">Buscar en el archivo…</span>
            <kbd className="ml-auto rounded border border-border/60 px-1.5 py-0.5 font-mono text-[0.6rem]">⌘K</kbd>
          </button>
          <button
            onClick={onOpenSearch}
            className="sm:hidden flex items-center justify-center rounded-md border border-border/50 p-2 text-muted-foreground hover:text-foreground"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
          <span className="hidden md:flex items-center gap-1.5 text-[0.7rem] font-mono text-muted-foreground">
            <span className="freq-pulse h-1.5 w-1.5 rounded-full" style={{ background: "var(--canon)" }} />
            <span>{current?.label}</span>
          </span>
          <ThemeToggle />
          <button
            onClick={() => onNavigate("factcheck")}
            className="flex items-center gap-1.5 rounded-md border border-amber-glow/40 px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ borderColor: "oklch(0.74 0.13 75 / 0.4)", background: "oklch(0.74 0.13 75 / 0.1)", color: "var(--amber-glow)" }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Fact Check OSIT</span>
          </button>
        </div>
      </div>
      <div className="md:hidden flex gap-1 overflow-x-auto px-3 pb-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs ${active === s.id ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </header>
  );
}
