import { useTranslation } from "react-i18next";
import { itemsBySection, progressTabs } from "../data/checklist";
import { hrefForSection, languageFromPath } from "../lib/route";

export function Home() {
  const { t } = useTranslation();
  const language = languageFromPath(globalThis.location.pathname);

  return (
    <div className="site-home">
      <section className="site-home-hero">
        <p className="site-kicker">{t("home.kicker")}</p>
        <h1>{t("home.title")}</h1>
        <p>{t("home.intro")}</p>
        <a className="site-home-cta" href={hrefForSection("shell", language)}>
          {t("home.cta")}
        </a>
      </section>

      <section className="site-home-sections" aria-labelledby="home-sections-title">
        <h2 id="home-sections-title">{t("home.sectionsTitle")}</h2>
        <div>
          {progressTabs.map((section) => (
            <a key={section} href={hrefForSection(section, language)}>
              <span>{t(`checklist.sections.${section}`)}</span>
              <small>{t("home.itemCount", { count: itemsBySection[section].length })}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="site-home-about">
        <h2>{t("home.aboutTitle")}</h2>
        <p>{t("home.aboutText")}</p>
      </section>
    </div>
  );
}
