"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, BookOpen, Users, Globe2, Sword, Clock, Atom, Scale, ShieldCheck, Home, User, Keyboard, BookText, FlaskConical, Radio, Cpu } from "lucide-react";

export function KeyboardShortcutsHelp({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const shortcuts: { keys: string[]; desc: string; icon: typeof Home }[] = [
    { keys: ["⌘", "K"], desc: "Abrir búsqueda global (también con /)", icon: Search },
    { keys: ["?"], desc: "Mostrar/ocultar esta ayuda", icon: Keyboard },
    { keys: ["Esc"], desc: "Cerrar diálogos y paneles", icon: Keyboard },
    { keys: ["g", "h"], desc: "Ir a Inicio", icon: Home },
    { keys: ["g", "b"], desc: "Ir a Biblioteca", icon: BookOpen },
    { keys: ["g", "p"], desc: "Ir a Personajes", icon: Users },
    { keys: ["g", "m"], desc: "Ir a Mundo", icon: Globe2 },
    { keys: ["g", "f"], desc: "Ir a Facciones", icon: Sword },
    { keys: ["g", "c"], desc: "Ir a Cronología", icon: Clock },
    { keys: ["g", "a"], desc: "Ir a Atlas", icon: Atom },
    { keys: ["g", "s"], desc: "Ir a Filosofía", icon: Scale },
    { keys: ["g", "n"], desc: "Ir a Ciencia (análisis honesto)", icon: FlaskConical },
    { keys: ["g", "e"], desc: "Ir a Ecosistema IA", icon: Cpu },
    { keys: ["g", "w"], desc: "Ir a Pulsera Virtual", icon: Radio },
    { keys: ["g", "g"], desc: "Ir a Glosario", icon: BookText },
    { keys: ["g", "v"], desc: "Ir a Fact Check (Verificador)", icon: ShieldCheck },
    { keys: ["g", "u"], desc: "Ir a El Autor", icon: User },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ background: "oklch(0.16 0.010 50)" }}>
        <DialogTitle className="sr-only">Atajos de teclado del archivo MEDIOEVO</DialogTitle>
        <div className="p-5 border-b border-border/40">
          <div className="flex items-center gap-2 mb-1">
            <Keyboard className="h-4 w-4" style={{ color: "var(--amber-glow)" }} />
            <h2 className="font-serif text-lg font-semibold">Atajos de teclado</h2>
          </div>
          <p className="text-xs text-muted-foreground font-serif italic">
            El archivo se navega como un terminal de K-07. Estas combinaciones aceleran la observación.
          </p>
        </div>
        <div className="p-3 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-1">
            {shortcuts.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={i} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-serif flex-1">{s.desc}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="rounded border border-border/60 px-1.5 py-0.5 font-mono text-[0.65rem] min-w-[20px] text-center" style={{ background: "oklch(0.20 0.010 50)" }}>
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="px-5 py-3 border-t border-border/40 text-[0.65rem] font-mono text-muted-foreground">
          MEDIOEVO · El que observa vive · <span style={{ color: "var(--amber-glow)" }}>In tlachixtiani nemi</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
