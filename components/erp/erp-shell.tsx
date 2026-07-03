"use client"

import { useState } from "react"
import { Construction } from "lucide-react"
import { Sidebar } from "@/components/erp/sidebar"
import { HomeView } from "@/components/erp/home-view"
import { RolesView } from "@/components/erp/roles-view"

const TITLES: Record<string, string> = {
  users: "Users",
  po: "Purchase Orders",
  delivery: "Delivery Notes",
  invoices: "Invoices",
  payments: "Payments",
  checks: "Checks",
  calendar: "Calendar",
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Construction className="size-6" />
      </span>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Ce module sera bientôt disponible. Le tableau de bord Home présente déjà les indicateurs clés.
      </p>
    </div>
  )
}

export function ErpShell() {
  const [active, setActive] = useState("home")

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar active={active} onSelect={setActive} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        {active === "home" ? (
          <HomeView />
        ) : active === "roles" ? (
          <RolesView />
        ) : (
          <Placeholder title={TITLES[active] ?? "Module"} />
        )}
      </main>
    </div>
  )
}
