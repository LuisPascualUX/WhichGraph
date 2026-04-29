import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <article
      className={cn(
        "rounded-xl2 border border-white/10 bg-card/80 p-4 shadow-soft backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
