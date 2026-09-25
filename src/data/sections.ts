export type SectionDef = Readonly<{
  id: string;
  imageFolder?: string;
  replaceOnImport?: boolean;
  groups?: readonly string[];
  overall?: boolean;
}>;

export const sectionCatalog = [
  { id: "shell", imageFolder: "shells" },
  { id: "weapon", imageFolder: "weapons" },
  { id: "sidearm", imageFolder: "sidearms" },
  { id: "beacon" },
  { id: "tarstone", imageFolder: "tarstones", replaceOnImport: true, groups: ["Support", "Combat", "Infusion", "Ability"] },
  { id: "boss" },
  { id: "fragment" },
  { id: "achievements", imageFolder: "achievements", overall: true },
] as const satisfies readonly SectionDef[];

export type ChecklistSectionId = (typeof sectionCatalog)[number]["id"];

export const checklistSections = sectionCatalog.map((section) => section.id);
export const progressTabs = checklistSections;

const byId = new Map<string, SectionDef>(sectionCatalog.map((section) => [section.id, section]));

export const overallSection =
  sectionCatalog.find((section) => "overall" in section && section.overall)?.id ?? checklistSections[0];

export function sectionDef(id: ChecklistSectionId): SectionDef {
  return byId.get(id) ?? { id };
}

export function emptySectionRecord<T>(value: () => T): Record<ChecklistSectionId, T> {
  return Object.fromEntries(checklistSections.map((id) => [id, value()])) as Record<ChecklistSectionId, T>;
}

export function sectionImage(kind: string, file: string): string | undefined {
  const folder = byId.get(kind as ChecklistSectionId)?.imageFolder;
  return folder ? `/${folder}/${file}.webp` : undefined;
}

export function replaceOnImport(section: ChecklistSectionId): boolean {
  return Boolean(byId.get(section)?.replaceOnImport);
}

export function sectionGroups(section: ChecklistSectionId): readonly string[] {
  return byId.get(section)?.groups ?? [];
}
