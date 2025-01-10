"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // value will be represented in wei. Convert its progress based on some lower +
  // upper threshold
  const UPPER_THRESHOLD = 300;
  const asPercent = Math.min(((value ?? 0) / UPPER_THRESHOLD) * 100, 100);
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-900", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all bg-gradient-to-r from-cyan-500 to-red-500",
        )}
      />
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all bg-green absolute right-0 top-0 bg-gray-900"
        style={{ width: `${100 - asPercent}%` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
