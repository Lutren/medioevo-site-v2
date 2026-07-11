"use client";
import { useState } from "react";
import { GitCompare, Shuffle, X } from "lucide-react";
import { CHAT_CHARACTERS } from "@/lib/expanded-factions";

// Compare two characters side by side — their persona, knowledge, tone, taboos.

export function CharacterCompareSection() {
  const [leftId, setLeftId] = useState<string>(CHAT_CHARACTERS[0].id);
  const [rightId, setRightId] = useState<string>(CHAT_CHARACTERS[1].id);

  const left = CHAT_CHARACTERS.find((c) => c.id === leftId)!;
  const right = CHAT_CHARACTERS.find((c) => c.id === rightId)!;

  const randomize = () => {
    const ids = CHAT_CHARACTERS.map((c) => c.id);
    const a = ids[Math.floor(Math.random() * ids.length)];
    let b = ids[Math.floor(Math.random() * ids.length)];
    while (b === a) b = ids[Math.floor(Math.random() * ids.length)];
    setLeftId(a);
    setRightId(b);
  };

  return (
    <div className="fade-rise mx-auto max-w-6xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Comparador · {CHAT_CHARACTERS.length} personajes
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">El Espejo del Observador</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Compara dos personajes del canon lado a lado: su voz, su conocimiento, sus tabúes. ¿Qué sabe Don Humo que ARCHON no? ¿Qué calla K-07 que Leonardo grita?
        </p>
      </header>

      {/* Selector controls */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button onClick={randomize}
          className="flex items-center gap-1.5 rounded-md border border-amber-glow/40 px-3 py-1.5 text-xs font-mono transition-colors hover:bg-amber-glow/10"
          style={{ color: "var(--amber-glow)" }}>
          <Shuffle className="h-3.5 w-3.5" />
          Aleatorio
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 relative">
        {/* VS divider */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="flex items-center justify-center h-12 w-12 rounded-full border-2 bg-background" style={{ borderColor: "var(--amber-glow)" }}>
            <span className="font-serif text-xs font-bold" style={{ color: "var(--amber-glow)" }}>VS</span>
          </div>
        </div>

        {/* Left character */}
        <CharacterColumn
          character={left}
          onPick={setLeftId}
          otherId={rightId}
          side="left"
        />

        {/* Right character */}
        <CharacterColumn
          character={right}
          onPick={setRightId}
          otherId={leftId}
          side="right"
        />
      </div>

      {/* Comparison rows */}
      <div className="mt-6 divider-chi mb-4">Comparación directa</div>
      <div className="space-y-2">
        <CompareRow label="Rol" left={left.role} right={right.role} leftColor={left.color} rightColor={right.color} />
        <CompareRow label="Tono" left={left.tone.slice(0, 120) + "…"} right={right.tone.slice(0, 120) + "…"} leftColor={left.color} rightColor={right.color} />
        <CompareRow label="Conocimiento" left={left.knowledge.slice(0, 150) + "…"} right={right.knowledge.slice(0, 150) + "…"} leftColor={left.color} rightColor={right.color} />
        <CompareRow label="Tabúes" left={left.taboos.slice(0, 120) + "…"} right={right.taboos.slice(0, 120) + "…"} leftColor={left.color} rightColor={right.color} />
      </div>
    </div>
  );
}

function CharacterColumn({ character, onPick, otherId, side }: {
  character: typeof CHAT_CHARACTERS[0];
  onPick: (id: string) => void;
  otherId: string;
  side: "left" | "right";
}) {
  return (
    <div className="card-archive p-5" style={{ borderLeft: side === "left" ? `4px solid ${character.color}` : undefined, borderRight: side === "right" ? `4px solid ${character.color}` : undefined }}>
      {/* Selector */}
      <select
        value={character.id}
        onChange={(e) => onPick(e.target.value)}
        className="w-full mb-4 rounded-md border border-border/60 bg-input/50 px-3 py-2 text-sm font-serif outline-none focus:border-amber-glow/50"
      >
        {CHAT_CHARACTERS.filter((c) => c.id !== otherId).map((c) => (
          <option key={c.id} value={c.id}>{c.name} — {c.role}</option>
        ))}
      </select>

      {/* Character header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md text-3xl border" style={{ borderColor: `${character.color}40`, background: `${character.color}12` }}>
          {character.glyph}
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-bold leading-tight" style={{ color: character.color }}>{character.name}</h3>
          <p className="font-mono text-[0.6rem] text-muted-foreground mt-0.5">{character.role}</p>
        </div>
      </div>

      {/* Persona */}
      <div className="mb-3">
        <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1">Persona</p>
        <p className="font-serif text-xs italic text-foreground/75 leading-relaxed">{character.persona.slice(0, 180)}…</p>
      </div>

      {/* Tone */}
      <div className="mb-3">
        <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1">Tono</p>
        <p className="font-serif text-xs text-foreground/75 leading-relaxed">{character.tone}</p>
      </div>

      {/* Taboos */}
      <div>
        <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground mb-1">Tabúes</p>
        <p className="font-serif text-xs text-foreground/75 leading-relaxed">{character.taboos}</p>
      </div>
    </div>
  );
}

function CompareRow({ label, left, right, leftColor, rightColor }: {
  label: string;
  left: string;
  right: string;
  leftColor: string;
  rightColor: string;
}) {
  return (
    <div className="grid md:grid-cols-[100px_1fr_1fr] gap-2 items-start rounded-md border border-border/30 bg-card/20 p-2.5">
      <p className="font-mono text-[0.55rem] uppercase tracking-wider text-muted-foreground pt-1">{label}</p>
      <p className="font-serif text-xs leading-relaxed pl-2 border-l-2" style={{ borderColor: leftColor, color: "var(--foreground)" }}>{left}</p>
      <p className="font-serif text-xs leading-relaxed pl-2 border-l-2" style={{ borderColor: rightColor, color: "var(--foreground)" }}>{right}</p>
    </div>
  );
}
