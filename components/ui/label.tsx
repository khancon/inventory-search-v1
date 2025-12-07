import { LabelHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: Props) {
  return <label className={twMerge("text-sm font-medium text-slate-700", className)} {...props} />;
}
