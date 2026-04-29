import React from "react";
import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/15 bg-surface/80 px-4 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-accent/60 focus:ring-2 focus:ring-accent/30",
        className
      )}
      {...props}
    />
  );
}
