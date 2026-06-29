"use client"

import { useState } from "react"
import { Plus, FileCheck2, ScrollText, Hourglass, Play, Check, Trash2, AlertTriangle, LayoutList } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFinance } from "@/components/finance-provider"
import { Amount } from "@/components/amount"
import { EngagementForm } from "@/components/engagement-form"
import { formatDate, daysUntil, type Engagement, type EngagementStatus } from "@/lib/finance-data"

type Filter = EngagementStatus | "tous"

const TABS: { key: Filter; label: string; icon: typeof FileCheck2 }[] = [
  { key: "tous", label: "Tous", icon: LayoutList },
  { key: "a_payer", label: "Non payé", icon: ScrollText },
  { key: "en_cours", label: "En attente", icon: Hourglass },
  { key: "paye", label: "Payé", icon: FileCheck2 },
]

function MethodBadge({ methode }: { methode: Engagement["methode"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        methode === "Chèque" ? "bg-sky-400/15 text-sky-300" : "bg-primary/15 text-primary",
      )}
    >
      {methode}
    </span>
  )
}

function DueChip({ engagement }: { engagement: Engagement }) {
  if (engagement.status === "paye") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
        <Check className="size-3" /> Réglé
      </span>
    )
  }
  const d = daysUntil(engagement.dateEcheance)
  const overdue = d < 0
  const soon = d >= 0 && d <= 3
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        overdue ? "bg-destructive/15 text-destructive" : soon ? "bg-amber-400/15 text-amber-300" : "bg-secondary text-muted-foreground",
      )}
    >
      {overdue ? <AlertTriangle className="size-3" /> : null}
      {overdue ? `Retard ${Math.abs(d)}j` : d === 0 ? "Aujourd'hui" : `J-${d}`}
    </span>
  )
}

const STATUS_META: Record<EngagementStatus, { label: string; cls: string }> = {
  a_payer: { label: "Non payé", cls: "bg-destructive/15 text-destructive" },
  en_cours: { label: "En attente", cls: "bg-amber-400/15 text-amber-300" },
  paye: { label: "Payé", cls: "bg-success/15 text-success" },
}

function StatusBadge({ status }: { status: EngagementStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", meta.cls)}>
      {meta.label}
    </span>
  )
}

function EngagementRow({ engagement, showStatus }: { engagement: Engagement; showStatus: boolean }) {
  const { setStatus, removeEngagement } = useFinance()
  const e = engagement

  return (
    <tr className="border-b border-border/60 transition-colors hover:bg-secondary/40">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{e.nom}</span>
          {showStatus ? <StatusBadge status={e.status} /> : null}
        </div>
        <div className="text-xs text-muted-foreground">{e.reference}</div>
      </td>
      <td className="px-3 py-3 text-sm">{e.entreprise}</td>
      <td className="px-3 py-3 text-right font-semibold">
        <Amount value={e.montant} />
      </td>
      <td className="px-3 py-3">
        <MethodBadge methode={e.methode} />
      </td>
      <td className="hidden px-3 py-3 text-sm text-muted-foreground md:table-cell">{e.banque}</td>
      <td className="px-3 py-3 text-sm">
        <div className="text-muted-foreground">{formatDate(e.status === "paye" && e.datePaiement ? e.datePaiement : e.dateEcheance)}</div>
        <div className="mt-1">
          <DueChip engagement={e} />
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1.5">
          {e.status === "a_payer" ? (
            <button
              type="button"
              onClick={() => setStatus(e.id, "en_cours")}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Lancer le paiement"
            >
              <Play className="size-3.5" /> Lancer
            </button>
          ) : null}
          {e.status !== "paye" ? (
            <button
              type="button"
              onClick={() => setStatus(e.id, "paye")}
              className="inline-flex items-center gap-1 rounded-md bg-success/90 px-2 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-success"
              title="Marquer comme payé"
            >
              <Check className="size-3.5" /> Payé
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStatus(e.id, "a_payer")}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Réouvrir l'engagement"
            >
              Réouvrir
            </button>
          )}
          <button
            type="button"
            onClick={() => removeEngagement(e.id)}
            aria-label="Supprimer"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function EngagementsBoard() {
  const { engagements } = useFinance()
  const [tab, setTab] = useState<Filter>("tous")
  const [formOpen, setFormOpen] = useState(false)

  const rows = engagements
    .filter((e) => tab === "tous" || e.status === tab)
    .sort((a, b) => {
      const da = a.status === "paye" && a.datePaiement ? a.datePaiement : a.dateEcheance
      const db = b.status === "paye" && b.datePaiement ? b.datePaiement : b.dateEcheance
      return tab === "paye" ? db.localeCompare(da) : da.localeCompare(db)
    })

  const total = rows.reduce((acc, e) => acc + e.montant, 0)
  const count = (s: Filter) => (s === "tous" ? engagements.length : engagements.filter((e) => e.status === s).length)

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Sorties prévisionnelles</h2>
          <p className="text-xs text-muted-foreground">Engagements par chèque &amp; LCN — le règlement bascule vers l&apos;historique.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" /> Nouvel engagement
        </button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-2 py-2">
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <t.icon className="size-4" />
              {t.label}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", active ? "bg-primary-foreground/20" : "bg-secondary")}>
                {count(t.key)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Libellé</th>
              <th className="px-3 py-2.5 font-medium">Entreprise</th>
              <th className="px-3 py-2.5 text-right font-medium">Montant</th>
              <th className="px-3 py-2.5 font-medium">Mode</th>
              <th className="hidden px-3 py-2.5 font-medium md:table-cell">Banque</th>
              <th className="px-3 py-2.5 font-medium">{tab === "paye" ? "Réglé le" : "Échéance"}</th>
              <th className="px-3 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  Aucun engagement dans cette catégorie.
                </td>
              </tr>
            ) : (
              rows.map((e) => <EngagementRow key={e.id} engagement={e} showStatus={tab === "tous"} />)
            )}
          </tbody>
          {rows.length > 0 ? (
            <tfoot>
              <tr className="border-t border-border bg-secondary/30">
                <td className="px-3 py-3 text-xs font-medium uppercase text-muted-foreground" colSpan={2}>
                  Total {TABS.find((t) => t.key === tab)?.label}
                </td>
                <td className="px-3 py-3 text-right font-semibold">
                  <Amount value={total} />
                </td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      <EngagementForm open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  )
}
