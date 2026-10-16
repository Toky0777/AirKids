/**
 * Formulaire de contact — deux modes honnêtes :
 *
 * 1. « Endpoint » (mode production) : si la variable d'environnement
 *    PUBLIC_CONTACT_ENDPOINT est définie, la demande est envoyée en JSON (POST)
 *    à cette adresse. La confirmation n'apparaît qu'en cas de réponse HTTP
 *    réussie — aucun envoi n'est simulé.
 * 2. « Courrier » (mode par défaut, sans backend) : le formulaire ouvre
 *    l'application de messagerie du visiteur avec le message pré-rempli.
 *    Aucune donnée n'est transmise à un serveur par le site lui-même.
 *
 * Protection anti-pourriel : champ piège invisible + délai minimal de saisie.
 * Aucune clé, aucun secret et aucun identifiant ne sont exposés côté client.
 */
import { useEffect, useMemo, useRef, useState, type SubmitEvent } from "react";

interface Props {
  email: string;
  serviceOptions: string[];
  phoneDisplay: string;
  phoneHref: string;
}

interface FormValues {
  parentName: string;
  contact: string;
  service: string;
  childAge: string;
  message: string;
  consent: boolean;
  trap: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "mailto"; href: string }
  | { kind: "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const initialValues: FormValues = {
  parentName: "",
  contact: "",
  service: "",
  childAge: "",
  message: "",
  consent: false,
  trap: "",
};

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (values.parentName.trim().length < 2) {
    errors.parentName = "Indiquez votre nom (2 caractères minimum).";
  }

  const contact = values.contact.trim();
  if (!contact) {
    errors.contact = "Indiquez un e-mail ou un numéro de téléphone.";
  } else {
    const looksLikeEmail = contact.includes("@");
    const digits = contact.replace(/[^\d]/g, "");
    if (looksLikeEmail && !EMAIL_PATTERN.test(contact)) {
      errors.contact = "Cette adresse e-mail ne semble pas valide.";
    } else if (!looksLikeEmail && digits.length < 7) {
      errors.contact = "Ce numéro de téléphone ne semble pas valide.";
    }
  }

  if (!values.service) {
    errors.service = "Choisissez le service qui vous intéresse.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Décrivez votre demande en quelques mots (10 caractères minimum).";
  }

  if (!values.consent) {
    errors.consent = "Merci d'accepter le traitement de votre demande.";
  }

  return errors;
}

