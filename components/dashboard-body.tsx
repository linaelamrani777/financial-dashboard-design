"use client"

import { useFinance } from "@/components/finance-provider"
import { SummaryCards } from "@/components/summary-cards"
import { EngagementsBoard } from "@/components/engagements-board"
import { BanksSection } from "@/components/banks-section"
import { FixedChargesSection } from "@/components/fixed-charges-section"

export function DashboardBody() {
  const { activeModules } = useFinance()

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <SummaryCards />

      {activeModules.engagements ? <EngagementsBoard /> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {activeModules.banques ? <BanksSection /> : null}
        {activeModules.fixes ? <FixedChargesSection /> : null}
      </div>
    </main>
  )
}
