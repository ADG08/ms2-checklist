import { useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  filterItems,
  groupsForSection,
  isMissable,
  type ChecklistItem,
  type ChecklistSectionId,
  type SectionStats,
} from "../data/checklist";
import { itemDescription, itemName, itemSearchText, itemWarning } from "../lib/itemText";

type Props = Readonly<{
  section: ChecklistSectionId;
  title: string;
  items: readonly ChecklistItem[];
  checked: Record<string, boolean>;
  stats: SectionStats;
  onToggle: (id: string) => void;
}>;

export function Checklist({ section, title, items, checked, stats, onToggle }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const [missableOnly, setMissableOnly] = useState(false);
  const [forced, setForced] = useState<Record<string, boolean>>({});
  const searchId = useId();
  const searching = query.trim().length > 0;
  const hasMissables = items.some(isMissable);
  const visible = useMemo(
    () => filterItems(items, checked, hideDone, query, (item) => itemSearchText(t, item), missableOnly),
    [items, checked, hideDone, query, t, missableOnly],
  );
  const groups = useMemo(() => groupsForSection(section, visible), [section, visible]);

  useEffect(() => {
    setForced({});
    setQuery("");
    setMissableOnly(false);
  }, [section]);

  const subtitle = stats.done === stats.total ? t("ui.complete") : t("ui.remaining", { count: stats.total - stats.done });

  return (
    <>
      <header className="site-head">
        <div>
          <h1>{t("checklist.heading", { section: title })}</h1>
          <p className="site-intro">{t("checklist.intro")}</p>
          <div className="site-head-meta">
            <p>{subtitle}</p>
            <button type="button" className="site-hide" aria-pressed={hideDone} onClick={() => setHideDone((value) => !value)}>
              {t("checklist.hideDone")}
            </button>
            {hasMissables ? (
              <button
                type="button"
                className="site-hide"
                aria-pressed={missableOnly}
                onClick={() => setMissableOnly((value) => !value)}
              >
                {t("checklist.onlyMissable")}
              </button>
            ) : null}
          </div>
        </div>
        <div className="site-tools">
          <label htmlFor={searchId} className="sr-only">
            {t("checklist.search")}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder={t("checklist.search")}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </header>

      {groups.map((group) => {
        if (hideDone && group.items.length === 0) {
          return null;
        }
        if (group.id === null) {
          return <ItemList key="flat" items={group.items} checked={checked} onToggle={onToggle} />;
        }
        const full = items.filter((item) => item.group === group.id);
        const done = full.filter((item) => checked[item.id]).length;
        const complete = full.length > 0 && done === full.length;
        const open = searching || hideDone || (forced[group.id] ?? !complete);
        const label = t(`checklist.groups.${group.id}`, { defaultValue: group.id });
        return (
          <section key={group.id} className={`site-group${complete ? " full" : ""}`}>
            <h2>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setForced((current) => ({ ...current, [group.id!]: !open }))}
              >
                <span>{label}</span>
                <small>
                  {done}/{full.length}
                </small>
              </button>
            </h2>
            {open ? <ItemList items={group.items} checked={checked} onToggle={onToggle} /> : null}
          </section>
        );
      })}
      {visible.length === 0 ? (
        <p className="site-empty">{hideDone && stats.done === stats.total ? t("checklist.allDone") : t("checklist.empty")}</p>
      ) : null}
      <section className="site-seo">
        <h2>{t("seo.title")}</h2>
        <p>{t("seo.description")}</p>
        <div>
          <article>
            <h3>{t("seo.achievementsTitle")}</h3>
            <p>{t("seo.achievementsText")}</p>
          </article>
          <article>
            <h3>{t("seo.saveTitle")}</h3>
            <p>{t("seo.saveText")}</p>
          </article>
          <article>
            <h3>{t("seo.communityTitle")}</h3>
            <p>{t("seo.communityText")}</p>
          </article>
        </div>
      </section>
    </>
  );
}

function ItemList({
  items,
  checked,
  onToggle,
}: Readonly<{
  items: readonly ChecklistItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}>) {
  const { t } = useTranslation();
  return (
    <ul className="site-list">
      {items.map((item) => {
        const done = Boolean(checked[item.id]);
        const description = itemDescription(t, item);
        const warning = itemWarning(t, item);
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={done}
              className={`${done ? "done" : ""}${item.image ? " has-icon" : ""}${isMissable(item) ? " missable" : ""}`.trim()}
              onClick={() => onToggle(item.id)}
            >
              {item.image ? <LazyIcon src={item.image} /> : <span className="site-mark" aria-hidden="true" />}
              <span className="site-item">
                <span className="site-name">{itemName(t, item)}</span>
                {description ? <span className="site-desc">{description}</span> : null}
                {warning ? <span className="site-note">{warning}</span> : null}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function LazyIcon({ src }: Readonly<{ src: string }>) {
  const [ready, setReady] = useState(false);
  return (
    <span className={`site-icon-wrap${ready ? " ready" : ""}`} aria-hidden="true">
      <img
        className="site-icon"
        src={src}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
        onError={() => setReady(true)}
      />
    </span>
  );
}
