import type { SignalType } from "../domain";

interface SignalTypeMarkProps {
  readonly className?: string;
  readonly type: SignalType;
}

export function SignalTypeMark({ className, type }: SignalTypeMarkProps) {
  const commonProps = {
    "aria-hidden": true,
    className,
    fill: "none",
    viewBox: "0 0 28 28",
  } as const;

  switch (type) {
    case "missing_carrot":
      return (
        <svg {...commonProps}>
          <circle cx="7" cy="17" fill="currentColor" r="2.6" />
          <circle cx="14" cy="11" fill="currentColor" opacity="0.7" r="2" />
          <circle cx="21" cy="16" fill="currentColor" opacity="0.42" r="1.6" />
        </svg>
      );
    case "new_hole":
      return (
        <svg {...commonProps}>
          <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="14" cy="14" opacity="0.42" r="9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "motion_sensor":
      return (
        <svg {...commonProps}>
          <path d="M8 19c2.4-4.8 6.4-7.4 12-7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M5 23c3.7-7.6 9.8-11.7 18.2-11" opacity="0.42" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
        </svg>
      );
    case "barn_rustling":
      return (
        <svg {...commonProps}>
          <path d="M3 14c2.8-4 5.6 4 8.4 0s5.6 4 8.4 0 4.2 2 5.2 1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}
