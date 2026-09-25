import { useEffect } from "react";
import type { ProgressTab } from "../data/checklist";
import { hrefFor, hrefForSection, languageFromPath, siteLanguages, type SitePage } from "../lib/route";

const ORIGIN = "https://ms2checklist.com";

const copy = {
  fr: {
    title: (section: string) => `${section} | Checklist Mortal Shell II`,
    description:
      "Checklist interactive Mortal Shell II : succès, shells, armes, boss, tarstones et plus. Importe ta sauvegarde localement et suis ta progression.",
    forumTitle: "Forum Mortal Shell II | MS2 Checklist",
    forumDescription: "Le forum communautaire de MS2 Checklist arrive bientôt.",
    locale: "fr_FR",
  },
  en: {
    title: (section: string) => `${section} | Mortal Shell II Checklist`,
    description:
      "Interactive Mortal Shell II checklist for achievements, shells, weapons, bosses, tarstones and more. Import your save locally and track progress.",
    forumTitle: "Mortal Shell II Forum | MS2 Checklist",
    forumDescription: "The MS2 Checklist community forum is coming soon.",
    locale: "en_US",
  },
  es: {
    title: (section: string) => `${section} | Checklist de Mortal Shell II`,
    description:
      "Checklist interactiva de Mortal Shell II: logros, shells, armas, jefes, tarstones y más. Importa tu partida localmente y sigue tu progreso.",
    forumTitle: "Foro de Mortal Shell II | MS2 Checklist",
    forumDescription: "El foro de la comunidad de MS2 Checklist estará disponible pronto.",
    locale: "es_ES",
  },
} as const;

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

function setLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
}

export function useSeo(page: SitePage, section: ProgressTab, sectionName: string) {
  useEffect(() => {
    const language = languageFromPath(globalThis.location.pathname);
    const localized = copy[language];
    const isTracker = page === "tracker";
    const title = isTracker ? localized.title(sectionName) : localized.forumTitle;
    const description = isTracker ? localized.description : localized.forumDescription;
    const canonicalPath = isTracker ? hrefForSection(section, language) : hrefFor(page, language);
    const canonical = new URL(canonicalPath, ORIGIN).href;
    const image = `${ORIGIN}/og-image.png`;

    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: isTracker ? "index, follow, max-image-preview:large" : "noindex, follow",
    });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: localized.locale });
    setMeta('meta[property="og:image"]', { property: "og:image", content: image });
    setMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    setMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
    setMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: "Mortal Shell II Checklist" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    setLink('link[rel="canonical"]', { rel: "canonical", href: canonical });

    siteLanguages.forEach((alternateLanguage) => {
      const alternatePath = isTracker
        ? hrefForSection(section, alternateLanguage)
        : hrefFor(page, alternateLanguage);
      setLink(`link[rel="alternate"][hreflang="${alternateLanguage}"]`, {
        rel: "alternate",
        hreflang: alternateLanguage,
        href: new URL(alternatePath, ORIGIN).href,
      });
    });
    setLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: new URL(isTracker ? hrefForSection(section, "fr") : hrefFor(page, "fr"), ORIGIN).href,
    });

    const structuredData = document.querySelector<HTMLScriptElement>("#structured-data");
    if (structuredData && isTracker) {
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "MS2 Checklist",
        url: canonical,
        description,
        applicationCategory: "GameApplication",
        operatingSystem: "Any",
        inLanguage: language,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      });
    }
  }, [page, section, sectionName]);
}
