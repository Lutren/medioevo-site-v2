"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ChevronLeft, ChevronRight, List, X, Type, BookMarked, Maximize2, Minimize2, Check, BookmarkCheck, Bookmark, Clock } from "lucide-react";
import { getBook, type BookFull, type Chapter } from "@/lib/medioevo";
import { useReadingProgress } from "@/lib/reading-progress";
import { useQuotes, estimateReadingTime } from "@/lib/quotes";
import { QuoteDialog } from "./quote-dialog";

export function BookReader({ bookNum, bookTitle, onBack, initialChapter }: { bookNum: string; bookTitle: string; onBack: () => void; initialChapter?: number }) {
  const [book, setBook] = useState<BookFull | null>(null);
  const [chIdx, setChIdx] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [progress, setProgress] = useState(0);
  const [immersive, setImmersive] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const loadedNumRef = useRef<string>("");
  const { updateProgress, markChapterComplete, isChapterComplete, getBookProgress } = useReadingProgress();
  const { hasQuoteForChapter, quotes } = useQuotes();
  const bookProg = getBookProgress(bookNum);

  // Fetch book when bookNum changes — setState happens only in async callback
  useEffect(() => {
    if (loadedNumRef.current === bookNum) return;
    loadedNumRef.current = bookNum;
    let cancelled = false;
    getBook(bookNum).then((b) => {
      if (cancelled) return;
      setBook(b);
      // Determine starting chapter: explicit initialChapter > saved progress > 0
      let target = 0;
      if (typeof initialChapter === "number" && initialChapter >= 0 && initialChapter < b.chapters.length) {
        target = initialChapter;
      } else {
        const saved = getBookProgress(bookNum);
        if (saved && saved.lastChapter < b.chapters.length) target = saved.lastChapter;
      }
      setChIdx(target);
      // record that we opened this book at this chapter
      updateProgress(bookNum, bookTitle, target, b.chapters.length);
    }).catch(() => { if (!cancelled) setBook(null); });
    return () => { cancelled = true; };
  }, [bookNum, initialChapter, bookTitle, updateProgress, getBookProgress]);

  const ch: Chapter | undefined = book?.chapters[chIdx];

  // Reading time for current chapter (~200 wpm literary Spanish)
  const readingTime = useMemo(() => {
    const wc = ch?.body.split(/\s+/).filter(Boolean).length || 0;
    return estimateReadingTime(wc);
  }, [ch]);

  // scroll to top on chapter change + save progress
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    if (book) {
      updateProgress(bookNum, bookTitle, chIdx, book.chapters.length);
    }
  }, [chIdx, bookNum, book, bookTitle, updateProgress]);

  const goToChapter = useCallback((i: number) => {
    setChIdx(i);
    setProgress(0);
  }, []);

  const markCurrentComplete = useCallback(() => {
    markChapterComplete(bookNum, chIdx);
  }, [markChapterComplete, bookNum, chIdx]);

  // reading progress
  const onScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
  }, []);

  // keyboard nav within reader: j/k or ←/→ for chapters, f for font, i for immersive
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (!book) return;
      if (e.key === "ArrowRight" || e.key === "j") {
        if (chIdx < book.chapters.length - 1) { e.preventDefault(); goToChapter(chIdx + 1); }
      } else if (e.key === "ArrowLeft" || e.key === "k") {
        if (chIdx > 0) { e.preventDefault(); goToChapter(chIdx - 1); }
      } else if (e.key === "i") {
        e.preventDefault(); setImmersive((v) => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [book, chIdx, goToChapter]);

  if (!book) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-amber-glow/30 border-t-amber-glow animate-spin" style={{ borderTopColor: "var(--amber-glow)" }} />
          <p className="mt-4 font-mono text-xs text-muted-foreground">Cargando manuscrito…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* TOC sidebar */}
      <aside className={`${tocOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-40 w-72 h-full border-r border-border/40 bg-sidebar/95 backdrop-blur-xl transition-transform overflow-y-auto`}>
        <div className="sticky top-0 bg-sidebar/95 backdrop-blur px-4 py-3 border-b border-border/40 flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">Manuscrito {bookNum}</p>
            <h2 className="font-serif text-sm font-semibold leading-tight line-clamp-2">{bookTitle}</h2>
            {bookProg && bookProg.completedCount > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${bookProg.percent}%`, background: "linear-gradient(90deg, var(--oxblood), var(--amber-glow))" }} />
                </div>
                <span className="font-mono text-[0.55rem] text-muted-foreground">{bookProg.percent}%</span>
              </div>
            )}
          </div>
          <button onClick={() => setTocOpen(false)} className="md:hidden text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <nav className="p-2">
          <p className="px-2 py-1.5 text-[0.65rem] font-mono uppercase tracking-wider text-muted-foreground">Índice · {book.chapters.length} entradas</p>
          {book.chapters.map((c, i) => {
            const done = isChapterComplete(bookNum, i);
            const isCurrent = i === chIdx;
            return (
              <button key={i} onClick={() => { goToChapter(i); setTocOpen(false); }}
                className={`w-full text-left px-2.5 py-2 rounded text-sm transition-colors flex items-center gap-2 ${isCurrent ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"}`}
                style={isCurrent ? { background: "oklch(0.62 0.18 28 / 0.15)", borderLeft: "2px solid var(--amber-glow)" } : {}}>
                <span className="font-mono text-[0.6rem] text-muted-foreground/70 shrink-0">{String(i + 1).padStart(3, "0")}</span>
                <span className="font-serif line-clamp-1 flex-1">{c.title}</span>
                {done && <Check className="h-3 w-3 shrink-0" style={{ color: "var(--canon)" }} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {tocOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setTocOpen(false)} />}

      {/* Reading area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* toolbar — hidden in immersive mode (toggle with 'i') */}
        {!immersive && (
        <div className="border-b border-border/40 px-4 py-2.5 flex items-center gap-2 bg-background/80 backdrop-blur sticky top-0 z-20">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Biblioteca</span>
          </button>
          <button onClick={() => setTocOpen(true)} className="md:hidden flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            <List className="h-3.5 w-3.5" /> Índice
          </button>
          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 rounded-md" style={{ background: "oklch(0.62 0.18 28 / 0.1)" }}>
            <code className="font-mono text-[0.6rem]" style={{ color: "var(--amber-glow)" }}>{bookNum}</code>
            <span className="font-serif text-xs text-muted-foreground truncate max-w-[160px]">{bookTitle}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setQuoteOpen(true)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors relative"
              style={hasQuoteForChapter(bookNum, chIdx)
                ? { background: "oklch(0.74 0.13 75 / 0.12)", color: "var(--amber-glow)", border: "1px solid oklch(0.74 0.13 75 / 0.4)" }
                : { color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
              title="Guardar pasaje de este capítulo">
              <Bookmark className="h-3.5 w-3.5" />
              {hasQuoteForChapter(bookNum, chIdx) && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[0.5rem] font-mono font-bold" style={{ background: "var(--amber-glow)", color: "oklch(0.18 0.010 50)" }}>
                  {quotes.filter((q) => q.bookNum === bookNum && q.chapterIdx === chIdx).length}
                </span>
              )}
            </button>
            <button onClick={markCurrentComplete}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors"
              style={isChapterComplete(bookNum, chIdx)
                ? { background: "oklch(0.72 0.14 145 / 0.15)", color: "var(--canon)", border: "1px solid oklch(0.72 0.14 145 / 0.4)" }
                : { color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
              title={isChapterComplete(bookNum, chIdx) ? "Capítulo leído" : "Marcar como leído"}>
              {isChapterComplete(bookNum, chIdx) ? <Check className="h-3.5 w-3.5" /> : <BookmarkCheck className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isChapterComplete(bookNum, chIdx) ? "Leído" : "Marcar"}</span>
            </button>
            <div className="w-px h-5 bg-border/40 mx-0.5" />
            <button onClick={() => setFontScale((s) => Math.max(0.85, s - 0.1))} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent" title="Reducir texto">
              <Type className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[0.65rem] text-muted-foreground w-8 text-center">{fontScale.toFixed(2)}×</span>
            <button onClick={() => setFontScale((s) => Math.min(1.4, s + 0.1))} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent" title="Aumentar texto">
              <Type className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border/40 mx-1" />
            <button onClick={() => setImmersive(true)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent" title="Modo inmersivo (i)">
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        )}
        {immersive && (
          <button onClick={() => setImmersive(false)} className="fixed top-3 right-3 z-30 rounded-md border border-border/50 bg-background/80 p-2 text-muted-foreground hover:text-foreground backdrop-blur" title="Salir del modo inmersivo (i)">
            <Minimize2 className="h-4 w-4" />
          </button>
        )}

        {/* progress bar */}
        <div className="h-0.5 bg-border/30">
          <div className="h-full transition-all" style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, var(--oxblood), var(--amber-glow))" }} />
        </div>

        {/* chapter content */}
        <div ref={contentRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
          <article className="mx-auto max-w-3xl px-5 md:px-8 py-10">
            {/* chapter header */}
            <div className="mb-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-[0.65rem] font-mono text-muted-foreground mb-3" aria-label="Breadcrumb">
                <button onClick={onBack} className="hover:text-amber-glow transition-colors" style={{ color: undefined }}>Archivo</button>
                <ChevronRight className="h-3 w-3 opacity-50" />
                <button onClick={onBack} className="hover:text-amber-glow transition-colors">Biblioteca</button>
                <ChevronRight className="h-3 w-3 opacity-50" />
                <span style={{ color: "var(--amber-glow)" }}>{bookNum}</span>
                <ChevronRight className="h-3 w-3 opacity-50" />
                <span className="text-muted-foreground/70 truncate max-w-[200px]">{bookTitle}</span>
              </nav>
              <div className="flex items-center gap-3 text-[0.65rem] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <BookMarked className="h-3 w-3" style={{ color: "var(--amber-glow)" }} />
                  Entrada {String(chIdx + 1).padStart(3, "0")} de {String(book.chapters.length).padStart(3, "0")}
                </span>
                <span className="flex items-center gap-1 opacity-70">
                  <Clock className="h-3 w-3" />
                  {readingTime.label} de lectura
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--foreground)" }}>{ch?.title}</h1>
              <div className="divider-chi max-w-xs">χ</div>
            </div>

            {/* markdown body */}
            <div className="prose-medioevo" style={{ fontSize: `${1.125 * fontScale}rem` }}>
              <MarkdownRenderer text={ch?.body || ""} />
            </div>

            {/* chapter nav */}
            <div className="mt-16 pt-6 border-t border-border/40 flex items-center justify-between gap-3">
              <button disabled={chIdx === 0} onClick={() => goToChapter(Math.max(0, chIdx - 1))}
                className="flex items-center gap-2 rounded-md border border-border/60 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Anterior</span>
              </button>
              <span className="font-mono text-[0.65rem] text-muted-foreground">{chIdx + 1} / {book.chapters.length}</span>
              <button disabled={chIdx >= book.chapters.length - 1} onClick={() => goToChapter(Math.min(book.chapters.length - 1, chIdx + 1))}
                className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--oxblood)", color: "oklch(0.96 0.02 70)" }}>
                <span className="hidden sm:inline">Siguiente</span> <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </div>
      <QuoteDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        bookNum={bookNum}
        bookTitle={bookTitle}
        chapterIdx={chIdx}
        chapterTitle={ch?.title || ""}
      />
    </div>
  );
}

// Lightweight markdown renderer tuned for MEDIOEVO manuscripts.
// Applies a drop-cap to the first paragraph of each chapter for literary feel.
function MarkdownRenderer({ text }: { text: string }) {
  const firstParaRef = useRef(true);
  // reset on text change
  useEffect(() => { firstParaRef.current = true; }, [text]);
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h2>{children}</h2>,
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <h3>{children}</h3>,
        p: ({ children, ...props }) => {
          const dropCap = firstParaRef.current;
          firstParaRef.current = false;
          return <p className={dropCap ? "drop-cap" : ""} {...props}>{children}</p>;
        },
        hr: () => <hr />,
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ className, children, ...props }) => <code className={className} {...props}>{children}</code>,
        a: ({ href, children }) => <a href={href} className="underline decoration-dotted hover:text-amber-glow" style={{ color: "var(--amber-glow)" }} target="_blank" rel="noreferrer">{children}</a>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-foreground/85">{children}</li>,
        table: ({ children }) => <table className="my-4 w-full border-collapse text-sm">{children}</table>,
        th: ({ children }) => <th className="border border-border/50 px-3 py-1.5 text-left font-semibold bg-card/50">{children}</th>,
        td: ({ children }) => <td className="border border-border/50 px-3 py-1.5">{children}</td>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
