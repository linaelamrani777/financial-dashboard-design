"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** Panel width. Defaults to a comfortable side-panel size. */
  widthClassName?: string
}

/**
 * Right-to-left slide-over panel.
 * - Does NOT cover the whole page: it occupies only a right-side column.
 * - No opaque/blur backdrop, so the page behind stays fully visible while
 *   data loads or updates in either panel.
 */
export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  widthClassName = "w-full max-w-md",
}: SlideOverProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <div
      aria-hidden={!open}
      className={cn(
        // pointer-events-none on the wrapper keeps the page behind clickable;
        // only the panel itself re-enables pointer events.
        "pointer-events-none fixed inset-y-0 right-0 z-40 flex",
        widthClassName,
      )}
    >
      <aside
        role="dialog"
        aria-modal="false"
        aria-label={title}
        className={cn(
          "pointer-events-auto flex h-full w-full flex-col border-l border-border bg-card shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-balance">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>

        {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
      </aside>
    </div>
  )
}
