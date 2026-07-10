"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Two themes: "dark" (the archive — default) and "pergamino" (illuminated manuscript / light).
// next-themes uses attribute="class" so html gets class="dark" or class="pergamino".
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "pergamino"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
