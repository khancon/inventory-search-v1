"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={twMerge(
        "w-full rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500",
        className
      )}
      {...props}
    />
  );
});
