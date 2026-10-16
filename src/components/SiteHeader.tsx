/**
 * En-tête du site : îlot React hydraté au chargement.
 * - Navigation principale sur ordinateur, panneau plein écran sur mobile.
 * - Bouton d'action « Demander des renseignements » toujours visible.
 * - Fermeture au clavier (Échap), blocage du défilement à l'ouverture,
 *   aria-expanded / aria-controls sur le bouton du menu.
 */
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/data/navigation";
import { ICONS, type IconName } from "@/components/icon-map";

interface Props {
  pathname: string;
  logoSrc: string;
  nav: NavItem[];
  phone: { display: string; href: string };
  email: string;
}

function InlineIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center [&>svg]:size-full ${className ?? "size-5"}`}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
      aria-hidden="true"
    />
  );
}

const withSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);

export default function SiteHeader({ pathname, logoSrc, nav, phone, email }: Props) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/90 backdrop-blur-md">
      <div className="container-x flex items-center gap-3 py-2.5">
        <a href="/" className="flex shrink-0 items-center" aria-label="Air Kids Madagascar — retour à l'accueil">
          <img
            src={logoSrc}
            alt="Air Kids Madagascar"
            width={230}
            height={74}
            className="h-10 w-auto sm:h-11"
          />
        </a>

        <nav aria-label="Navigation principale" className="ml-2 hidden items-center lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? withSlash(pathname) === "/"
                : withSlash(pathname).startsWith(withSlash(item.href));

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "rounded-full bg-white px-3 py-2 text-[15px] font-bold text-forest shadow-sm"
                    : "rounded-full px-3 py-2 text-[15px] font-semibold text-ink-soft transition hover:bg-white/70 hover:text-forest"
                }
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={phone.href}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-forest transition hover:bg-white/70 xl:inline-flex"
          >
            <InlineIcon name="phone" className="size-4" />
            {phone.display}
          </a>

          <a href="/contact/" className="btn btn-sun hidden px-5 py-2.5 text-[15px] md:inline-flex">
            Demander des renseignements
          </a>

          <a
            href={phone.href}
            aria-label={`Appeler l'école au ${phone.display}`}
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-forest/20 text-forest transition hover:border-forest md:hidden"
          >
            <InlineIcon name="phone" className="size-5" />
          </a>

          <button
            type="button"
            ref={toggleRef}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-principal-mobile"
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-forest/20 text-forest transition hover:border-forest lg:hidden"
          >
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <InlineIcon name={open ? "x" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="menu-principal-mobile"
          className="absolute inset-x-0 top-full z-40 h-[calc(100dvh_-_100%)] overflow-y-auto border-t border-ink/10 bg-cream lg:hidden"
        >
          <nav aria-label="Navigation mobile" className="container-x flex flex-col gap-1 py-5">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? withSlash(pathname) === "/"
                  : withSlash(pathname).startsWith(withSlash(item.href));

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-2xl bg-white px-4 py-3.5 font-display text-lg font-semibold text-forest shadow-sm"
                      : "rounded-2xl px-4 py-3.5 font-display text-lg font-semibold text-ink transition hover:bg-white/70 hover:text-forest"
                  }
                >
                  {item.label}
                </a>
              );
            })}

            <div className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-5">
              <a href="/contact/" onClick={() => setOpen(false)} className="btn btn-sun">
                Demander des renseignements
              </a>
              <a href={phone.href} className="btn btn-outline">
                <InlineIcon name="phone" className="size-5" />
                {phone.display}
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-2 py-2 text-sm font-bold text-ink-soft underline decoration-sage/60 decoration-2 underline-offset-4 hover:text-forest"
              >
                <InlineIcon name="mail" className="size-4" />
                {email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
