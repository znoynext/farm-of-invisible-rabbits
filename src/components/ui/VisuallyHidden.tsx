import type { HTMLAttributes } from "react";

export function VisuallyHidden({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  const classes = ["visually-hidden", className].filter(Boolean).join(" ");

  return <span className={classes} {...props} />;
}
