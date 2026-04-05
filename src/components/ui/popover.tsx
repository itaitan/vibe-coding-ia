"use client";

import * as React from "react";
import * as PopoverPrimitive from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Popover.Root;
const PopoverTrigger = PopoverPrimitive.Popover.Trigger;

interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popover.Popup> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 8, children, ...props }, ref) => (
  <PopoverPrimitive.Popover.Portal>
    <PopoverPrimitive.Popover.Positioner
      align={align}
      sideOffset={sideOffset}
      className="z-[1000]"
    >
      <PopoverPrimitive.Popover.Popup
        ref={ref}
        className={cn(
          "w-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Popover.Popup>
    </PopoverPrimitive.Popover.Positioner>
  </PopoverPrimitive.Popover.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
