"use client";
import { useEffect, useMemo, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, BookOpen, FileText, Loader2, CornerDownLeft } from "lucide-react";
import { getSearchIndex, getBooks, normalizeSearch, type SearchEntry, type Book } from "@/lib/medioevo";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenBook: (bookNum: string, bookTitle: string, chapterIdx?: number) => void;
}

export function GlobalSearch({ open, onOpenChange, onOpenBook }: GlobalSearchProps) {
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || index.length > 0) return;
    let cancelled = false;
    // Defer the loading flag toggle to avoid synchronous setState in effect
    Promise.resolve().then(() => { if (!cancelled) setLoading(true); });
    Promise.all([getSearchIndex(), getBooks()])
      .then(([idx, bks]) => {
        if (cancelled) return;
        setIndex(idx);
        setBooks(bks);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, index.length]);

  // Reset query when dialog closes (via callback, not effect)
  const handleOpenChange = (v: boolean) => {
    if (!v) setQ("");
    onOpenChange(v);
  };

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const nq = normalizeSearch(q);
    const bookMatches = books
      .filter((b) => normalizeSearch(b.title).includes(nq) || normalizeSearch(b.logline).includes(nq))
      .slice(0, 5)
      .map((b) => ({ type: "book" as const, book: b, score: 100 }));

    const chMatches: { type: "chapter"; entry: SearchEntry; score: number }[] = [];
    for (const e of index) {
      const titleMatch = normalizeSearch(e.chTitle).includes(nq);
      const snippetMatch = normalizeSearch(e.snippet).includes(nq);
      if (titleMatch || snippetMatch) {
        chMatches.push({
          type: "chapter",
          entry: e,
          score: (titleMatch ? 50 : 0) + (snippetMatch ? 10 : 0) + (e.title.toLowerCase().includes(nq) ? 5 : 0),
        });
      }
    }
    chMatches.sort((a, b) => b.score - a.score);
    return [...bookMatches, ...chMatches.slice(0, 30)];
  }, [q, index, books]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-2xl" style={{ background: "oklch(0.16 0.010 50)" }}>
        <DialogTitle className="sr-only">Búsqueda global en el archivo MEDIOEVO</DialogTitle>
        <Command shouldFilter={false} className="bg-transparent">
          <div className="flex items-center border-b border-border/40 px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandInput
              value={q}
              onValueChange={setQ}
              placeholder="Buscar en 5,620 capítulos de 45 libros…  (ej: ARCHON, Don Humo, Teyolía, 432 Hz)"
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground font-serif"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <CommandList className="max-h-[420px] overflow-y-auto">
            <CommandEmpty className="py-8 text-center text-sm text-muted-foreground font-serif italic">
              {q.length < 2 ? "Escribe al menos 2 caracteres…" : "El silencio como idioma. Sin coincidencias."}
            </CommandEmpty>

            {results.some((r) => r.type === "book") && (
              <CommandGroup heading="Libros" className="text-muted-foreground">
                {results.filter((r) => r.type === "book").map((r) => (
                  <CommandItem
                    key={`b-${r.book.num}`}
                    onSelect={() => { onOpenBook(r.book.num, r.book.title); onOpenChange(false); }}
                    className="cursor-pointer py-2.5 px-3 hover:bg-sidebar-accent rounded-md flex items-start gap-3"
                  >
                    <BookOpen className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--amber-glow)" }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded" style={{ background: "oklch(0.62 0.18 28 / 0.18)", color: "var(--amber-glow)" }}>{r.book.num}</code>
                        <span className="font-serif text-sm font-semibold truncate">{r.book.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate font-serif italic mt-0.5">{r.book.logline}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {results.some((r) => r.type === "chapter") && (
              <CommandGroup heading={`Capítulos · ${results.filter((r) => r.type === "chapter").length}`} className="text-muted-foreground">
                {results.filter((r) => r.type === "chapter").map((r, i) => {
                  const e = r.entry;
                  return (
                    <CommandItem
                      key={`c-${i}`}
                      onSelect={() => { onOpenBook(e.book, e.title, e.ch); onOpenChange(false); }}
                      className="cursor-pointer py-2.5 px-3 hover:bg-sidebar-accent rounded-md flex items-start gap-3"
                    >
                      <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <code className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded" style={{ background: "oklch(0.62 0.18 28 / 0.18)", color: "var(--amber-glow)" }}>{e.book}</code>
                          <span className="text-[0.65rem] text-muted-foreground truncate">{e.title}</span>
                        </div>
                        <span className="font-serif text-sm font-medium block truncate">{e.chTitle}</span>
                        <HighlightSnippet snippet={e.snippet} query={q} />
                      </div>
                      <CornerDownLeft className="h-3 w-3 shrink-0 text-muted-foreground/40 mt-1" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
          <div className="border-t border-border/40 px-3 py-2 flex items-center justify-between text-[0.6rem] font-mono text-muted-foreground">
            <span>{index.length.toLocaleString()} entradas indexadas · 5.1M palabras</span>
            <span className="flex items-center gap-2">
              <kbd className="rounded border border-border/60 px-1.5 py-0.5">↑↓</kbd> navegar
              <kbd className="rounded border border-border/60 px-1.5 py-0.5">↵</kbd> abrir
              <kbd className="rounded border border-border/60 px-1.5 py-0.5">esc</kbd> cerrar
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function HighlightSnippet({ snippet, query }: { snippet: string; query: string }) {
  if (!query.trim()) return <p className="text-xs text-muted-foreground/70 font-serif italic mt-0.5 line-clamp-2">{snippet}</p>;
  const nq = normalizeSearch(query);
  const ns = normalizeSearch(snippet);
  const idx = ns.indexOf(nq);
  if (idx === -1) return <p className="text-xs text-muted-foreground/70 font-serif italic mt-0.5 line-clamp-2">{snippet.slice(0, 160)}</p>;
  const start = Math.max(0, idx - 60);
  const end = Math.min(snippet.length, idx + query.length + 80);
  const before = snippet.slice(start, idx);
  const match = snippet.slice(idx, idx + query.length);
  const after = snippet.slice(idx + query.length, end);
  return (
    <p className="text-xs text-muted-foreground/70 font-serif italic mt-0.5 line-clamp-2">
      {start > 0 ? "…" : ""}{before}
      <mark style={{ background: "oklch(0.74 0.13 75 / 0.35)", color: "var(--amber-glow)", padding: "0 2px", borderRadius: "2px" }}>{match}</mark>
      {after}{end < snippet.length ? "…" : ""}
    </p>
  );
}
