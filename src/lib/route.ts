export const sitePages = [
  { id: "tracker", path: "/", soon: false },
  { id: "forum", path: "/forum", soon: true },
] as const;

export type SitePage = (typeof sitePages)[number]["id"];
export type UpcomingPage = Extract<(typeof sitePages)[number], { soon: true }>["id"];

export function pageFromPath(pathname: string): SitePage {
  const path = pathname.replace(/\/$/, "") || "/";
  return sitePages.find((page) => page.path === path)?.id ?? "tracker";
}

export function hrefFor(page: SitePage): string {
  return sitePages.find((item) => item.id === page)?.path ?? "/";
}

export function isReady(page: SitePage): boolean {
  return !sitePages.find((item) => item.id === page)?.soon;
}
