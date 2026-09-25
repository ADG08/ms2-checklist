import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AchievementToast } from "../hooks/useTracker";

type Props = Readonly<{
  toasts: readonly AchievementToast[];
  onDismiss: (key: string) => void;
}>;

export function AchievementToasts({ toasts, onDismiss }: Props) {
  const { t } = useTranslation();
  const current = toasts[0];
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!current) {
      return;
    }
    setLeaving(false);
    const hold = window.setTimeout(() => setLeaving(true), 3600);
    return () => window.clearTimeout(hold);
  }, [current?.key]);

  useEffect(() => {
    if (!current || !leaving) {
      return;
    }
    const done = window.setTimeout(() => onDismiss(current.key), 420);
    return () => window.clearTimeout(done);
  }, [current, leaving, onDismiss]);

  if (!current) {
    return null;
  }

  return (
    <div
      className={`site-toast${leaving ? " leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <button type="button" onClick={() => setLeaving(true)}>
        <span className="site-toast-icon" aria-hidden="true">
          <img src={current.image ?? "/logo-checklist.webp"} alt="" />
        </span>
        <span className="site-toast-copy">
          <small>{t("toast.unlocked")}</small>
          <strong>{t(`items.${current.id}.name`, { defaultValue: current.name })}</strong>
          {current.description || t(`items.${current.id}.description`, { defaultValue: "" }) ? (
            <em>{t(`items.${current.id}.description`, { defaultValue: current.description ?? "" })}</em>
          ) : null}
        </span>
      </button>
    </div>
  );
}
