import achievements from "./achievements.json";
import { mapPins, type MapPinKind } from "./pins";
import {
  checklistSections,
  emptySectionRecord,
  sectionGroups,
  sectionImage,
  type ChecklistSectionId,
} from "./sections";

export type ChecklistKind = "achievement" | MapPinKind;
export type { ChecklistSectionId } from "./sections";
export type ProgressTab = ChecklistSectionId;
export { checklistSections, overallSection, progressTabs } from "./sections";

export type ChecklistItem = Readonly<{
  id: string;
  kind: ChecklistKind;
  section: ChecklistSectionId;
  name: string;
  description?: string;
  missable?: boolean;
  warning?: string;
  warningBefore?: string;
  secret?: boolean;
  aliases?: readonly string[];
  group?: string;
  image?: string;
  achievementId?: string;
}>;

export type SectionStats = Readonly<{ done: number; total: number }>;

export const checklistItems: readonly ChecklistItem[] = [
  ...achievements.map((item) => ({
    id: `ach-${item.id}`,
    kind: "achievement" as const,
    section: "achievements" as const,
    name: item.title,
    description: item.description,
    missable: Boolean(item.missable || item.warning || item.category === "missable"),
    warning: item.warning?.message,
    warningBefore: item.warning?.before,
    secret: item.secret,
    achievementId: item.id,
    image: sectionImage("achievements", item.id),
  })),
  ...mapPins.map((pin) => ({
    id: pin.id,
    kind: pin.kind,
    section: pin.kind,
    name: pin.name,
    aliases: pin.aliases,
    group: pin.group,
    description: pin.description,
    missable: pin.missable,
    image: sectionImage(pin.kind, pin.id.slice(pin.kind.length + 1)),
    achievementId: pin.achievementId,
  })),
];

export const itemsBySection = groupBySection(checklistItems);

function groupBySection(items: readonly ChecklistItem[]): Record<ChecklistSectionId, ChecklistItem[]> {
  const groups = emptySectionRecord<ChecklistItem[]>(() => []);
  for (const item of items) {
    groups[item.section].push(item);
  }
  return groups;
}

export const achievementById = new Map(
  checklistItems.filter((item) => item.kind === "achievement").map((item) => [item.id, item]),
);

export function sectionStats(
  items: readonly ChecklistItem[],
  checked: Record<string, boolean>,
): SectionStats {
  let done = 0;
  for (const item of items) {
    if (checked[item.id]) {
      done += 1;
    }
  }
  return { done, total: items.length };
}

export function allSectionStats(checked: Record<string, boolean>): Record<ChecklistSectionId, SectionStats> {
  return Object.fromEntries(
    checklistSections.map((section) => [section, sectionStats(itemsBySection[section], checked)]),
  ) as Record<ChecklistSectionId, SectionStats>;
}

export function isMissable(item: Pick<ChecklistItem, "missable" | "warning">): boolean {
  return Boolean(item.missable || item.warning);
}

export function filterItems(
  items: readonly ChecklistItem[],
  checked: Record<string, boolean>,
  hideDone: boolean,
  query: string,
  searchText: (item: ChecklistItem) => string,
  missableOnly = false,
): ChecklistItem[] {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    if (hideDone && checked[item.id]) {
      return false;
    }
    if (missableOnly && !isMissable(item)) {
      return false;
    }
    return !needle || searchText(item).includes(needle);
  });
}

export type ChecklistGroup = Readonly<{
  id: string | null;
  items: ChecklistItem[];
}>;

export function groupedItems(items: readonly ChecklistItem[], order: readonly string[] = []): ChecklistGroup[] {
  if (!items.some((item) => item.group)) {
    return [{ id: null, items: [...items] }];
  }
  const buckets = new Map<string, ChecklistItem[]>();
  for (const item of items) {
    const key = item.group ?? "other";
    const list = buckets.get(key);
    if (list) {
      list.push(item);
    } else {
      buckets.set(key, [item]);
    }
  }
  const keys = [
    ...order.filter((key) => buckets.has(key)),
    ...[...buckets.keys()].filter((key) => !order.includes(key)).sort((a, b) => a.localeCompare(b)),
  ];
  return keys.map((id) => ({ id, items: buckets.get(id) ?? [] }));
}

export function groupsForSection(section: ChecklistSectionId, items: readonly ChecklistItem[]): ChecklistGroup[] {
  return groupedItems(items, sectionGroups(section));
}

export function percent(done: number, total: number): number {
  return total ? Math.floor((done / total) * 100) : 0;
}
