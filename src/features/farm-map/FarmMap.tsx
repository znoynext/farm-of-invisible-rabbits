import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

import { SignalTypeMark } from "../../components/SignalTypeMark";
import { Surface } from "../../components/ui";
import type {
  LocationActivity,
  LocationActivityLevel,
  SignalEvent,
  SignalType,
} from "../../domain";
import { resolveFarmMapPlacement } from "./placement";

const activityLabels: Record<LocationActivityLevel, string> = {
  low: "Низкая активность",
  moderate: "Умеренная активность",
  high: "Высокая активность",
};

const signalLabels: Record<SignalType, string> = {
  missing_carrot: "Пропавшая морковь",
  new_hole: "Новые ямки",
  motion_sensor: "Движение",
  barn_rustling: "Шорох",
};

type ZoneStyle = CSSProperties & {
  "--zone-x": string;
  "--zone-y": string;
  "--zone-mobile-x": string;
  "--zone-mobile-y": string;
};

export interface FarmMapProps {
  readonly locations: readonly LocationActivity[];
  readonly onSelectedLocationChange: (location: string | null) => void;
  readonly selectedLocation: string | null;
  readonly selectedSignalType?: SignalType | null;
}

export function FarmMap({
  locations,
  onSelectedLocationChange,
  selectedLocation,
  selectedSignalType = null,
}: FarmMapProps) {
  const [transientLocation, setTransientLocation] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const fallbackLocation = locations[0]?.location ?? null;
  const linkedLocation = selectedSignalType
    ? locations.find(({ signalTypes }) => signalTypes.includes(selectedSignalType))
        ?.location ?? null
    : null;
  const activeLocationName =
    transientLocation ??
    (locations.some(({ location }) => location === selectedLocation)
      ? selectedLocation
      : linkedLocation ?? fallbackLocation);
  const activeLocation =
    locations.find(({ location }) => location === activeLocationName) ?? null;

  return (
    <Surface
      className={`farm-map${locations.length === 0 ? " farm-map--empty" : ""}`}
      data-linked-signal={selectedSignalType ?? undefined}
    >
      <header className="farm-map__header">
        <div>
          <p className="eyebrow">КАРТИНА НАБЛЮДЕНИЙ</p>
          <h2 id="farm-map-title">Где остаются следы</h2>
        </div>
        <p>
          Размер и тон отметки показывают активность зоны. Выберите её, чтобы
          увидеть состав наблюдений и суммарное влияние.
        </p>
      </header>

      <div className="farm-map__body">
        <div
          aria-labelledby="farm-map-title"
          className="farm-map__diagram"
          data-testid="farm-map-diagram"
          role="group"
        >
          <DesktopFarmDiagram />
          <MobileFarmDiagram />
          <span aria-hidden="true" className="farm-map__other-label">
            Другие участки
          </span>

          {locations.map((location) => {
            const placement = resolveFarmMapPlacement(location.location);
            const isSelected = selectedLocation === location.location;
            const isActive = activeLocationName === location.location;
            const isRelated = selectedSignalType
              ? location.signalTypes.includes(selectedSignalType)
              : false;
            const style: ZoneStyle = {
              "--zone-x": `${placement.x}%`,
              "--zone-y": `${placement.y}%`,
              "--zone-mobile-x": `${placement.mobileX}%`,
              "--zone-mobile-y": `${placement.mobileY}%`,
            };

            return (
              <button
                aria-label={`${location.location}: ${activityLabels[location.activityLevel]}, ${formatObservationCount(location.eventCount)}`}
                aria-pressed={isSelected}
                className="farm-map__zone"
                data-active={isActive}
                data-activity={location.activityLevel}
                data-location={location.location}
                data-placement={placement.kind}
                data-related={isRelated}
                key={location.location}
                onBlur={() => setTransientLocation(null)}
                onClick={() => onSelectedLocationChange(location.location)}
                onFocus={() => setTransientLocation(location.location)}
                onPointerEnter={() => setTransientLocation(location.location)}
                onPointerLeave={() => setTransientLocation(null)}
                style={style}
                type="button"
              >
                <span aria-hidden="true" className="farm-map__beacon">
                  <SignalTypeMark type={location.strongestSignal.event} />
                </span>
                <span className="farm-map__zone-label">{location.location}</span>
              </button>
            );
          })}

          {locations.length === 0 ? (
            <div className="farm-map__empty-message">
              <span aria-hidden="true" />
              <p>Пока нет наблюдений для карты</p>
            </div>
          ) : null}
        </div>

        <MapDetails
          activeLocation={activeLocation}
          isSelected={activeLocation?.location === selectedLocation}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
        />
      </div>
    </Surface>
  );
}

