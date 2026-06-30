"use client"

import {
  ArrowDownCircle,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  TrendingDown,
  Landmark,
  Wallet,
  Gauge,
} from "lucide-react"
import { useFinance } from "@/components/finance-provider"
import { Amount } from "@/components/amount"
import { FIXED_COMMITMENTS, BANKS, daysUntil } from "@/lib/finance-data"
import { cn } from "@/lib/utils"

export function SummaryCards() {
  const { engagements } = useFinance()

  const byStatus = (status: string) => engagements.filter((e) => e.status === status)
  const sum = (arr: { montant: number }[]) => arr.reduce((acc, e) => acc + e.montant, 0)

  const aPayerList = byStatus("a_payer")
  const enCoursList = byStatus("en_cours")
  const payeList = byStatus("paye")

  const aPayer = sum(aPayerList)
  const enCours = sum(enCoursList)
  const paye = sum(payeList)

  // Total commitments still outstanding (not yet settled)
  const aRegler = aPayer + enCours

  // Deadlines within the next 7 days (still open)
  const urgentList = [...aPayerList, ...enCoursList].filter((e) => {
    const d = daysUntil(e.dateEcheance)
    return d >= 0 && d <= 7
  })

  // Overdue: open engagements whose due date has passed
  const enRetardList = [...aPayerList, ...enCoursList].filter((e) => daysUntil(e.dateEcheance) < 0)

  // Settlement rate over the full period
  const totalPeriode = aPayer + enCours + paye
  const tauxReglement = totalPeriode > 0 ? Math.round((paye / totalPeriode) * 100) : 0

  // Banking aggregates
  const tresorerieDispo = BANKS.reduce((acc, b) => acc + (b.decouvertAutorise - b.decouvertUtilise), 0)
  const endettement = BANKS.reduce((acc, b) => acc + b.creditRestantDu, 0)
  const decouvertAutorise = BANKS.reduce((acc, b) => acc + b.decouvertAutorise, 0)
  const decouvertUtilise = BANKS.reduce((acc, b) => acc + b.decouvertUtilise, 0)
  const tauxDecouvert = decouvertAutorise > 0 ? Math.round((decouvertUtilise / decouvertAutorise) * 100) : 0

  const chargesFixes = FIXED_COMMITMENTS.reduce((acc, c) => acc + c.montantMensuel, 0)

  const cards: KpiCard[] = [
    {
      label: "Reste à régler",
      value: aRegler,
      icon: ArrowDownCircle,
      tone: "text-primary",
      ring: "bg-primary/15",
      sub: `${aPayerList.length} à payer · ${enCoursList.length} en attente`,
    },
    {
      label: "Échéances ≤ 7 jours",
      value: sum(urgentList),
      icon: CalendarClock,
      tone: "text-amber-300",
      ring: "bg-amber-400/15",
      sub: `${urgentList.length} échéance(s) imminente(s)`,
    },
    {
      label: "En retard",
      value: sum(enRetardList),
      icon: AlertTriangle,
      tone: enRetardList.length > 0 ? "text-destructive" : "text-muted-foreground",
      ring: enRetardList.length > 0 ? "bg-destructive/15" : "bg-secondary",
      sub: enRetardList.length > 0 ? `${enRetardList.length} dépassée(s)` : "Aucun retard",
    },
    {
      label: "Taux de règlement",
      value: tauxReglement,
      isPercent: true,
      progress: tauxReglement,
      progressTone: "bg-success",
      icon: CheckCircle2,
      tone: "text-success",
      ring: "bg-success/15",
      sub: <span><Amount value={paye} /> réglés</span>,
    },
    {
      label: "Trésorerie disponible",
      value: tresorerieDispo,
      icon: Wallet,
      tone: "text-success",
      ring: "bg-success/15",
      sub: "Lignes de découvert non utilisées",
    },
    {
      label: "Endettement bancaire",
      value: endettement,
      icon: Landmark,
      tone: "text-foreground",
      ring: "bg-secondary",
      sub: "Crédits MT restant dus",
    },
    {
      label: "Utilisation découvert",
      value: tauxDecouvert,
      isPercent: true,
      progress: tauxDecouvert,
      progressTone: tauxDecouvert >= 80 ? "bg-destructive" : tauxDecouvert >= 50 ? "bg-amber-400" : "bg-success",
      icon: Gauge,
      tone: tauxDecouvert >= 80 ? "text-destructive" : "text-primary",
      ring: "bg-primary/15",
      sub: <span><Amount value={decouvertUtilise} /> / <Amount value={decouvertAutorise} /></span>,
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
    <section aria-label="Indicateurs clés" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="flex flex-col rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground text-balance">{c.label}</span>
            <span className={cn("flex size-8 items-center justify-center rounded-lg", c.ring)}>
              <c.icon className={cn("size-4", c.tone)} />
            </span>
          </div>
          <p className={cn("mt-3 text-lg font-semibold tracking-tight sm:text-xl", c.isPercent && c.tone)}>
            {c.isPercent ? `${c.value} %` : <Amount value={c.value} />}
          </p>
          {typeof c.progress === "number" ? (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn("h-full rounded-full transition-all", c.progressTone)}
                style={{ width: `${Math.min(100, c.progress)}%` }}
              />
            </div>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
        </div>
      ))}
    </section>
  )
}

interface KpiCard {
  label: string
  value: number
  isPercent?: boolean
  progress?: number
  progressTone?: string
  icon: typeof ArrowDownCircle
  tone: string
  ring: string
  sub: React.ReactNode
}
