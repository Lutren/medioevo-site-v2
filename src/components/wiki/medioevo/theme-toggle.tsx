"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Standard next-themes mount pattern — avoids SSR/client theme mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const isPergamino = mounted && theme === "pergamino";

  return (
    <button
      onClick={() => setTheme(isPergamino ? "dark" : "pergamino")}
      className="relative flex items-center justify-center rounded-md border border-border/50 p-2 text-muted-foreground hover:text-foreground hover:border-amber-glow/40 transition-colors w-9 h-9"
      title={isPergamino ? "Modo archivo (oscuro)" : "Modo pergamino (claro)"}
      aria-label="Cambiar tema"
    >
      <Sun className={`h-4 w-4 absolute transition-all duration-300 ${isPergamino ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`} style={{ color: "var(--amber-glow)" }} />
      <Moon className={`h-4 w-4 absolute transition-all duration-300 ${isPergamino ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`} style={{ color: "var(--oxblood)" }} />
    </button>
  );
}
