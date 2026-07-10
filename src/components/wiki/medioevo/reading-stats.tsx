"use client";
import { useReadingProgress } from "@/lib/reading-progress";
import { getBooks, type Book } from "@/lib/medioevo";
import { useEffect, useState, useMemo } from "react";
import { BookOpen, CheckCircle2, Clock, TrendingUp, RotateCcw, ChevronRight, BarChart3 } from "lucide-react";

interface ReadingStatsPanelProps {
  onOpenBook?: (num: string, title: string, chapterIdx?: number) => void;
}

export function ReadingStatsPanel({ onOpenBook }: ReadingStatsPanelProps) {
  const { state, stats, getBookProgress, resetAll } = useReadingProgress();
  const [books, setBooks] = useState<Book[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    getBooks().then(setBooks).catch(() => {});
  }, []);

  const inProgress = Object.entries(state.books)
    .map(([num, b]) => ({ num, ...b, prog: getBookProgress(num) }))
    .filter((b) => b.prog && b.prog.percent < 100)
    .sort((a, b) => (b.prog?.lastChapter || 0) - (a.prog?.lastChapter || 0))
    .slice(0, 5);

  // All started books with progress for the chart
  const allStarted = useMemo(() => {
    return Object.entries(state.books)
      .map(([num, b]) => {
        const bookMeta = books.find((bk) => bk.num === num);
        return {
          num,
          title: b.title,
          prog: getBookProgress(num),
          totalChapters: b.totalChapters,
          cover: bookMeta?.cover,
        };
      })
      .sort((a, b) => (b.prog?.percent || 0) - (a.prog?.percent || 0));
  }, [state.books, books, getBookProgress]);

  const totalSagaChapters = 4512;
  const sagaPercent = Math.round((stats.completedChapters / totalSagaChapters) * 100);

  if (stats.startedCount === 0) {
    return null;
  }

  return (
    <div className="card-archive p-5 md:p-6 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 glitch-lines opacity-20 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
            <h2 className="font-serif text-lg font-semibold">Tu progreso de lectura</h2>
          </div>
          <div className="flex items-center gap-2">
            {allStarted.length > 1 && (
              <button onClick={() => setShowChart((v) => !v)}
                className="flex items-center gap-1 text-[0.65rem] font-mono text-muted-foreground hover:text-amber-glow transition-colors"
                style={{ color: showChart ? "var(--amber-glow)" : undefined }}>
                <BarChart3 className="h-3 w-3" />
                {showChart ? "Ocultar gráfico" : "Ver gráfico"}
              </button>
            )}
            <button
              onClick={() => confirmReset ? resetAll() : setConfirmReset(true)}
              onBlur={() => setConfirmReset(false)}
              className="flex items-center gap-1 text-[0.65rem] font-mono text-muted-foreground hover:text-bloqueo transition-colors"
              style={{ color: confirmReset ? "var(--bloqueo)" : undefined }}
            >
              <RotateCcw className="h-3 w-3" />
              {confirmReset ? "¿Confirmar?" : "Reiniciar"}
            </button>
          </div>
        </div>

        {/* Saga progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">Saga completa · {sagaPercent}%</span>
            <span className="font-mono text-[0.65rem] text-muted-foreground">{stats.completedChapters} / {totalSagaChapters} capítulos</span>
          </div>
          <div className="h-2 rounded-full bg-border/40 overflow-hidden">
            <div className="h-full transition-all duration-500" style={{ width: `${sagaPercent}%`, background: "linear-gradient(90deg, var(--oxblood), var(--amber-glow))" }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard icon={BookOpen} value={stats.startedCount} label="empezados" color="var(--amber-glow)" />
          <StatCard icon={CheckCircle2} value={stats.completedBooks} label="completados" color="var(--canon)" />
          <StatCard icon={Clock} value={stats.completedChapters} label="capítulos leídos" color="var(--oxblood)" />
        </div>

        {/* Detailed chart — bar chart of all started books */}
        {showChart && allStarted.length > 0 && (
          <div className="mb-5 p-4 rounded-md border border-border/40 bg-card/20">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-3">Progreso por libro · {allStarted.length} libros</p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {allStarted.map((b) => {
                const pct = b.prog?.percent || 0;
                const isComplete = pct === 100;
                return (
                  <button key={b.num} onClick={() => onOpenBook?.(b.num, b.title, b.prog?.lastChapter)}
                    disabled={!onOpenBook}
                    className="group w-full flex items-center gap-2 text-left disabled:cursor-default">
                    <code className="font-mono text-[0.55rem] w-8 shrink-0 text-right" style={{ color: "var(--amber-glow)" }}>{b.num}</code>
                    <span className="font-serif text-xs truncate w-28 shrink-0 text-muted-foreground">{b.title}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-border/30 overflow-hidden relative">
                      <div className="h-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: isComplete ? "var(--canon)" : "linear-gradient(90deg, var(--oxblood), var(--amber-glow))",
                        }} />
                    </div>
                    <span className="font-mono text-[0.55rem] w-10 shrink-0 text-right" style={{ color: isComplete ? "var(--canon)" : "var(--muted-foreground)" }}>
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue reading */}
        {inProgress.length > 0 && (
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground mb-2">Continuar leyendo</p>
            <div className="space-y-1.5">
              {inProgress.map((b) => (
                <button
                  key={b.num}
                  onClick={() => onOpenBook?.(b.num, b.title, b.prog?.lastChapter)}
                  disabled={!onOpenBook}
                  className="group w-full flex items-center gap-3 rounded-md border border-border/40 bg-card/30 px-3 py-2 hover:border-amber-glow/40 hover:bg-card/50 transition-colors disabled:cursor-default"
                >
                  <code className="font-mono text-[0.6rem] shrink-0" style={{ color: "var(--amber-glow)" }}>{b.num}</code>
                  <span className="font-serif text-sm truncate flex-1 text-left">{b.title}</span>
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <div className="w-20 h-1 rounded-full bg-border/40 overflow-hidden">
                      <div className="h-full" style={{ width: `${b.prog?.percent || 0}%`, background: "var(--amber-glow)" }} />
                    </div>
                    <span className="font-mono text-[0.6rem] text-muted-foreground w-8">{b.prog?.percent || 0}%</span>
                  </div>
                  <span className="font-mono text-[0.55rem] text-muted-foreground shrink-0">cap. {((b.prog?.lastChapter || 0) + 1)}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-amber-glow transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof BookOpen; value: number; label: string; color: string }) {
  return (
    <div className="rounded-md border border-border/40 bg-card/20 px-3 py-2.5 text-center">
      <Icon className="h-3.5 w-3.5 mx-auto mb-1" style={{ color }} />
      <div className="font-serif text-xl font-bold" style={{ color }}>{value}</div>
      <div className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
