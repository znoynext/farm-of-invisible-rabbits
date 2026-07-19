import type { HTMLAttributes } from "react";

type SurfaceTone = "default" | "secondary" | "quiet";

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: SurfaceTone;
};

export function Surface({
  className,
  tone = "default",
  ...props
}: SurfaceProps) {
  const classes = ["surface", `surface--${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} {...props} />;
}