export default function ContactForm({ email, serviceOptions, phoneDisplay, phoneHref }: Props) {
  const endpoint = (import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? "").trim();
  const usesEndpoint = endpoint.length > 0;

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const mailtoHref = useMemo(() => {
    const subject = `Demande de renseignements — ${values.service || "Air Kids"} — ${values.parentName || "Famille"}`;
    const body = [
      `Nom du parent : ${values.parentName}`,
      `Contact : ${values.contact}`,
      `Service recherché : ${values.service}`,
      values.childAge ? `Âge de l'enfant : ${values.childAge}` : null,
      "",
      values.message,
    ]
      .filter((line) => line !== null)
      .join("\n");
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [email, values]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // Champ piège et délai minimal : les robots sont ignorés silencieusement.
    const elapsed = Date.now() - startedAt.current;
    if (values.trap !== "" || elapsed < 3000) {
      setStatus({ kind: "success" });
      return;
    }

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus({ kind: "idle" });
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    if (!usesEndpoint) {
      setStatus({ kind: "mailto", href: mailtoHref });
      window.location.href = mailtoHref;
      return;
    }

    setStatus({ kind: "sending" });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          parentName: values.parentName,
          contact: values.contact,
          service: values.service,
          childAge: values.childAge,
          message: values.message,
          consent: values.consent,
          page: window.location.href,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Réponse inattendue : ${response.status}`);
      }

      setValues(initialValues);
      setStatus({ kind: "success" });
      startedAt.current = Date.now();
    } catch {
      setStatus({
        kind: "error",
        message:
          "L'envoi n'a pas abouti (connexion interrompue ou service indisponible). Votre message n'a pas été envoyé : réessayez dans un instant ou écrivez-nous directement.",
      });
    } finally {
      window.clearTimeout(controller.signal.aborted ? 0 : timeout);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-card sm:p-8">
      <p className="flex items-start gap-2 rounded-2xl bg-sky/15 px-4 py-3 text-sm text-ink-soft">
        <span aria-hidden="true" className="mt-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-sky-deep">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </span>
        <span>
          {usesEndpoint
            ? "Votre demande est envoyée directement à l'établissement. La confirmation s'affiche uniquement lorsque l'envoi a bien abouti."
            : "Ce formulaire ouvre votre application de messagerie avec un message pré-rempli : vérifiez-le puis envoyez-le. Vous pouvez aussi nous appeler ou nous écrire par e-mail."}
        </span>
      </p>

      {status.kind === "success" && (
        <p role="status" className="mt-5 rounded-2xl bg-sage/20 px-4 py-3 font-semibold text-ink">
          Merci ! Votre demande a bien été transmise. L'équipe d'Air Kids vous répondra dans les
          meilleurs délais.
        </p>
      )}

      {status.kind === "mailto" && (
        <div role="status" className="mt-5 rounded-2xl bg-sun/25 px-4 py-3 text-ink">
          <p className="font-semibold">
            Votre logiciel de messagerie devrait s'ouvrir avec votre message pré-rempli.
          </p>
          <p className="mt-1 text-sm">
            S'il ne s'ouvre pas,{" "}
            <a href={status.href} className="font-bold underline decoration-2 underline-offset-4">
              cliquez ici pour ouvrir le message
            </a>{" "}
            ou écrivez directement à{" "}
            <a href={`mailto:${email}`} className="font-bold underline decoration-2 underline-offset-4">
              {email}
            </a>
            .
          </p>
        </div>
      )}

      {status.kind === "error" && (
        <p role="alert" className="mt-5 rounded-2xl bg-coral/20 px-4 py-3 font-semibold text-ink">
          {status.message}{" "}
          <a href={`mailto:${email}`} className="underline decoration-2 underline-offset-4">
            Écrire à {email}
          </a>
        </p>
      )}

      {hasErrors && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-2xl border-2 border-coral-deep/40 bg-coral/10 px-4 py-3 text-ink"
        >
          <p className="font-bold">Merci de corriger les points suivants :</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="parent-name" className="field-label">
            Nom du parent <span aria-hidden="true">*</span>
            <span className="sr-only"> (obligatoire)</span>
          </label>
          <input
            id="parent-name"
            name="parentName"
            type="text"
            autoComplete="name"
            className="field-input"
            value={values.parentName}
            onChange={(event) => update("parentName", event.target.value)}
            aria-invalid={Boolean(errors.parentName)}
            aria-describedby={errors.parentName ? "error-parent-name" : undefined}
            placeholder="Votre nom et prénom"
          />
          {errors.parentName && (
            <p id="error-parent-name" className="field-error">
              {errors.parentName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="field-label">
            Email ou téléphone <span aria-hidden="true">*</span>
            <span className="sr-only"> (obligatoire)</span>
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            autoComplete="email"
            className="field-input"
            value={values.contact}
            onChange={(event) => update("contact", event.target.value)}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "error-contact" : undefined}
            placeholder="vous@exemple.com ou 034 xx xxx xx"
          />
          {errors.contact && (
            <p id="error-contact" className="field-error">
              {errors.contact}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="service" className="field-label">
            Service recherché <span aria-hidden="true">*</span>
            <span className="sr-only"> (obligatoire)</span>
          </label>
          <select
            id="service"
            name="service"
            className="field-input"
            value={values.service}
            onChange={(event) => update("service", event.target.value)}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "error-service" : undefined}
          >
            <option value="">Choisir…</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id="error-service" className="field-error">
              {errors.service}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="child-age" className="field-label">
            Âge de l'enfant <span className="font-normal text-ink-soft">(facultatif)</span>
          </label>
          <input
            id="child-age"
            name="childAge"
            type="text"
            className="field-input"
            value={values.childAge}
            onChange={(event) => update("childAge", event.target.value)}
            placeholder="Ex. : 18 mois"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="field-label">
            Votre message <span aria-hidden="true">*</span>
            <span className="sr-only"> (obligatoire)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="field-input"
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "error-message" : undefined}
            placeholder="Parlez-nous de votre enfant, de la section souhaitée, de la période d'inscription…"
          />
          {errors.message && (
            <p id="error-message" className="field-error">
              {errors.message}
            </p>
          )}
        </div>

        {/* Champ piège : masqué aux visiteurs, ciblé par les robots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="trap">Ne pas remplir ce champ</label>
          <input
            id="trap"
            name="trap"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.trap}
            onChange={(event) => update("trap", event.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="consent" className="flex items-start gap-3 text-sm text-ink-soft">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              className="mt-1 size-5 shrink-0 rounded border-2 border-ink/20 accent-[#315b43]"
              checked={values.consent}
              onChange={(event) => update("consent", event.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "error-consent" : undefined}
            />
            <span>
              J'accepte que les informations saisies soient utilisées pour répondre à ma demande.
              Elles ne sont ni cédées ni utilisées à d'autres fins.{" "}
              <a href="/confidentialite/" className="font-bold text-forest underline underline-offset-4">
                Politique de confidentialité
              </a>
            </span>
          </label>
          {errors.consent && (
            <p id="error-consent" className="field-error">
              {errors.consent}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
            {status.kind === "sending" ? (
              <>
                <span className="size-5 animate-spin rounded-full border-2 border-cream/40 border-t-cream" aria-hidden="true" />
                Envoi en cours…
              </>
            ) : (
              <>
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </span>
                Envoyer ma demande
              </>
            )}
          </button>

          <p className="text-sm text-ink-soft">
            Ou appelez-nous :{" "}
            <a href={phoneHref} className="font-bold text-forest underline underline-offset-4">
              {phoneDisplay}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
