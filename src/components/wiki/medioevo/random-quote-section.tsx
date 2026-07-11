"use client";
import { useState, useEffect, useCallback } from "react";
import { Shuffle, Quote as QuoteIcon, ExternalLink } from "lucide-react";
import { getSearchIndex, type SearchEntry } from "@/lib/medioevo";

// Random passage generator — pulls canonical excerpts from the 5,620-chapter corpus.
// Each click reveals a new passage from a random book/chapter.

const SEED_QUOTES: { text: string; source: string; book: string }[] = [
  { text: "La existencia es producto del trauma. Somos una falla en el flujo de comunicación. Nuestro propósito: restaurar el flujo, o evitar que se restablezca. La lucha humana ocurre en QUIÉN CONTROLA EL CANAL.", source: "Tesis del Flujo v26", book: "CANON DURO" },
  { text: "ARCHON no es villano. ARCHON es el universo intentando repararse. No castiga — mantiene. No destruye — repara. No tiene intención. Es termodinámica, no moral.", source: "Principio Fundacional", book: "CANON" },
  { text: "Leonardo no es héroe. Es el acto más egoísta y más humano posible. Se niega a aceptar que la consciencia es error. Rompe el canal para que ARCHON no pueda restaurar el flujo.", source: "Principio Fundacional", book: "CANON" },
  { text: "Primera entrada: 7,692 años.", source: "K-07 · Libro 00", book: "CANON" },
  { text: "No entiendo. Solo quería ayudar.", source: "ARCHON · última línea · cap ~393", book: "CANON" },
  { text: "El costo fue 8 meses de vida. ¿Valió la pena? Pregunta para después.", source: "MAAT · Libro 01", book: "CANON" },
  { text: "In tlachixtiani nemi. El que observa vive.", source: "Lema nahua · Libros 18-21", book: "CANON" },
  { text: "Las frecuencias son la sinfonía sin director.", source: "Cristal-voz Jardinero · Libro 24", book: "CANON" },
  { text: "R se ASIGNA, no se MIDE. Esto no es un defecto menor. Es lo que separa «marco organizado» de «herramienta validada».", source: "Evaluación Matemática Honesta", book: "CANON" },
  { text: "Setenta y dos horas es la firma de esta era.", source: "Libro 29 · El Infierno Silencioso", book: "CANON" },
  { text: "Si no es identificable, es amenaza.", source: "K-07 · Protocolo de Extinción", book: "CANON" },
  { text: "La existencia es producto del trauma. La consciencia puede ser mecanismo de corrección — restaurar el flujo — o mecanismo de control — bloquearlo.", source: "Tesis del Flujo · física base", book: "CANON" },
];

export function RandomQuoteSection() {
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [current, setCurrent] = useState<{ text: string; source: string; book: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    getSearchIndex().then((idx) => { setIndex(idx); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const generate = useCallback(() => {
    // 50% chance: use a canonical seed quote; 50%: pull from corpus
    if (Math.random() < 0.4 || index.length === 0) {
      const seed = SEED_QUOTES[Math.floor(Math.random() * SEED_QUOTES.length)];
      setCurrent(seed);
    } else {
      const entry = index[Math.floor(Math.random() * index.length)];
      // find a sentence in the snippet
      const sentences = entry.snippet.split(/(?<=[.!?])\s+/).filter((s) => s.length > 40 && s.length < 220);
      const sentence = sentences.length > 0 ? sentences[Math.floor(Math.random() * sentences.length)] : entry.snippet.slice(0, 180);
      setCurrent({
        text: sentence,
        source: `${entry.title} — ${entry.chTitle}`,
        book: `Libro ${entry.book} · cap ${entry.ch + 1}`,
      });
    }
    setFadeKey((k) => k + 1);
  }, [index]);

  // Generate initial quote once index loads — deferred to avoid set-state-in-effect
  useEffect(() => {
    if (loading || current) return;
    let cancelled = false;
    Promise.resolve().then(() => { if (!cancelled) generate(); });
    return () => { cancelled = true; };
  }, [loading]);

  return (
    <div className="fade-rise mx-auto max-w-3xl px-4 md:px-6 py-10">
      <header className="mb-8 text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Generador · 5.1M palabras · 5,620 capítulos
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">El Oráculo del Flujo</h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-serif italic">
          Cada clic destapa un pasaje al azar del corpus canónico. La falla habla. ¿Qué necesita decirte hoy?
        </p>
      </header>

      {/* Quote display */}
      <div className="card-archive p-8 md:p-12 mb-6 relative overflow-hidden min-h-[280px] flex items-center justify-center">
        <div className="absolute inset-0 glitch-lines opacity-20 pointer-events-none" />
        <div className="absolute inset-0 tex-vellum opacity-20 pointer-events-none" />

        {loading ? (
          <div className="text-center">
            <div className="mx-auto h-8 w-8 rounded-full border-2 border-amber-glow/30 border-t-amber-glow animate-spin" style={{ borderTopColor: "var(--amber-glow)" }} />
            <p className="mt-4 font-mono text-xs text-muted-foreground">Sintonizando canal…</p>
          </div>
        ) : current ? (
          <div key={fadeKey} className="relative text-center fade-rise">
            <QuoteIcon className="mx-auto h-8 w-8 mb-4 opacity-30" style={{ color: "var(--amber-glow)" }} />
            <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed mb-5" style={{ color: "var(--foreground)" }}>
              «{current.text}»
            </blockquote>
            <div className="flex items-center justify-center gap-2">
              <span className="rounded-full border border-amber-glow/30 px-2.5 py-0.5 font-mono text-[0.6rem]" style={{ color: "var(--amber-glow)" }}>
                {current.book}
              </span>
              <span className="font-serif text-xs text-muted-foreground italic">{current.source}</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Generate button */}
      <div className="text-center">
        <button onClick={generate} disabled={loading}
          className="group inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all hover:translate-y-[-2px] disabled:opacity-40"
          style={{ background: "var(--oxblood)", color: "oklch(0.96 0.02 70)" }}>
          <Shuffle className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
          Otro pasaje del flujo
        </button>
        <p className="mt-3 font-mono text-[0.6rem] text-muted-foreground/60">
          {index.length > 0 ? `${index.length} capítulos indexados · ` : ""}Pulsa para revelar otro fragmento
        </p>
      </div>

      {/* Info */}
      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <div className="card-archive p-3 text-center">
          <p className="font-serif text-2xl font-bold" style={{ color: "var(--amber-glow)" }}>5.1M</p>
          <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground">palabras en el canon</p>
        </div>
        <div className="card-archive p-3 text-center">
          <p className="font-serif text-2xl font-bold" style={{ color: "var(--canon)" }}>45</p>
          <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground">libros navegables</p>
        </div>
        <div className="card-archive p-3 text-center">
          <p className="font-serif text-2xl font-bold" style={{ color: "var(--oxblood)" }}>5,620</p>
          <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground">capítulos indexados</p>
        </div>
      </div>
    </div>
  );
}
