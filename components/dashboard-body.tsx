"use client"

import { useFinance } from "@/components/finance-provider"
import { SummaryCards } from "@/components/summary-cards"
import { BanksSection } from "@/components/banks-section"

export function DashboardBody() {
  const { activeModules } = useFinance()

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <SummaryCards />

      {activeModules.banques ? <BanksSection /> : null}
    </main>
  )
}
