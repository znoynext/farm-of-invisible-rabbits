type SignalMarkProps = {
  className?: string;
};

export function SignalMark({ className }: SignalMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 52 52"
      fill="none"
    >
      <circle cx="11" cy="28" r="3.5" fill="currentColor" />
      <circle cx="21" cy="20" r="2.5" fill="currentColor" opacity="0.65" />
      <path
        d="M27 34c6.5-1.5 11.5-6.5 13-13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M31 41c9.5-2.5 16-10 18-19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}
