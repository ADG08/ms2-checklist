import { useTranslation } from "react-i18next";
import { SaveInput } from "./SaveInput";

type Props = Readonly<{
  busy: boolean;
  saveName?: string;
  error?: string | null;
  onFile: (file: File) => Promise<void>;
  onReset: () => void;
}>;

export function SaveActions({ busy, saveName, error, onFile, onReset }: Props) {
  const { t } = useTranslation();

  return (
    <div className="site-save">
      <SaveInput busy={busy} onFile={onFile} className="site-drop" title={t("hero.privacy")}>
        <span>{busy ? t("upload.loading") : t("upload.drop")}</span>
        <small>{saveName ?? ".sav"}</small>
      </SaveInput>
      <button
        type="button"
        onClick={() => {
          if (globalThis.confirm(t("ui.confirmReset"))) {
            onReset();
          }
        }}
      >
        {t("checklist.reset")}
      </button>
      {error ? (
        <p className="site-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
