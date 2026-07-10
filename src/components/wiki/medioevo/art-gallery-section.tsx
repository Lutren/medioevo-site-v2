"use client";
import { useEffect, useState, useMemo } from "react";
import { Images, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ArtImage {
  path: string;
  name: string;
}

export function ArtGallerySection() {
  const [images, setImages] = useState<ArtImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [failedLoads, setFailedLoads] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load image list from build-time generated JSON (no hardcoded typos → no 404s)
    let cancelled = false;
    fetch("/data/character-art.json")
      .then((r) => r.json())
      .then((data: ArtImage[]) => {
        if (cancelled) return;
        setImages(data);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const validImages = useMemo(() => images.filter((img) => !failedLoads.has(img.path)), [images, failedLoads]);

  const handleImgError = (path: string) => {
    setFailedLoads((prev) => new Set(prev).add(path));
  };

  const next = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % validImages.length);
  };
  const prev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + validImages.length) % validImages.length);
  };

  // keyboard nav in lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxIdx, validImages.length]);

  return (
    <div className="fade-rise mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Universo Visual · {validImages.length} piezas
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Galería del Universo Híbrido</h1>
        <p className="text-muted-foreground max-w-2xl font-serif italic">
          Steampunk · Cyberpunk · Archeopunk · Biopunk. El universo visual híbrido de Claudio — cada elemento diseñado con sabiduría del pasado y precisión del futuro: brutal, elegante, misterioso, ecológico, reparable, monumental.
        </p>
      </header>

      {/* Aesthetic pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { name: "Steampunk", desc: "Calderas, válvulas, engranajes, relojería", color: "var(--oxblood)" },
          { name: "Cyberpunk", desc: "Circuitos visibles, hologramas, neón tenue", color: "var(--amber-glow)" },
          { name: "Archeopunk", desc: "Ruinas sagradas, columnas, símbolos olvidados", color: "var(--canon)" },
          { name: "Biopunk", desc: "Musgo sobre metal, biotubos, membranas orgánicas", color: "var(--jade)" },
        ].map((p) => (
          <div key={p.name} className="rounded-md border border-border/40 bg-card/20 px-3 py-2.5" style={{ borderLeft: `3px solid ${p.color}` }}>
            <p className="font-serif text-sm font-semibold" style={{ color: p.color }}>{p.name}</p>
            <p className="text-[0.65rem] text-muted-foreground font-serif mt-0.5">{p.desc}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--amber-glow)" }} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {validImages.map((img, i) => (
            <button key={img.path} onClick={() => setLightboxIdx(i)}
              className="group relative aspect-square overflow-hidden rounded-md border border-border/50 bg-card/30 hover:border-amber-glow/40 transition-all">
              <img src={img.path} alt={`Arte del universo MEDIOEVO ${i + 1}`} loading="lazy"
                onError={() => handleImgError(img.path)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 font-mono text-[0.5rem] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "oklch(0.62 0.18 28 / 0.9)", color: "oklch(0.96 0.02 70)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && validImages.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Images className="mx-auto h-8 w-8 mb-3 opacity-40" />
          <p className="font-serif italic">Sin imágenes disponibles.</p>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxIdx !== null} onOpenChange={(o) => !o && setLightboxIdx(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-0" style={{ background: "oklch(0.10 0.02 30 / 0.95)" }}>
          <DialogTitle className="sr-only">Vista ampliada de arte del universo MEDIOEVO</DialogTitle>
          {lightboxIdx !== null && validImages[lightboxIdx] && (
            <div className="relative">
              <img src={validImages[lightboxIdx].path} alt={`Arte ${lightboxIdx + 1}`}
                className="w-full max-h-[80vh] object-contain" />
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 backdrop-blur text-white/80 hover:text-white hover:bg-black/70 transition-colors" aria-label="Anterior">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 backdrop-blur text-white/80 hover:text-white hover:bg-black/70 transition-colors" aria-label="Siguiente">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 bg-black/60 backdrop-blur font-mono text-[0.65rem] text-white/80">
                {lightboxIdx + 1} / {validImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
