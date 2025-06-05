import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer  bg-white/10 dark:bg-white/15 border-white/30 hover:bg-white/20",
        "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500",
        "focus-visible:border-ring  focus-visible:ring-blue-400/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "size-5 shrink-0 rounded-[4px] border-2 shadow-sm transition-all duration-150",
        "outline-none focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "relative",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current absolute inset-0"
      >
        <Check className="h-3.5 w-3.5 text-white stroke-[3] stroke-white" strokeLinecap="round" strokeLinejoin="round" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }