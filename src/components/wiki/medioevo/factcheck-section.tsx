"use client";
import { useState } from "react";
import { ShieldCheck, Loader2, AlertTriangle, FlaskConical, Sparkles, Quote } from "lucide-react";
import { EPISTEMIC_META } from "@/lib/medioevo";

interface Evidence {
  source: string;
  heading: string;
  quote: string;
  epistemic: string[];
}
interface FactResult {
  state: "CERTEZA" | "INFERENCIA" | "INCOGNITA" | "BLOQUEO";
  residue: number;
  confidence: number;
  verdict: string;
  explanation: string;
  evidence: Evidence[];
  relatedConstants: string[];
}

const EXAMPLES = [
  "Maku tiene 7,699 años",
  "ARCHON es el villano de la saga",
  "Don Humo se dispersa a 432 Hz al morir",
  "La saga dura 7,692 años",
  "Leonardo es un héroe que salva a la humanidad",
  "El mundo de MEDIOEVO está construido sobre la constante Lambert W",
  "Las Torres TAAT operan a 0.12 Hz",
  "K-07 es el único superviviente del Sacrificio Coral",
];

const RESIDUE_BANDS = [
  { lo: 0.0, hi: 0.15, label: "Óptimo", color: "var(--canon)", desc: "Avanzar directo" },
  { lo: 0.15, hi: 0.35, label: "Manejable", color: "oklch(0.7 0.12 120)", desc: "Avanzar, registrar" },
  { lo: 0.35, hi: 0.6, label: "Alerta", color: "var(--inferido)", desc: "Revisar con pruebas" },
  { lo: 0.6, hi: 0.8, label: "Alto riesgo", color: "oklch(0.65 0.16 40)", desc: "Revisar antes de actuar" },
  { lo: 0.8, hi: 1.01, label: "Bloqueo", color: "var(--bloqueo)", desc: "Bloquear, pedir evidencia" },
];

