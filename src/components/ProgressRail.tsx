import type { ReactNode } from "react";
import { percent, type ChecklistSectionId, type SectionStats } from "../data/checklist";

type Section = Readonly<{
  id: ChecklistSectionId;
  label: string;
  stats: SectionStats;
}>;

type Props = Readonly<{
  labelId: string;
  title: string;
  overall: SectionStats;
  sections: readonly Section[];
  active: ChecklistSectionId;
  onSelect: (id: ChecklistSectionId) => void;
  header?: ReactNode;
  extra?: ReactNode;
}>;

export function ProgressRail({ labelId, title, overall, sections, active, onSelect, header, extra }: Props) {
  const overallPct = percent(overall.done, overall.total);
  return (
    <>
      {header}
      <p className="site-rail-label" id={labelId}>
        {title}
      </p>
      <p className="site-overall">
        <span>{overallPct}%</span>
        <span>
          {overall.done} / {overall.total}
        </span>
      </p>
      <div className="site-bar" aria-hidden="true">
        <span style={{ width: `${overallPct}%` }} />
      </div>
      {extra}
      <nav aria-labelledby={labelId}>
        {sections.map((section) => {
          const done = section.stats.done === section.stats.total;
          return (
            <button
              key={section.id}
              type="button"
              aria-current={active === section.id ? "page" : undefined}
              className={`${active === section.id ? "active" : ""}${done ? " full" : ""}`}
              onClick={() => onSelect(section.id)}
            >
              <span>{section.label}</span>
              <small>
                {section.stats.done}/{section.stats.total}
              </small>
            </button>
          );
        })}
      </nav>
    </>
  );
}
