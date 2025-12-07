"use client";

import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700"
      : variant === "secondary"
      ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
      : "text-slate-600 hover:text-slate-900";

  return (
    <button
      className={twMerge(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-500",
        base,
        className
      )}
      {...props}
    />
  );
}