export function FactCheckSection() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = async (text?: string) => {
    const c = (text ?? claim).trim();
    if (c.length < 3) return;
    setLoading(true);
    setError(null);
    setResult(null);
    if (text) setClaim(text);
    try {
      const res = await fetch("/api/factcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: c }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error del verificador");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message || "Fallo desconocido");
    } finally {
      setLoading(false);
    }
  };

  const meta = result ? EPISTEMIC_META[result.state] : null;
  const band = result ? RESIDUE_BANDS.find((b) => result.residue >= b.lo && result.residue < b.hi) : null;

  return (
    <div className="fade-rise mx-auto max-w-5xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">Verificador epistémico · OSIT</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Cámara de Verificación</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          El autor exigió usar sus propias métricas. Este verificador aplica el framework OSIT del corpus de Tyr — no una IA genérica — para clasificar cualquier afirmación sobre MEDIOEVO en cuatro estados epistémicos y calcular el residuo R.
        </p>
      </header>

      {/* Input chamber */}
      <div className="card-archive p-5 md:p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 glitch-lines opacity-30 pointer-events-none" />
        <div className="relative">
          <label className="flex items-center gap-2 mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
            Afirmación a verificar
          </label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) verify(); }}
            placeholder="Ej: ARCHON fue creado en 1999 por ancestros de Caius…"
            rows={3}
            className="w-full resize-none rounded-md border border-border/60 bg-input/50 px-4 py-3 text-sm outline-none focus:border-amber-glow/50 transition-colors font-serif"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => verify()}
              disabled={loading || claim.trim().length < 3}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--oxblood)", color: "oklch(0.96 0.02 70)" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {loading ? "Verificando…" : "Verificar con OSIT"}
            </button>
            <span className="text-[0.65rem] font-mono text-muted-foreground">⌘+Enter</span>
          </div>

          {/* Examples */}
          <div className="mt-4">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70 mb-2">Prueba una afirmación canónica:</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button key={ex} onClick={() => verify(ex)} disabled={loading}
                  className="rounded-full border border-border/50 px-2.5 py-1 text-[0.7rem] text-muted-foreground hover:text-foreground hover:border-amber-glow/40 transition-colors">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card-archive p-4 mb-6 border-bloqueo/40 flex items-start gap-3" style={{ borderColor: "oklch(0.60 0.20 25 / 0.4)" }}>
          <AlertTriangle className="h-5 w-5 mt-0.5" style={{ color: "var(--bloqueo)" }} />
          <div>
            <p className="font-mono text-xs" style={{ color: "var(--bloqueo)" }}>BLOQUEO DEL SISTEMA</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && meta && (
        <div className="space-y-6 fade-rise">
          {/* Verdict card */}
          <div className="card-archive p-6 relative overflow-hidden">
            <div className="absolute inset-0 tex-vellum opacity-20 pointer-events-none" />
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                <div className={`flex items-center gap-3 rounded-md border px-4 py-2.5 ${meta.chip}`}>
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Estado OSIT</div>
                    <div className="font-serif text-2xl font-bold">{meta.label}</div>
                  </div>
                </div>
                <p className="font-serif italic text-lg text-foreground/90 flex-1">“{result.verdict}”</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-serif">{result.explanation}</p>

              {/* Residue gauge */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Residuo R · {band?.label}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: band?.color }}>{result.residue.toFixed(3)}</span>
                </div>
                <div className="relative h-3 rounded-full overflow-hidden border border-border/40">
                  <div className="absolute inset-0 flex">
                    {RESIDUE_BANDS.map((b) => (
                      <div key={b.label} style={{ width: `${((b.hi - b.lo) * 100)}%`, background: b.color, opacity: 0.35 }} />
                    ))}
                  </div>
                  <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all" style={{ left: `${result.residue * 100}%`, transform: "translateX(-50%)" }} />
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[0.55rem] text-muted-foreground/60">
                  <span>0.00 óptimo</span><span>0.35 alerta</span><span>0.60 riesgo</span><span>1.00 bloqueo</span>
                </div>
                {band && <p className="mt-2 text-xs text-muted-foreground font-serif italic">↳ {band.desc}</p>}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>Confianza: <span className="text-foreground">{(result.confidence * 100).toFixed(0)}%</span></span>
                <span>·</span>
                <span>{meta.desc}</span>
              </div>
            </div>
          </div>

          {/* Evidence */}
          {result.evidence.length > 0 && (
            <div>
              <div className="divider-chi mb-4">EVIDENCIA DEL CORPUS</div>
              <div className="grid md:grid-cols-2 gap-3">
                {result.evidence.map((ev, i) => (
                  <div key={i} className="card-archive p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Quote className="h-3.5 w-3.5" style={{ color: "var(--amber-glow)" }} />
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{ev.source}</span>
                      {ev.epistemic.map((e) => {
                        const m = EPISTEMIC_META[e] || EPISTEMIC_META.INFERIDO;
                        return <span key={e} className={`rounded border px-1.5 py-0.5 text-[0.55rem] font-mono ${m.chip}`}>{m.label}</span>;
                      })}
                    </div>
                    <p className="font-serif text-sm italic text-foreground/80 leading-relaxed">“{ev.quote}”</p>
                    <p className="mt-2 font-mono text-[0.6rem] text-muted-foreground/70">↳ {ev.heading}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related constants */}
          {result.relatedConstants.length > 0 && (
            <div>
              <div className="divider-chi mb-4">CONSTANTES RELACIONADAS</div>
              <div className="flex flex-wrap gap-2">
                {result.relatedConstants.map((c) => (
                  <span key={c} className="rounded-md border border-amber-glow/30 bg-amber-glow/5 px-3 py-1.5 font-mono text-xs" style={{ color: "var(--amber-glow)" }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      {!result && !loading && (
        <div className="card-archive p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
            <h2 className="font-serif text-lg font-semibold">Cómo funciona el verificador</h2>
          </div>
          <ol className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-3"><span className="font-mono text-amber-glow shrink-0" style={{ color: "var(--amber-glow)" }}>01</span> <span className="font-serif">Recupera fragmentos del corpus canónico (Atlas + Lore fundacional) por similitud léxica, con boost a fragmentos etiquetados [CANON].</span></li>
            <li className="flex gap-3"><span className="font-mono text-amber-glow shrink-0" style={{ color: "var(--amber-glow)" }}>02</span> <span className="font-serif">Envía la afirmación + el contexto recuperado al modelo con el system prompt OSIT del autor (4 estados Belnap-Dunn + cálculo de residuo R).</span></li>
            <li className="flex gap-3"><span className="font-mono text-amber-glow shrink-0" style={{ color: "var(--amber-glow)" }}>03</span> <span className="font-serif">El modelo clasifica en CERTEZA / INFERENCIA / INCOGNITA / BLOQUEO, calcula R (0–1) y cita la evidencia con fuente.</span></li>
            <li className="flex gap-3"><span className="font-mono text-amber-glow shrink-0" style={{ color: "var(--amber-glow)" }}>04</span> <span className="font-serif">Si la afirmación contradice el canon (ej: 7,699 vs 7,692 años), el sistema declara BLOQUEO con residuo alto. <em className="text-foreground/70">Sin humo, sin proteger el ego.</em></span></li>
          </ol>
        </div>
      )}
    </div>
  );
}
