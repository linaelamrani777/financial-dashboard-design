"use client"

import type { ComponentType } from "react"
import {
  Eye,
  EyeOff,
  FileText,
  Wallet,
  Package,
  ClipboardList,
  Landmark,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFinance } from "@/components/finance-provider"
import { TrendChart } from "@/components/erp/trend-chart"
import {
  ERP_KPIS,
  RECENT_ACTIVITY,
  formatMAD,
  formatDateShort,
  type ActivityItem,
} from "@/lib/erp-data"

function Mad({ value, className }: { value: number; className?: string }) {
  const { amountsVisible } = useFinance()
  return (
    <span className={cn("tabular-nums", className)}>
      {amountsVisible ? formatMAD(value) : "•••• MAD"}
    </span>
  )
}

interface KpiCardProps {
  label: string
  value: number
  icon: ComponentType<{ className?: string }>
  accent?: "primary" | "success" | "danger" | "muted"
  hint?: string
  trend?: { dir: "up" | "down"; value: string; good?: boolean }
  /** when set, renders a plain number with this unit instead of a masked MAD amount */
  unit?: string
}

const ACCENTS: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/15 text-destructive",
  muted: "bg-secondary text-muted-foreground",
}

function KpiCard({ label, value, icon: Icon, accent = "muted", hint, trend, unit }: KpiCardProps) {
  return (
    <button
      type="button"
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50"
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-lg", ACCENTS[accent])}>
          <Icon className="size-4" />
        </span>
        {trend ? (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trend.good ? "text-success" : "text-destructive",
            )}
          >
            {trend.dir === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {trend.value}
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {unit ? (
          <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
            {value}
            <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
          </p>
        ) : (
          <Mad value={value} className="mt-1 block text-xl font-bold text-foreground" />
        )}
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </button>
  )
}

const ACTIVITY_META: Record<
  ActivityItem["type"],
  { icon: ComponentType<{ className?: string }>; tone: string }
> = {
  invoice: { icon: FileText, tone: "bg-primary/15 text-primary" },
  payment: { icon: Wallet, tone: "bg-success/15 text-success" },
  po: { icon: Package, tone: "bg-secondary text-foreground" },
  delivery: { icon: ClipboardList, tone: "bg-secondary text-foreground" },
  check: { icon: Landmark, tone: "bg-accent text-accent-foreground" },
}

const STATUS_BADGE: Record<ActivityItem["status"], { label: string; cls: string }> = {
  paid: { label: "Réglé", cls: "bg-success/15 text-success" },
  pending: { label: "En attente", cls: "bg-amber-400/15 text-amber-300" },
  overdue: { label: "En retard", cls: "bg-destructive/15 text-destructive" },
  draft: { label: "Brouillon", cls: "bg-secondary text-muted-foreground" },
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const meta = ACTIVITY_META[item.type]
  const badge = STATUS_BADGE[item.status]
  const Icon = meta.icon
  return (
    <li className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/50">
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", meta.tone)}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
        <p className="truncate text-xs text-muted-foreground">{item.company}</p>
      </div>
      <div className="text-right">
        <Mad value={item.amount} className="block text-sm font-semibold text-foreground" />
        <span className="text-xs text-muted-foreground">{formatDateShort(item.date)}</span>
      </div>
      <span className={cn("hidden shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase sm:inline", badge.cls)}>
        {badge.label}
      </span>
    </li>
  )
}

function Gauge({ label, percent, sublabel, danger }: { label: string; percent: number; sublabel: string; danger?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={cn("text-sm font-bold", danger ? "text-destructive" : "text-foreground")}>{percent}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", danger ? "bg-destructive" : "bg-success")}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{sublabel}</p>
    </div>
  )
}

export function HomeView() {
  const { amountsVisible, toggleAmounts } = useFinance()
  const k = ERP_KPIS

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Welcome back, lina</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your invoices, payments and commitments with the company.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleAmounts}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-pressed={!amountsVisible}
        >
          {amountsVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          {amountsVisible ? "Masquer les montants" : "Afficher les montants"}
        </button>
      </header>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicateurs clés">
        <KpiCard label="Total facturé" value={k.totalInvoiced} icon={FileText} accent="primary" hint="Année en cours" trend={{ dir: "up", value: "8.2%", good: true }} />
        <KpiCard label="Encours à recouvrer" value={k.outstanding} icon={Wallet} accent="muted" hint="Factures non réglées" />
        <KpiCard label="Encaissé ce mois" value={k.paidThisMonth} icon={TrendingUp} accent="success" trend={{ dir: "up", value: "12%", good: true }} />
        <KpiCard label="Bons de commande" value={k.openPoValue} icon={Package} accent="muted" hint={`${k.openPoCount} ouverts`} />
        <KpiCard label="Chèques & LCN" value={k.checksPendingValue} icon={Landmark} accent="muted" hint={`${k.checksPendingCount} en attente`} />
        <KpiCard label="Livraisons en attente" value={k.pendingDeliveries} icon={ClipboardList} accent="muted" hint="Bons de livraison" unit="bons" />
        <KpiCard label="Délai moyen paiement" value={k.avgPaymentDelay} icon={Clock} accent="muted" hint="DSO" unit="jours" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Facturé vs Encaissé</h2>
              <p className="text-xs text-muted-foreground">6 derniers mois</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Facturé</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Encaissé</span>
            </div>
          </div>
          <TrendChart />
        </div>

        <div className="flex flex-col gap-4">
          <Gauge label="Taux de recouvrement" percent={k.collectionRate} sublabel="Objectif 90%" />
          <Gauge label="Part échue" percent={18} sublabel={`${k.overdueCount} factures en retard`} danger />
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trésorerie nette (est.)</p>
            <Mad value={k.paidThisMonth - k.overdueAmount} className="mt-1 block text-xl font-bold text-foreground" />
            <p className="mt-1 text-xs text-muted-foreground">Encaissé - retards</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Activité récente</h2>
          <button type="button" className="text-xs font-medium text-primary hover:underline">
            Tout voir
          </button>
        </div>
        <ul className="flex flex-col divide-y divide-border/60">
          {RECENT_ACTIVITY.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </ul>
      </section>
    </div>
  )
}
