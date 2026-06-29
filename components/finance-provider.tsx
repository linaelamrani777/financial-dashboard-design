"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import {
  INITIAL_ENGAGEMENTS,
  type Engagement,
  type EngagementStatus,
  type ModuleKey,
} from "@/lib/finance-data"

export interface NewEngagementInput {
  nom: string
  entreprise: string
  montant: number
  methode: Engagement["methode"]
  reference: string
  banque: string
  dateEcheance: string
}

interface FinanceContextValue {
  engagements: Engagement[]
  amountsVisible: boolean
  toggleAmounts: () => void
  activeModules: Record<ModuleKey, boolean>
  toggleModule: (key: ModuleKey) => void
  addEngagement: (input: NewEngagementInput) => void
  /** move an engagement to a new status (slides it between tables) */
  setStatus: (id: string, status: EngagementStatus) => void
  removeEngagement: (id: string) => void
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [engagements, setEngagements] = useState<Engagement[]>(INITIAL_ENGAGEMENTS)
  const [amountsVisible, setAmountsVisible] = useState(true)
  const [activeModules, setActiveModules] = useState<Record<ModuleKey, boolean>>({
    engagements: true,
    banques: true,
    fixes: true,
  })

  const toggleAmounts = useCallback(() => setAmountsVisible((v) => !v), [])

  const toggleModule = useCallback((key: ModuleKey) => {
    setActiveModules((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const addEngagement = useCallback((input: NewEngagementInput) => {
    setEngagements((prev) => [
      {
        ...input,
        id: `e-${Date.now()}`,
        status: "a_payer",
      },
      ...prev,
    ])
  }, [])

  const setStatus = useCallback((id: string, status: EngagementStatus) => {
    setEngagements((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              datePaiement: status === "paye" ? todayISO() : undefined,
            }
          : e,
      ),
    )
  }, [])

  const removeEngagement = useCallback((id: string) => {
    setEngagements((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const value = useMemo<FinanceContextValue>(
    () => ({
      engagements,
      amountsVisible,
      toggleAmounts,
      activeModules,
      toggleModule,
      addEngagement,
      setStatus,
      removeEngagement,
    }),
    [engagements, amountsVisible, toggleAmounts, activeModules, toggleModule, addEngagement, setStatus, removeEngagement],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider")
  return ctx
}
