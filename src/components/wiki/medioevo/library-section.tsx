"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, BookOpen, Clock, Hash, Check, Shuffle, Tag } from "lucide-react";
import { getBooks, getSearchIndex, type Book, type SectionId, type SearchEntry } from "@/lib/medioevo";
import { useReadingProgress } from "@/lib/reading-progress";
import { estimateReadingTime } from "@/lib/quotes";
import { TAG_META, getBookTags, type BookTag } from "@/lib/book-tags";
import { ReadingStatsPanel } from "./reading-stats";
import { QuotesPanel } from "./quote-dialog";
import { RecentBooksPanel } from "./recent-books-panel";

const CYCLES: { id: string; label: string; match?: (n: string) => boolean }[] = [
  { id: "all", label: "Todos" },
  { id: "core", label: "Núcleo 00–13", match: (n) => parseInt(n) <= 13 },
  { id: "ant", label: "Antología 14", match: (n) => n.startsWith("14") },
  { id: "mid", label: "Medios 15–27", match: (n) => { const i = parseInt(n); return i >= 15 && i <= 27; } },
  { id: "late", label: "Tardíos 28–34", match: (n) => { const i = parseInt(n); return i >= 28 && i <= 34; } },
  { id: "fusion", label: "Fusionados 35–40 + F1/F2", match: (n) => { const i = parseInt(n); return (i >= 35 && i <= 40) || n.startsWith("F"); } },
];

