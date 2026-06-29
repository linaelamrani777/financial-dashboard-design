"use client"

import { cn } from "@/lib/utils"
import { formatDH } from "@/lib/finance-data"
import { useFinance } from "@/components/finance-provider"

interface AmountProps {
  value: number
  className?: string
  /** when false, ignores the global hide toggle (rarely needed) */
  hideable?: boolean
}

/**
 * Renders a DH amount. When the global "hide amounts" toggle is on,
 * the digits are masked with bullets so figures stay private.
 */
export function Amount({ value, className, hideable = true }: AmountProps) {
  const { amountsVisible } = useFinance()
  const masked = hideable && !amountsVisible

  return (
    <span className={cn("tabular-nums", className)}>
      {masked ? (
        <span aria-label="Montant masqué" className="tracking-wider text-muted-foreground select-none">
          •••• DH
        </span>
      ) : (
        formatDH(value)
      )}
    </span>
  )
}
