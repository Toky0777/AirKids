/**
 * Galerie photo : mosaïque en colonnes + visionneuse accessible.
 *
 * - Ouverture au clic sur une vignette, navigation clavier (← → Échap),
 *   piégeage du focus dans la visionneuse, retour du focus sur la vignette.
 * - Compteur annoncé aux lecteurs d'écran, légendes associées.
 * - Aucune animation si l'utilisateur préfère réduire les mouvements.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryPhoto {
  id: string;
  thumb: string;
  full: string;
  width: number;
  height: number;
  alt: string;
}

interface Props {
  photos: GalleryPhoto[];
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden="true">
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function GalleryLightbox({ photos }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = index !== null;
  const current = index !== null ? photos[index] : null;

  /** Ferme la visionneuse et rend le focus à la vignette d'origine. */
  const closeAndReturnFocus = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((value) => {
        if (value === null) return value;
        const next = (value + delta + photos.length) % photos.length;
        return next;
      });
    },
    [photos.length],
  );

  // Ouverture : focus sur le bouton de fermeture, blocage du défilement.
  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Navigation clavier et piégeage du focus dans la visionneuse.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndReturnFocus();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button, [href]");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeAndReturnFocus, step]);

  // Préchargement des images voisines.
  useEffect(() => {
    if (index === null) return;
    for (const offset of [1, -1]) {
      const neighbor = photos[(index + offset + photos.length) % photos.length];
      const image = new window.Image();
      image.src = neighbor.full;
    }
  }, [index, photos]);

  return (
    <>
      <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>li]:mb-4">
        {photos.map((photo, photoIndex) => (
          <li key={photo.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setIndex(photoIndex);
              }}
              className="group relative block w-full overflow-hidden rounded-2xl shadow-card transition-transform duration-300 hover:scale-[1.02]"
              aria-label={`Agrandir la photo : ${photo.alt}`}
            >
              <img
                src={photo.thumb}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="w-full object-cover"
              />
              <span
                className="absolute inset-0 bg-forest-deep/0 transition-colors duration-300 group-hover:bg-forest-deep/15"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>

      {isOpen && current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Visionneuse de photos — image ${(index ?? 0) + 1} sur ${photos.length}`}
          className="fixed inset-0 z-[80] flex flex-col bg-forest-deep/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="font-display text-sm font-semibold text-cream sm:text-base" aria-live="polite">
              Image {(index ?? 0) + 1} sur {photos.length}
            </p>
            <button
              type="button"
              ref={closeRef}
              onClick={closeAndReturnFocus}
              className="inline-flex size-11 items-center justify-center rounded-full border-2 border-cream/40 text-cream transition hover:border-cream hover:bg-cream/10"
            >
              <span className="sr-only">Fermer la visionneuse</span>
              <CloseIcon />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:gap-6 sm:px-6">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-cream/40 text-cream transition hover:border-cream hover:bg-cream/10"
            >
              <span className="sr-only">Image précédente</span>
              <ChevronIcon direction="left" />
            </button>

            <figure className="flex h-full min-h-0 max-w-5xl flex-col items-center justify-center">
              <img
                src={current.full}
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain"
              />
              <figcaption className="mt-4 max-w-2xl text-center text-sm text-cream/85">
                {current.alt}
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-cream/40 text-cream transition hover:border-cream hover:bg-cream/10"
            >
              <span className="sr-only">Image suivante</span>
              <ChevronIcon direction="right" />
            </button>
          </div>

          <p className="pb-4 text-center text-xs text-cream/60">
            Utilisez les flèches du clavier pour naviguer, Échap pour fermer.
          </p>
        </div>
      )}
    </>
  );
}
