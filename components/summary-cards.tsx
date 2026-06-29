"use client"

import { ArrowDownCircle, Clock, CheckCircle2, TrendingDown } from "lucide-react"
import { useFinance } from "@/components/finance-provider"
import { Amount } from "@/components/amount"
import { FIXED_COMMITMENTS } from "@/lib/finance-data"

export function SummaryCards() {
  const { engagements } = useFinance()

  const sum = (status: string) =>
    engagements.filter((e) => e.status === status).reduce((acc, e) => acc + e.montant, 0)

  const aPayer = sum("a_payer")
  const enCours = sum("en_cours")
  const paye = sum("paye")
  const chargesFixes = FIXED_COMMITMENTS.reduce((acc, c) => acc + c.montantMensuel, 0)

  const cards = [
    {
      label: "À payer",
      value: aPayer,
      icon: ArrowDownCircle,
      tone: "text-primary",
      ring: "bg-primary/15",
      sub: `${engagements.filter((e) => e.status === "a_payer").length} échéances`,
    },
    {
      label: "En cours",
      value: enCours,
      icon: Clock,
      tone: "text-amber-300",
      ring: "bg-amber-400/15",
      sub: `${engagements.filter((e) => e.status === "en_cours").length} en traitement`,
    },
    {
      label: "Réglé (historique)",
      value: paye,
      icon: CheckCircle2,
      tone: "text-success",
      ring: "bg-success/15",
      sub: `${engagements.filter((e) => e.status === "paye").length} paiements`,
    },
    {
      label: "Charges fixes / mois",
      value: chargesFixes,
      icon: TrendingDown,
      tone: "text-muted-foreground",
      ring: "bg-secondary",
      sub: "Salaires, crédits, loyers",
    },
  ]

  return (
    <section aria-label="Synthèse" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
            <span className={`flex size-8 items-center justify-center rounded-lg ${c.ring}`}>
              <c.icon className={`size-4 ${c.tone}`} />
            </span>
          </div>
          <p className="mt-3 text-lg font-semibold tracking-tight sm:text-xl">
            <Amount value={c.value} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
        </div>
      ))}
    </section>
  )
}
