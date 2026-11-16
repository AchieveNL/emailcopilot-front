"use client";

import type { ComponentProps } from "react";
import { navigateToHowItWorks } from "@/lib/how-it-works-navigation";

export default function HowItWorksButton({ onClick, children = "How it works", ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) navigateToHowItWorks();
      }}
    >
      {children}
    </button>
  );
}
