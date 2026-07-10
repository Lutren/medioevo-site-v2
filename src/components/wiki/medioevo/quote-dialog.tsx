"use client";
import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Bookmark, Check, Trash2, Quote as QuoteIcon, ExternalLink, Download } from "lucide-react";
import { useQuotes, type Quote } from "@/lib/quotes";
import { EPISTEMIC_META } from "@/lib/medioevo";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bookNum: string;
  bookTitle: string;
  chapterIdx: number;
  chapterTitle: string;
}

const TAGS: Quote["tag"][] = ["OBSERVACION", "CANON", "INFERENCIA", "INCOGNITA", "BLOQUEO"];

const TAG_DESC: Record<Quote["tag"], string> = {
  OBSERVACION: "Pasaje que vale la pena recordar",
  CANON: "Hecho canónico explícito de la saga",
  INFERENCIA: "Inferencia consistente con el canon",
  INCOGNITA: "Misterio o pregunta abierta",
  BLOQUEO: "Pasaje que contradice o bloquea",
};

export function QuoteDialog({ open, onOpenChange, bookNum, bookTitle, chapterIdx, chapterTitle }: QuoteDialogProps) {
  const { addQuote, removeQuote, quotes, hasQuoteForChapter } = useQuotes();
  const [text, setText] = useState("");
  const [tag, setTag] = useState<Quote["tag"]>("OBSERVACION");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const chapterQuotes = quotes.filter((q) => q.bookNum === bookNum && q.chapterIdx === chapterIdx);

  const handleSave = () => {
    if (text.trim().length < 3) return;
    addQuote({
      text: text.trim(),
      bookNum,
      bookTitle,
      chapterIdx,
      chapterTitle,
      tag,
      note: note.trim() || undefined,
    });
    setText("");
    setNote("");
    setTag("OBSERVACION");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ background: "oklch(0.16 0.010 50)" }}>
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-serif text-lg flex items-center gap-2">
            <Bookmark className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
            Guardar pasaje
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-serif italic">
            {bookNum} · {bookTitle} — {chapterTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Saved quotes for this chapter */}
          {chapterQuotes.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                {chapterQuotes.length} pasaje{chapterQuotes.length > 1 ? "s" : ""} guardado{chapterQuotes.length > 1 ? "s" : ""} en este capítulo
              </p>
              {chapterQuotes.map((q) => (
                <div key={q.id} className="rounded-md border border-border/40 bg-card/30 p-3">
                  <div className="flex items-start gap-2">
                    <QuoteIcon className="h-3 w-3 mt-1 shrink-0" style={{ color: "var(--amber-glow)" }} />
                    <p className="font-serif text-sm italic text-foreground/85 flex-1">“{q.text}”</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[0.55rem] font-mono ${EPISTEMIC_META[q.tag]?.chip || "chip-inferido"}`}>
                      {q.tag}
                    </span>
                    <button
                      onClick={() => removeQuote(q.id)}
                      className="text-muted-foreground hover:text-bloqueo transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {q.note && <p className="mt-1.5 text-xs text-muted-foreground font-serif">{q.note}</p>}
                </div>
              ))}
            </div>
          )}

          {/* New quote form */}
          <div className="space-y-3 pt-2 border-t border-border/30">
            <div>
              <label className="block font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-1.5">
                Pasaje
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Pega o escribe el pasaje que quieres conservar…"
                rows={3}
                className="w-full resize-none rounded-md border border-border/60 bg-input/50 px-3 py-2 text-sm font-serif outline-none focus:border-amber-glow/50 transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-1.5">
                Etiqueta OSIT
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((t) => {
                  const meta = EPISTEMIC_META[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      title={TAG_DESC[t]}
                      className={`rounded border px-2 py-1 text-[0.6rem] font-mono transition-all ${tag === t ? (meta?.chip || "chip-inferido") + " ring-1 ring-amber-glow/30" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-[0.65rem] text-muted-foreground font-serif italic">{TAG_DESC[tag]}</p>
            </div>
            <div>
              <label className="block font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-1.5">
                Nota (opcional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tu observación sobre este pasaje…"
                className="w-full rounded-md border border-border/60 bg-input/50 px-3 py-2 text-sm font-serif outline-none focus:border-amber-glow/50 transition-colors"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={text.trim().length < 3}
              className="w-full flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: saved ? "var(--canon)" : "var(--oxblood)", color: "oklch(0.96 0.02 70)" }}
            >
              {saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Bookmark className="h-4 w-4" /> Guardar pasaje</>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Standalone panel showing all saved quotes (for a future "Colección" view)
export function QuotesPanel({ onOpenBook }: { onOpenBook?: (num: string, title: string, chapterIdx?: number) => void }) {
  const { quotes, removeQuote, count } = useQuotes();
  const [filter, setFilter] = useState<string>("all");

  const exportMarkdown = useCallback(() => {
    const lines = [
      "# Colección de pasajes — MEDIOEVO El Archivo",
      "",
      `> Exportado el ${new Date().toLocaleString("es-MX")}`,
      `> ${count} pasajes guardados con etiquetas OSIT`,
      "",
      "---",
      "",
    ];
    const byTag: Record<string, Quote[]> = {};
    for (const q of quotes) {
      if (!byTag[q.tag]) byTag[q.tag] = [];
      byTag[q.tag].push(q);
    }
    for (const tag of Object.keys(byTag)) {
      lines.push(`## ${tag}`);
      lines.push("");
      for (const q of byTag[tag]) {
        lines.push(`### ${q.bookTitle} — ${q.chapterTitle}`);
        lines.push(`> ${q.text.replace(/\n/g, "\n> ")}`);
        if (q.note) lines.push(`\n**Nota:** ${q.note}`);
        lines.push(`\n*Libro ${q.bookNum} · capítulo ${q.chapterIdx + 1}*`);
        lines.push("");
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medioevo-pasajes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [quotes, count]);

  if (count === 0) return null;

  const tags = [...new Set(quotes.map((q) => q.tag))];
  const filtered = filter === "all" ? quotes : quotes.filter((q) => q.tag === filter);

  return (
    <div className="card-archive p-5 md:p-6 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 tex-vellum opacity-15 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <QuoteIcon className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
          <h2 className="font-serif text-lg font-semibold">Colección de pasajes</h2>
          <span className="font-mono text-[0.6rem] text-muted-foreground">· {count}</span>
          <button onClick={exportMarkdown}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-amber-glow/40 px-2.5 py-1 text-[0.65rem] font-mono transition-colors hover:bg-amber-glow/10"
            style={{ color: "var(--amber-glow)" }}
            title="Exportar como Markdown">
            <Download className="h-3 w-3" />
            Exportar .md
          </button>
        </div>

        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={() => setFilter("all")}
              className={`rounded border px-2 py-0.5 text-[0.6rem] font-mono ${filter === "all" ? "chip-canon" : "border-border/40 text-muted-foreground"}`}>
              Todos ({count})
            </button>
            {tags.map((t) => {
              const meta = EPISTEMIC_META[t];
              return (
                <button key={t} onClick={() => setFilter(t)}
                  className={`rounded border px-2 py-0.5 text-[0.6rem] font-mono ${filter === t ? (meta?.chip || "chip-inferido") : "border-border/40 text-muted-foreground"}`}>
                  {t} ({quotes.filter((q) => q.tag === t).length})
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((q) => (
            <div key={q.id} className="rounded-md border border-border/40 bg-card/30 p-3 group">
              <div className="flex items-start gap-2">
                <QuoteIcon className="h-3 w-3 mt-1 shrink-0" style={{ color: "var(--amber-glow)" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm italic text-foreground/85 leading-relaxed">“{q.text}”</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`rounded border px-1.5 py-0.5 text-[0.55rem] font-mono ${EPISTEMIC_META[q.tag]?.chip || "chip-inferido"}`}>{q.tag}</span>
                    <button
                      onClick={() => onOpenBook?.(q.bookNum, q.bookTitle, q.chapterIdx)}
                      disabled={!onOpenBook}
                      className="flex items-center gap-1 text-[0.6rem] font-mono text-muted-foreground hover:text-amber-glow transition-colors"
                    >
                      <code style={{ color: "var(--amber-glow)" }}>{q.bookNum}</code>
                      <span className="truncate max-w-[120px]">{q.chapterTitle}</span>
                      {onOpenBook && <ExternalLink className="h-2.5 w-2.5" />}
                    </button>
                    <button
                      onClick={() => removeQuote(q.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-bloqueo transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {q.note && <p className="mt-1 text-xs text-muted-foreground font-serif">{q.note}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
