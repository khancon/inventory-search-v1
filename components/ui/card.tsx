import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function Card({ title, description, children, className }: Props) {
  return (
    <div className={twMerge("rounded-xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
      {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
