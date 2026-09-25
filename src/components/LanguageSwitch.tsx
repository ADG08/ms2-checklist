import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const LANGUAGES = Object.keys(i18n.options.resources ?? { fr: true, en: true, es: true });
const STORAGE_KEY = "ms2-language";

export function LanguageSwitch() {
  const { i18n: instance } = useTranslation();
  const current = instance.resolvedLanguage ?? "fr";

  return (
    <span className="site-langs">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          aria-current={current === lang ? "true" : undefined}
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, lang);
            void instance.changeLanguage(lang);
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </span>
  );
}
