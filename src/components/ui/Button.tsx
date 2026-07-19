import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "default" | "compact";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      size = "default",
      type = "button",
      variant = "primary",
      ...props
    },
    ref,
  ) {
    const classes = [
      "button",
      `button--${variant}`,
      `button--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <button className={classes} ref={ref} type={type} {...props} />;
  },
);