function MapDetails({
  activeLocation,
  isSelected,
  prefersReducedMotion,
}: {
  readonly activeLocation: LocationActivity | null;
  readonly isSelected: boolean;
  readonly prefersReducedMotion: boolean;
}) {
  if (!activeLocation) {
    return (
      <aside className="farm-map__details farm-map__details--empty">
        <p className="farm-map__details-index">Нет данных</p>
        <h3>Карта ждёт первого сигнала</h3>
        <p>
          Когда появится наблюдение, зона и её влияние отобразятся здесь без
          случайного размещения.
        </p>
      </aside>
    );
  }

  return (
    <motion.aside
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      className="farm-map__details"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      key={activeLocation.location}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.24,
        ease: [0.2, 0, 0, 1],
      }}
    >
      <div className="farm-map__details-heading">
        <p className="farm-map__details-index">
          {isSelected ? "Закреплённая зона" : "Самая активная зона"}
        </p>
        <span className="farm-map__activity" data-activity={activeLocation.activityLevel}>
          {activityLabels[activeLocation.activityLevel]}
        </span>
      </div>
      <h3>{activeLocation.location}</h3>

      <dl className="farm-map__metrics">
        <div>
          <dt>Наблюдения</dt>
          <dd>{activeLocation.eventCount}</dd>
        </div>
        <div>
          <dt>Влияние</dt>
          <dd>{formatImpact(activeLocation.totalImpact)}</dd>
        </div>
      </dl>

      <div className="farm-map__signals">
        <p>Сигналы в зоне</p>
        <ul>
          {activeLocation.signalTypes.map((signalType) => (
            <li key={signalType}>
              <SignalTypeMark type={signalType} />
              <span>{signalLabels[signalType]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="farm-map__strongest">
        <p>Сильнейшее наблюдение</p>
        <strong>{formatStrongestSignal(activeLocation.strongestSignal)}</strong>
      </div>
    </motion.aside>
  );
}

function DesktopFarmDiagram() {
  return (
    <svg aria-hidden="true" className="farm-map__landscape farm-map__landscape--desktop" viewBox="0 0 1000 620">
      <defs>
        <pattern height="24" id="field-lines-pattern" patternUnits="userSpaceOnUse" width="24">
          <path d="M0 24 24 0" stroke="currentColor" strokeOpacity=".16" strokeWidth="1" />
        </pattern>
      </defs>
      <path className="farm-map__ground" d="m45 304 385-210 525 222-384 235Z" />
      <path className="farm-map__field farm-map__field--garden" d="m80 300 325-176 191 81-323 180Z" />
      <path className="farm-map__field-lines" d="m80 300 325-176 191 81-323 180Z" fill="url(#field-lines-pattern)" />
      <path className="farm-map__field farm-map__field--fence" d="m430 111 475 201-205 125-465-199Z" />
      <path className="farm-map__path" d="M178 415c176-46 282-61 390-22 89 31 169 94 246 129" />
      <path className="farm-map__boundary" d="m54 302 381-208 519 219" />
      <path className="farm-map__fence" d="m474 117 403 172" />
      <path className="farm-map__fence-posts" d="m507 108-7 35m77-9-8 39m83-9-8 39m82-10-8 40m85-10-8 40" />
      <g className="farm-map__barn">
        <path d="m655 373 128-70 111 47-128 71Z" />
        <path d="m655 373 111 48v112l-111-49Z" />
        <path d="m766 421 128-71v112l-128 71Z" />
        <path className="farm-map__barn-roof" d="m640 367 142-81 128 55-144 80Z" />
        <path className="farm-map__barn-door" d="m811 441 42-23v70l-42 23Z" />
      </g>
      <path className="farm-map__other-band" d="m79 475 454 87 236-18-460-92Z" />
    </svg>
  );
}

function MobileFarmDiagram() {
  return (
    <svg aria-hidden="true" className="farm-map__landscape farm-map__landscape--mobile" viewBox="0 0 360 310">
      <path className="farm-map__mobile-ground" d="M19 61 197 19l145 73-179 58Z" />
      <path className="farm-map__mobile-route" d="M36 95c75 47 188 17 269 100 17 18 23 38 22 61" />
      <path className="farm-map__mobile-field" d="m27 68 157-38 72 36-157 42Z" />
      <path className="farm-map__mobile-fence" d="m198 31 122 62" />
      <path className="farm-map__mobile-barn" d="m202 175 69-36 60 30-69 38Z" />
      <path className="farm-map__mobile-other" d="M31 251h298" />
    </svg>
  );
}

function formatObservationCount(count: number): string {
  const modulo100 = count % 100;
  const modulo10 = count % 10;

  if (modulo100 >= 11 && modulo100 <= 14) {
    return `${count} наблюдений`;
  }

  if (modulo10 === 1) {
    return `${count} наблюдение`;
  }

  if (modulo10 >= 2 && modulo10 <= 4) {
    return `${count} наблюдения`;
  }

  return `${count} наблюдений`;
}

function formatImpact(impact: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(impact);
}

function formatStrongestSignal(signal: SignalEvent): string {
  return `${signalLabels[signal.event]} · интенсивность ${signal.intensity}/10 · ${signal.time}`;
}