export function LibrarySection({ onNavigate, onOpenBook }: { onNavigate: (id: SectionId) => void; onOpenBook: (num: string, title: string, chapterIdx?: number) => void }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [q, setQ] = useState("");
  const [cycle, setCycle] = useState("all");
  const [activeTag, setActiveTag] = useState<BookTag | null>(null);
  const [loading, setLoading] = useState(true);
  const { getBookProgress } = useReadingProgress();
  const [searchIndex, setSearchIndex] = useState<SearchEntry[]>([]);

  useEffect(() => {
    getBooks().then((b) => { setBooks(b); setLoading(false); }).catch(() => setLoading(false));
    getSearchIndex().then(setSearchIndex).catch(() => {});
  }, []);

  // "Sorpréndeme" — open a random chapter from a random book
  const surpriseMe = useCallback(() => {
    if (searchIndex.length === 0) return;
    const entry = searchIndex[Math.floor(Math.random() * searchIndex.length)];
    onOpenBook(entry.book, entry.title, entry.ch);
  }, [searchIndex, onOpenBook]);

  const filtered = useMemo(() => {
    const cycleDef = CYCLES.find((c) => c.id === cycle)!;
    return books.filter((b) => {
      if (cycle !== "all" && cycleDef.match && !cycleDef.match(b.num)) return false;
      if (activeTag && !getBookTags(b.num).includes(activeTag)) return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        return b.title.toLowerCase().includes(s) || b.logline.toLowerCase().includes(s) || b.genre.toLowerCase().includes(s);
      }
      return true;
    });
  }, [books, q, cycle, activeTag]);

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">Biblioteca · 45 manuscritos</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">La Biblioteca Colapsada</h1>
            <p className="text-muted-foreground max-w-2xl font-serif italic">
              «No es un idioma: es una frecuencia codificada en escritura.» Cinco millones de palabras sobre existencia, flujo, trauma y restauración. Cada libro es un intento de medir la falla.
            </p>
          </div>
          <button
            onClick={surpriseMe}
            disabled={searchIndex.length === 0}
            className="group flex shrink-0 items-center gap-2 rounded-md border border-amber-glow/40 px-4 py-2.5 text-sm font-medium transition-all hover:translate-y-[-2px] disabled:opacity-40"
            style={{ borderColor: "oklch(0.74 0.13 75 / 0.4)", background: "oklch(0.74 0.13 75 / 0.08)", color: "var(--amber-glow)" }}
            title="Abrir un capítulo al azar del archivo"
          >
            <Shuffle className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
            <span className="hidden sm:inline">Sorpréndeme</span>
          </button>
        </div>
      </header>

      {/* Recently viewed books (quick access) */}
      <RecentBooksPanel onOpenBook={onOpenBook} />

      {/* Reading progress panel (only shows once user has started reading) */}
      <ReadingStatsPanel onOpenBook={onOpenBook} />

      {/* Saved quotes collection (only shows once user has saved quotes) */}
      <QuotesPanel onOpenBook={onOpenBook} />

      {/* Controls */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/40">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título, logline o género…"
              className="w-full rounded-md border border-border/60 bg-input/50 pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-glow/50 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {CYCLES.map((c) => (
              <button key={c.id} onClick={() => setCycle(c.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${cycle === c.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                style={cycle === c.id ? { background: "oklch(0.62 0.18 28 / 0.18)", border: "1px solid oklch(0.62 0.18 28 / 0.4)" } : { border: "1px solid var(--border)" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        {/* Thematic tag filter */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <Tag className="h-3 w-3 shrink-0 text-muted-foreground" />
          <button onClick={() => setActiveTag(null)}
            className="shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-mono transition-colors"
            style={!activeTag ? { background: "oklch(0.74 0.13 75 / 0.15)", borderColor: "oklch(0.74 0.13 75 / 0.4)", color: "var(--amber-glow)" } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
            Sin filtro
          </button>
          {(Object.keys(TAG_META) as BookTag[]).map((t) => {
            const meta = TAG_META[t];
            const count = books.filter((b) => getBookTags(b.num).includes(t)).length;
            if (count === 0) return null;
            const isActive = activeTag === t;
            return (
              <button key={t} onClick={() => setActiveTag(isActive ? null : t)}
                title={meta.desc}
                className="shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-mono transition-colors flex items-center gap-1"
                style={isActive ? { background: `${meta.color}1a`, borderColor: `${meta.color}66`, color: meta.color } : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                {meta.label}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground font-mono">{filtered.length} de {books.length} libros{activeTag ? ` · filtrado por ${TAG_META[activeTag].label}` : ""}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-md bg-card/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {filtered.map((b) => {
            const prog = getBookProgress(b.num);
            const isComplete = prog && prog.percent === 100;
            return (
            <button key={b.num} onClick={() => onOpenBook(b.num, b.title, prog?.lastChapter)}
              className="group text-left">
              <div className="book-cover relative aspect-[2/3] overflow-hidden rounded-md border border-border/50 bg-card">
                <img src={b.cover} alt={b.title} className="h-full w-full object-cover" loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/covers/placeholder.jpg"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute top-2 left-2 rounded px-1.5 py-0.5 font-mono text-[0.6rem] font-bold" style={{ background: "oklch(0.62 0.18 28 / 0.9)", color: "oklch(0.96 0.02 70)" }}>
                  {b.num}
                </div>
                {isComplete && (
                  <div className="absolute top-2 right-2 flex items-center justify-center h-5 w-5 rounded-full" style={{ background: "var(--canon)" }} title="Completado">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                {prog && !isComplete && prog.percent > 0 && (
                  <div className="absolute top-2 right-2 rounded px-1.5 py-0.5 font-mono text-[0.55rem] font-bold" style={{ background: "oklch(0.74 0.13 75 / 0.9)", color: "oklch(0.18 0.010 50)" }}>
                    {prog.percent}%
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-serif text-sm font-semibold leading-tight text-white drop-shadow line-clamp-3">{b.title}</h3>
                  <p className="mt-1 font-mono text-[0.6rem] text-white/70">{b.genre}</p>
                </div>
                {prog && !isComplete && prog.percent > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                    <div className="h-full" style={{ width: `${prog.percent}%`, background: "var(--amber-glow)" }} />
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[0.65rem] text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {b.chapterCount} cap.</span>
                <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {(b.wordCount / 1000).toFixed(0)}k</span>
                <span className="flex items-center gap-1" title="Tiempo de lectura estimado"><Clock className="h-3 w-3" /> {estimateReadingTime(b.wordCount).label}</span>
              </div>
            </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">El silencio como idioma. Ningún libro coincide.</p>
        </div>
      )}
    </div>
  );
}
