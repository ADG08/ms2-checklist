export const sitePages = [
  { id: "tracker", path: "/", soon: false },
  { id: "forum", path: "/forum", soon: true },
] as const;

export type SitePage = (typeof sitePages)[number]["id"];
export type UpcomingPage = Extract<(typeof sitePages)[number], { soon: true }>["id"];
export const siteLanguages = ["fr", "en", "es"] as const;
export type SiteLanguage = (typeof siteLanguages)[number];
export const sectionPaths = {
  shell: "",
  weapon: "weapons",
  sidearm: "sidearms",
  beacon: "beacons",
  tarstone: "tarstones",
  boss: "bosses",
  fragment: "fragments",
  achievements: "achievements",
} as const;
export type RoutedSection = keyof typeof sectionPaths;

export function languageFromPath(pathname: string): SiteLanguage {
  const language = pathname.split("/").find(Boolean);
  return siteLanguages.includes(language as SiteLanguage) ? (language as SiteLanguage) : "fr";
}

function pathWithoutLanguage(pathname: string): string {
  const language = languageFromPath(pathname);
  if (language === "fr") return pathname;

  const path = pathname.replace(new RegExp(`^/${language}(?=/|$)`), "");
  return path || "/";
}

export function pageFromPath(pathname: string): SitePage {
  const path = pathWithoutLanguage(pathname).replace(/\/$/, "") || "/";
  if (Object.values(sectionPaths).some((sectionPath) => path === `/${sectionPath}`)) return "tracker";
  return sitePages.find((page) => page.path === path)?.id ?? "tracker";
}

export function hrefFor(page: SitePage, language: SiteLanguage = "fr"): string {
  const path = sitePages.find((item) => item.id === page)?.path ?? "/";
  if (language === "fr") return path;
  return path === "/" ? `/${language}/` : `/${language}${path}`;
}

export function sectionFromPath(pathname: string): RoutedSection {
  const path = pathWithoutLanguage(pathname).replace(/^\/|\/$/g, "");
  const match = Object.entries(sectionPaths).find(([, sectionPath]) => sectionPath === path);
  return (match?.[0] as RoutedSection | undefined) ?? "shell";
}

export function hrefForSection(section: RoutedSection, language: SiteLanguage = "fr"): string {
  const prefix = language === "fr" ? "" : `/${language}`;
  const sectionPath = sectionPaths[section];
  return sectionPath ? `${prefix}/${sectionPath}` : `${prefix}/`;
}

export function isReady(page: SitePage): boolean {
  return !sitePages.find((item) => item.id === page)?.soon;
}
