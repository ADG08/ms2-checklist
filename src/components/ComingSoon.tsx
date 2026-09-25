import { useTranslation } from "react-i18next";
import type { UpcomingPage } from "../lib/route";

export function ComingSoon({ page }: Readonly<{ page: UpcomingPage }>) {
  const { t } = useTranslation();
  return (
    <section className="site-coming">
      <p className="site-kicker">{t("nav.soon")}</p>
      <h1>{t(`nav.${page}`)}</h1>
      <p>{t(`coming.${page}`)}</p>
    </section>
  );
}
