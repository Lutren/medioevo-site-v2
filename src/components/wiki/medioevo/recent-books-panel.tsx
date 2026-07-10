"use client";
import { useRecentBooks } from "@/lib/recent-books";
import { History, ChevronRight } from "lucide-react";

export function RecentBooksPanel({ onOpenBook }: { onOpenBook: (num: string, title: string, chapterIdx?: number) => void }) {
  const { recent } = useRecentBooks();

  if (recent.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <History className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          Visto recientemente · {recent.length}
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {recent.map((r) => (
          <button
            key={r.num + r.openedAt}
            onClick={() => onOpenBook(r.num, r.title, r.chapterIdx)}
            className="group flex shrink-0 items-center gap-2 rounded-md border border-border/40 bg-card/30 px-3 py-2 hover:border-amber-glow/40 hover:bg-card/50 transition-colors"
          >
            <code className="font-mono text-[0.6rem] shrink-0" style={{ color: "var(--amber-glow)" }}>{r.num}</code>
            <span className="font-serif text-xs truncate max-w-[140px]">{r.title}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-amber-glow transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
