import { useId, type InputHTMLAttributes } from "react";

export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  valueText?: string;
};

export function Slider({
  className,
  id,
  label,
  valueText,
  ...props
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? `slider-${generatedId}`;

  return (
    <div className="slider-field">
      <span className="slider-field__header">
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
        {valueText ? <output htmlFor={inputId}>{valueText}</output> : null}
      </span>
      <input
        className={["slider", className].filter(Boolean).join(" ")}
        id={inputId}
        type="range"
        {...props}
      />
    </div>
  );
}
