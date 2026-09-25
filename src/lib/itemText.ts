import type { TFunction } from "i18next";
import type { ChecklistItem } from "../data/checklist";

export function itemName(t: TFunction, item: Pick<ChecklistItem, "id" | "name">): string {
  return t(`items.${item.id}.name`, { defaultValue: item.name });
}

export function itemDescription(
  t: TFunction,
  item: Pick<ChecklistItem, "id" | "description">,
): string | undefined {
  const value = t(`items.${item.id}.description`, { defaultValue: item.description ?? "" });
  return value || undefined;
}

export function itemWarning(
  t: TFunction,
  item: Pick<ChecklistItem, "id" | "warning" | "warningBefore">,
): string | undefined {
  const text = t(`items.${item.id}.warning`, { defaultValue: item.warning ?? "" });
  if (!text) {
    return undefined;
  }
  const when = t(`items.${item.id}.warningBefore`, { defaultValue: item.warningBefore ?? "" });
  return when ? t("checklist.before", { when, text, defaultValue: `${text} (${when})` }) : text;
}

export function itemSearchText(t: TFunction, item: ChecklistItem): string {
  return [
    item.name,
    item.description ?? "",
    item.group ?? "",
    item.warning ?? "",
    item.warningBefore ?? "",
    ...(item.aliases ?? []),
    itemName(t, item),
    itemDescription(t, item) ?? "",
    itemWarning(t, item) ?? "",
    item.group ? t(`checklist.groups.${item.group}`, { defaultValue: item.group }) : "",
  ]
    .join(" ")
    .toLowerCase();
}
