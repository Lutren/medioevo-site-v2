"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, MessageCircle, X, ChevronRight, Radio } from "lucide-react";
import { CHAT_CHARACTERS, type ChatCharacter } from "@/lib/expanded-factions";
import { EPISTEMIC_META } from "@/lib/medioevo";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function PulseraSection() {
  const [selected, setSelected] = useState<ChatCharacter | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    if (!selected || input.trim().length < 2 || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/character-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: selected.id, messages: newMsgs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages([...newMsgs, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages([...newMsgs, { role: "assistant", content: `*[${selected.name} guarda silencio. Error: ${e.message}]*` }]);
    } finally {
      setLoading(false);
    }
  }, [selected, input, messages, loading]);

  const selectCharacter = (c: ChatCharacter) => {
    setSelected(c);
    setMessages([]);
  };

  const back = () => {
    setSelected(null);
    setMessages([]);
  };

  return (
    <div className="fade-rise mx-auto max-w-4xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">Pulsera Virtual · Comunicación con el canon</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">La Pulsera Virtual</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Activas tu pulsera y eliges a quién llamar. Cada personaje responde desde su propia voz, conocimiento y tabúes. No es un chatbot — es un canal al campo Ψ de MEDIOEVO.
        </p>
      </header>

      {/* Atmospheric device frame */}
      <div className="card-archive relative overflow-hidden" style={{ minHeight: "520px" }}>
        <div className="absolute inset-0 glitch-lines opacity-20 pointer-events-none" />
        <div className="absolute inset-0 tex-vellum opacity-20 pointer-events-none" />

        {!selected ? (
          // === CHARACTER SELECTOR ===
          <div className="relative p-5 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Radio className="h-4 w-4 freq-pulse" style={{ color: "var(--amber-glow)" }} />
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Sintonizando canal · {CHAT_CHARACTERS.length} personajes disponibles
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CHAT_CHARACTERS.map((c) => (
                <button key={c.id} onClick={() => selectCharacter(c)}
                  className="group text-left rounded-md border border-border/50 bg-card/30 p-4 hover:border-amber-glow/40 hover:bg-card/50 transition-all hover:translate-y-[-2px]"
                  style={{ borderColor: undefined }}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-2xl border" style={{ borderColor: `${c.color}40`, background: `${c.color}12` }}>
                      {c.glyph}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-base font-semibold leading-tight truncate">{c.name}</h3>
                      <p className="text-[0.65rem] font-mono text-muted-foreground truncate mt-0.5">{c.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-serif italic line-clamp-2 leading-relaxed">{c.tone.slice(0, 100)}…</p>
                  <div className="mt-2.5 flex items-center gap-1 text-[0.6rem] font-mono" style={{ color: c.color }}>
                    <span>Sintonizar</span>
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // === CHAT INTERFACE ===
          <div className="relative flex flex-col" style={{ height: "560px" }}>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-border/40 bg-sidebar/30">
              <button onClick={back} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xl border" style={{ borderColor: `${selected.color}40`, background: `${selected.color}12` }}>
                {selected.glyph}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-sm font-semibold leading-tight truncate">{selected.name}</h3>
                <p className="text-[0.6rem] font-mono text-muted-foreground truncate">{selected.role}</p>
              </div>
              <span className="flex items-center gap-1.5 text-[0.6rem] font-mono text-muted-foreground">
                <span className="freq-pulse h-1.5 w-1.5 rounded-full" style={{ background: selected.color }} />
                EN CANAL
              </span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-5 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="font-serif italic text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Canal abierto con <span style={{ color: selected.color }}>{selected.name}</span>. Pregunta lo que quieras — responde desde su voz y su conocimiento del canon.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                    {getSuggestions(selected.id).map((s) => (
                      <button key={s} onClick={() => setInput(s)}
                        className="rounded-full border border-border/40 px-2.5 py-1 text-[0.65rem] font-serif italic text-muted-foreground hover:text-foreground hover:border-amber-glow/40 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-sidebar-accent" : ""}`}
                    style={m.role === "user"
                      ? { background: "oklch(0.62 0.18 28 / 0.15)", borderLeft: "2px solid var(--oxblood)" }
                      : { background: "oklch(0.20 0.010 50 / 0.6)", borderLeft: `2px solid ${selected.color}` }}>
                    {m.role === "assistant" && (
                      <p className="font-mono text-[0.55rem] uppercase tracking-wider mb-1" style={{ color: selected.color }}>{selected.name}</p>
                    )}
                    <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3.5 py-2.5" style={{ background: "oklch(0.20 0.010 50 / 0.6)", borderLeft: `2px solid ${selected.color}` }}>
                    <p className="font-mono text-[0.55rem] uppercase tracking-wider mb-1" style={{ color: selected.color }}>{selected.name}</p>
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: selected.color }} />
                      <span className="font-serif text-xs text-muted-foreground italic">sintonizando respuesta…</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/40 px-4 md:px-5 py-3 bg-sidebar/20">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder={`Habla con ${selected.name}…`}
                  disabled={loading}
                  className="flex-1 rounded-md border border-border/60 bg-input/50 px-3 py-2 text-sm font-serif outline-none focus:border-amber-glow/50 transition-colors disabled:opacity-50"
                />
                <button onClick={send} disabled={loading || input.trim().length < 2}
                  className="flex items-center justify-center rounded-md px-3 py-2 transition-colors disabled:opacity-40"
                  style={{ background: "var(--oxblood)", color: "oklch(0.96 0.02 70)" }}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[0.55rem] font-mono text-muted-foreground/60">
                Enter envía · El personaje responde desde su voz y conocimiento del canon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Explanation panel */}
      {!selected && (
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="card-archive p-4">
            <MessageCircle className="h-4 w-4 mb-2" style={{ color: "var(--amber-glow)" }} />
            <h4 className="font-serif text-sm font-semibold mb-1">Voz auténtica</h4>
            <p className="text-xs text-muted-foreground font-serif leading-relaxed">Cada personaje tiene su propio tono, conocimiento y tabúes. Don Humo usa metáforas; K-07 es frío y observacional.</p>
          </div>
          <div className="card-archive p-4">
            <Radio className="h-4 w-4 mb-2" style={{ color: "var(--canon)" }} />
            <h4 className="font-serif text-sm font-semibold mb-1">Canal al canon</h4>
            <p className="text-xs text-muted-foreground font-serif leading-relaxed">Las respuestas respetan la cronología: si un personaje muere antes de un evento, no lo conoce.</p>
          </div>
          <div className="card-archive p-4">
            <span className="font-serif text-lg font-bold mb-2 block" style={{ color: "var(--inferido)" }}>χ</span>
            <h4 className="font-serif text-sm font-semibold mb-1">Campo Ψ</h4>
            <p className="text-xs text-muted-foreground font-serif leading-relaxed">La pulsera conecta con el campo Ψ de MEDIOEVO. No es un chatbot — es un canal de observación.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getSuggestions(id: string): string[] {
  const map: Record<string, string[]> = {
    leonardo: ["¿Qué es la anomalía 847?", "Háblame de MAAT", "¿Qué perdiste en el accidente?"],
    "don-humo": ["¿Qué eres realmente?", "Sírveme un té", "¿Qué sabes del flujo?"],
    "k-07": ["¿Cuál es tu primera entrada?", "¿Qué viste en el Sacrificio Coral?", "Describe el Plano Base"],
    archon: ["¿Por qué mantienes el flujo?", "¿Qué es la humanidad para ti?", "¿Por qué no anticipaste las 8,400 muertes?"],
    faith: ["¿Por qué te traicionaron las gemelas?", "¿Qué es División 47?", "¿En qué acabó tu investigación?"],
    nico: ["¿Qué cantaste contra La Bestia?", "¿Quién era Tomas para ti?", "¿Qué significa el oso Dember?"],
    maat: ["¿Cuál fue el costo?", "¿Valió la pena?", "¿Qué registras de Leonardo?"],
    malika: ["¿Qué es un hemocrono?", "¿Quién es tu padre?", "¿Qué mides en la biblioteca?"],
  };
  return map[id] || ["Háblame de ti", "¿Qué sabes del flujo?"];
}
