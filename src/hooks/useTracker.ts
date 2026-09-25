import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { achievementById, allSectionStats, overallSection } from "../data/checklist";
import { idsFromSave, mergeSaveChecks, toastIdsForToggle, withDerivedChecks } from "../data/rules";
import { loadProgress, saveProgress } from "../lib/storage";
import { extractSave, isGvas } from "../parser/extract";

export type AchievementToast = Readonly<{
  key: string;
  id: string;
  name: string;
  description?: string;
  image?: string;
}>;

function toastsFor(ids: readonly string[]): AchievementToast[] {
  return ids.map((id) => {
    const item = achievementById.get(id);
    return {
      key: `${id}-${crypto.randomUUID()}`,
      id,
      name: item?.name ?? id,
      description: item?.description,
      image: item?.image,
    };
  });
}

export function useTracker() {
  const { t } = useTranslation();
  const stored = useMemo(() => loadProgress(), []);
  const [checked, setChecked] = useState(() => withDerivedChecks(stored.checked).checked);
  const [saveName, setSaveName] = useState(stored.saveName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const checkedRef = useRef(checked);
  checkedRef.current = checked;

  useEffect(() => {
    saveProgress({ checked, saveName, updatedAt: new Date().toISOString() });
  }, [checked, saveName]);

  const dismissToast = useCallback((key: string) => {
    setToasts((current) => current.filter((toast) => toast.key !== key));
  }, []);

  const toggle = useCallback((id: string) => {
    const current = checkedRef.current;
    const flipped = { ...current, [id]: !current[id] };
    if (!flipped[id]) {
      setChecked(flipped);
      return;
    }
    const next = withDerivedChecks(flipped);
    const unlocked = toastIdsForToggle(id, next.unlocked);
    setChecked(next.checked);
    if (unlocked.length > 0) {
      setToasts((currentToasts) => [...currentToasts, ...toastsFor(unlocked)]);
    }
  }, []);

  const importSave = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);
      try {
        const data = new Uint8Array(await file.arrayBuffer());
        if (!isGvas(data)) {
          throw new Error(t("errors.notGvas"));
        }
        setChecked((current) => mergeSaveChecks(current, idsFromSave(extractSave(data))));
        setSaveName(file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.upload"));
      } finally {
        setBusy(false);
      }
    },
    [t],
  );

  const reset = useCallback(() => {
    setChecked({});
    setSaveName(undefined);
    setToasts([]);
  }, []);

  const stats = useMemo(() => allSectionStats(checked), [checked]);

  return {
    checked,
    saveName,
    busy,
    error,
    toasts,
    stats,
    overall: stats[overallSection],
    toggle,
    importSave,
    reset,
    dismissToast,
  };
}

export type Tracker = ReturnType<typeof useTracker>;
