"use client"

import { useState } from "react"
import {
  Home,
  Users,
  ShieldCheck,
  Package,
  ClipboardList,
  FileText,
  CreditCard,
  Landmark,
  Calendar,
  ChevronUp,
  LogOut,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { key: "home", label: "Home", icon: Home },
  { key: "users", label: "Users", icon: Users },
  { key: "roles", label: "Roles", icon: ShieldCheck },
  { key: "po", label: "Purchase Orders", icon: Package },
  { key: "delivery", label: "Delivery Notes", icon: ClipboardList },
  { key: "invoices", label: "Invoices", icon: FileText },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "checks", label: "Checks", icon: Landmark },
  { key: "calendar", label: "Calendar", icon: Calendar },
] as const

export function Sidebar({
  active,
  onSelect,
}: {
  active: string
  onSelect: (key: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <aside className="flex h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
          <Landmark className="size-5 text-primary-foreground" aria-hidden />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-sidebar-foreground">FINTRAC Control</p>
          <p className="text-xs text-muted-foreground">ERP Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Navigation principale">
        <p className="px-2 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          System
        </p>
        <ul className="flex flex-col gap-1">
          {NAV.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onSelect(key)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="relative border-t border-sidebar-border p-3">
        {menuOpen ? (
          <div className="absolute inset-x-3 bottom-full mb-2 overflow-hidden rounded-lg border border-sidebar-border bg-popover shadow-lg">
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-sidebar-accent"
            >
              <Settings className="size-4" aria-hidden /> Paramètres
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-sidebar-accent"
            >
              <LogOut className="size-4" aria-hidden /> Déconnexion
            </button>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
            L
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-sidebar-foreground">lina</span>
            <span className="block truncate text-xs text-muted-foreground">lina@gmail.com</span>
          </span>
          <ChevronUp
            className={cn("size-4 text-muted-foreground transition-transform", menuOpen ? "" : "rotate-180")}
            aria-hidden
          />
        </button>
      </div>
    </aside>
  )
}
