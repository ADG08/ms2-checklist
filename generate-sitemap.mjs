import { writeFile } from "node:fs/promises";

const origin = "https://ms2checklist.com";
const languages = ["fr", "en", "es"];
const sections = ["", "weapons", "sidearms", "beacons", "tarstones", "bosses", "fragments", "achievements"];

function url(language, section) {
  const prefix = language === "fr" ? "" : `/${language}`;
  return section ? `${origin}${prefix}/${section}` : `${origin}${prefix}/`;
}

const entries = sections.flatMap((section) =>
  languages.map((language) => {
    const alternates = languages
      .map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${url(alternate, section)}" />`,
      )
      .join("\n");

    return `  <url>
    <loc>${url(language, section)}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url("fr", section)}" />
    <changefreq>weekly</changefreq>
    <priority>${section === "" || section === "achievements" ? "1.0" : "0.9"}</priority>
  </url>`;
  }),
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

await writeFile(new URL("./public/sitemap.xml", import.meta.url), sitemap);
