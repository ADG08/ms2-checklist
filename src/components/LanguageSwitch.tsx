import { useTranslation } from "react-i18next";
import { hrefFor, hrefForSection, pageFromPath, sectionFromPath, siteLanguages } from "../lib/route";

const STORAGE_KEY = "ms2-language";

export function LanguageSwitch() {
  const { i18n: instance } = useTranslation();
  const current = instance.resolvedLanguage ?? "fr";
  const page = pageFromPath(globalThis.location.pathname);
  const section = sectionFromPath(globalThis.location.pathname);

  return (
    <span className="site-langs">
      {siteLanguages.map((lang) => (
        <a
          key={lang}
          aria-current={current === lang ? "true" : undefined}
          href={page === "tracker" ? hrefForSection(section, lang) : hrefFor(page, lang)}
          hrefLang={lang}
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, lang);
          }}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </span>
  );
}
