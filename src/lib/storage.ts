const KEY = "ms2-checklist";

export type StoredProgress = Readonly<{
  checked: Record<string, boolean>;
  saveName?: string;
  updatedAt: string;
}>;

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { checked: {}, updatedAt: new Date().toISOString() };
    }
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      checked: parsed.checked ?? {},
      saveName: parsed.saveName,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return { checked: {}, updatedAt: new Date().toISOString() };
  }
}

export function saveProgress(progress: StoredProgress): void {
  localStorage.setItem(KEY, JSON.stringify(progress));
}
