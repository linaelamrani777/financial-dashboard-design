"use client"

import { useEffect, useRef, useState } from "react"
import { Eye, EyeOff, LayoutGrid, Check, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFinance } from "@/components/finance-provider"
import { MODULES } from "@/lib/finance-data"

export function DashboardHeader() {
  const { amountsVisible, toggleAmounts, activeModules, toggleModule } = useFinance()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight sm:text-base">Gestion des Engagements</h1>
            <p className="text-xs text-muted-foreground">Trésorerie &amp; sorties prévisionnelles</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAmounts}
            aria-pressed={!amountsVisible}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors",
              amountsVisible
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                : "bg-primary/15 text-primary",
            )}
          >
            {amountsVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            <span className="hidden sm:inline">{amountsVisible ? "Masquer montants" : "Afficher montants"}</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
            >
              <LayoutGrid className="size-4" />
              <span className="hidden sm:inline">Modules</span>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-border bg-popover p-2 shadow-2xl">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Afficher / masquer les modules</p>
                {MODULES.map((m) => {
                  const active = activeModules[m.key]
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => toggleModule(m.key)}
                      className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border",
                          active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent",
                        )}
                      >
                        {active ? <Check className="size-3.5" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{m.label}</span>
                        <span className="block text-xs text-muted-foreground">{m.description}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
