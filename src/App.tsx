import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { AchievementToasts } from "./components/AchievementToasts";
import { Checklist } from "./components/Checklist";
import { ComingSoon } from "./components/ComingSoon";
import { Home } from "./components/Home";
import { LanguageSwitch } from "./components/LanguageSwitch";
import { ProgressRail } from "./components/ProgressRail";
import { SaveActions } from "./components/SaveActions";
import { itemsBySection, progressTabs, type ProgressTab } from "./data/checklist";
import { useSeo } from "./hooks/useSeo";
import { useTracker } from "./hooks/useTracker";
import { hrefFor, hrefForSection, languageFromPath, pageFromPath, sectionFromPath, sitePages } from "./lib/route";

export function App() {
  const { t, i18n } = useTranslation();
  const tracker = useTracker();
  const page = pageFromPath(globalThis.location.pathname);
  const language = languageFromPath(globalThis.location.pathname);
  const [tab, setTab] = useState<ProgressTab>(() => sectionFromPath(globalThis.location.pathname));
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const trackerPage = page === "tracker";
  const sectionName = t(`checklist.sections.${tab}`);
  useSeo(page, tab, sectionName);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "fr";
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPopState = () => setTab(sectionFromPath(globalThis.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [page, tab]);

  useEffect(() => {
    document.body.classList.toggle("rail-open", open);
    return () => document.body.classList.remove("rail-open");
  }, [open]);

  return (
    <>
      <a className="site-skip" href="#content">
        {t("nav.skip")}
      </a>

      <header className="site-top">
        <a className="site-logo" href={hrefFor("home", language)} aria-label="MS2 Checklist">
          <img src="/logo-checklist.webp" alt="" width="97" height="54" />
        </a>
        <nav className="site-topnav" aria-label={t("nav.site")}>
          {sitePages.map((item) => (
            <a key={item.id} href={hrefFor(item.id, language)} aria-current={page === item.id ? "page" : undefined}>
              {t(`nav.${item.id}`)}
              {item.soon ? <small>{t("nav.soon")}</small> : null}
            </a>
          ))}
        </nav>
        {trackerPage ? (
          <button
            type="button"
            className="site-menu"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={`site-burger${open ? " open" : ""}`} aria-hidden="true" />
          </button>
        ) : null}
        <LanguageSwitch />
      </header>

      <div className={`site-body${trackerPage ? " has-rail" : ""}`}>
        {trackerPage ? (
          <>
            {open ? <button type="button" className="site-scrim" aria-label={t("nav.close")} onClick={() => setOpen(false)} /> : null}
            <aside id={menuId} className={`site-rail${open ? " open" : ""}`}>
              <ProgressRail
                labelId={`${menuId}-label`}
                title={t("nav.progress")}
                overall={tracker.overall}
                active={tab}
                onSelect={(section) => {
                  setTab(section);
                  globalThis.history.pushState(null, "", hrefForSection(section, language));
                }}
                header={
                  <SaveActions
                    busy={tracker.busy}
                    saveName={tracker.saveName}
                    error={tracker.error}
                    onFile={tracker.importSave}
                    onReset={tracker.reset}
                  />
                }
                extra={
                  <nav className="site-rail-pages" aria-label={t("nav.site")}>
                    {sitePages.map((item) => (
                      <a key={item.id} href={hrefFor(item.id, language)} aria-current={page === item.id ? "page" : undefined}>
                        {t(`nav.${item.id}`)}
                      </a>
                    ))}
                  </nav>
                }
                sections={progressTabs.map((item) => ({
                  id: item,
                  label: t(`checklist.sections.${item}`),
                  stats: tracker.stats[item],
                }))}
              />
            </aside>
          </>
        ) : null}

        <main id="content" className="site-main" tabIndex={-1}>
          {page === "home" ? (
            <Home />
          ) : page === "tracker" ? (
            <Checklist
              section={tab}
              title={sectionName}
              items={itemsBySection[tab]}
              checked={tracker.checked}
              stats={tracker.stats[tab]}
              onToggle={tracker.toggle}
            />
          ) : (
            <ComingSoon page={page} />
          )}
        </main>
      </div>
      <AchievementToasts toasts={tracker.toasts} onDismiss={tracker.dismissToast} />
    </>
  );
}
