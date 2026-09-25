import { useState, type DragEvent, type ReactNode } from "react";

type Props = Readonly<{
  busy: boolean;
  onFile: (file: File) => Promise<void>;
  className?: string;
  title?: string;
  children: ReactNode;
}>;

export function SaveInput({ busy, onFile, className, title, children }: Props) {
  const [over, setOver] = useState(false);

  const take = (file: File | undefined) => {
    if (file) {
      void onFile(file);
    }
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setOver(false);
    take(event.dataTransfer.files[0]);
  };

  return (
    <label
      className={`${className ?? ""}${busy ? " busy" : ""}${over ? " over" : ""}`}
      title={title}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept=".sav"
        hidden
        disabled={busy}
        onChange={(event) => {
          take(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {children}
    </label>
  );
}
