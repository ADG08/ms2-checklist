import { useTranslation } from "react-i18next";
import { mapPinKinds, mapPins, type MapPinKind } from "../data/pins";

type Props = Readonly<{
  kind: MapPinKind | "all";
  checked: Record<string, boolean>;
  selected: string | null;
  onKind: (kind: MapPinKind | "all") => void;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}>;

export function WorldMap({ kind, checked, selected, onKind, onSelect, onToggle }: Props) {
  const { t } = useTranslation();
  const pins = kind === "all" ? mapPins : mapPins.filter((pin) => pin.kind === kind);

  return (
    <div className="site-map">
      <div className="site-filters" role="toolbar" aria-label={t("map.filters")}>
        {(["all", ...mapPinKinds] as const).map((value) => (
          <button key={value} type="button" aria-pressed={kind === value} onClick={() => onKind(value)}>
            {value === "all" ? t("map.allPins") : t(`map.kinds.${value}`)}
          </button>
        ))}
      </div>
      <div className="fallgrim-map">
        <img src="/fallgrim-map.webp" alt={t("map.imageAlt")} loading="lazy" decoding="async" />
        <div className="map-regions">
          <span className="fainweald">Fainweald</span>
          <span className="mammon">Mammon</span>
        </div>
        {pins.map((pin) => (
          <button
            key={pin.id}
            type="button"
            className={`map-pin ${pin.kind} ${checked[pin.id] ? "owned" : "missing"}${selected === pin.id ? " selected" : ""}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            title={pin.name}
            aria-label={pin.name}
            aria-pressed={Boolean(checked[pin.id])}
            onClick={() => {
              onSelect(pin.id);
              onToggle(pin.id);
            }}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
