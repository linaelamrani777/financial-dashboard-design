"use client"

import { useState } from "react"
import { Landmark, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFinance } from "@/components/finance-provider"
import { Amount } from "@/components/amount"
import { Modal } from "@/components/modal"
import { BANKS, formatDate, type Bank } from "@/lib/finance-data"

function totalEngagement(b: Bank): number {
  return b.creditRestantDu + b.decouvertUtilise + b.cautions
}

function Gauge({ used, max, label }: { used: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  const tone = pct >= 85 ? "bg-destructive" : pct >= 60 ? "bg-amber-400" : "bg-primary"
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Rubric({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  )
}

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", strong ? "font-semibold text-foreground" : "")}>
        <Amount value={value} />
      </span>
    </div>
  )
}

function BankDetail({ bank, onClose }: { bank: Bank; onClose: () => void }) {
  const { engagements } = useFinance()
  const effets = engagements.filter((e) => e.banque === bank.nom && e.status !== "paye")
  const lcnUtilise = effets.filter((e) => e.methode === "LCN").reduce((a, e) => a + e.montant, 0)
  const decouvertDispo = bank.decouvertAutorise - bank.decouvertUtilise

  return (
    <Modal
      open
      onClose={onClose}
      title={bank.nom}
      description={`Tableau de bord des engagements — ${bank.abreviation}`}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Engagement total</p>
          <p className="mt-1 text-2xl font-semibold">
            <Amount value={totalEngagement(bank)} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Crédit restant dû + découvert utilisé + cautions</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Rubric label="Découvert">
            <Line label="Autorisé" value={bank.decouvertAutorise} />
            <Line label="Utilisé" value={bank.decouvertUtilise} />
            <Line label="Disponible" value={decouvertDispo} strong />
            <Gauge used={bank.decouvertUtilise} max={bank.decouvertAutorise} label="Taux d'utilisation" />
          </Rubric>

          <Rubric label="Ligne d'escompte / LCN">
            <Line label="Plafond" value={bank.ligneEscompte} />
            <Line label="Effets en cours" value={lcnUtilise} />
            <Line label="Disponible" value={Math.max(0, bank.ligneEscompte - lcnUtilise)} strong />
            <Gauge used={lcnUtilise} max={bank.ligneEscompte} label="Taux d'utilisation" />
          </Rubric>

          <Rubric label="Crédit moyen / long terme">
            <Line label="Restant dû" value={bank.creditRestantDu} strong />
            <Line label="Échéance mensuelle" value={bank.echeanceMensuelle} />
          </Rubric>

          <Rubric label="Cautions & avals · Masse salariale">
            <Line label="Cautions données" value={bank.cautions} />
            <Line label="Masse salariale domiciliée" value={bank.masseSalariale} />
          </Rubric>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Effets à régler sur cette banque
          </p>
          {effets.length === 0 ? (
            <p className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
              Aucun effet en attente.
            </p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {effets.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 bg-background px-3 py-2.5 text-sm">
                  <div>
                    <div className="font-medium">{e.nom}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.entreprise} · {e.methode} · {formatDate(e.dateEcheance)}
                    </div>
                  </div>
                  <Amount value={e.montant} className="font-semibold" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  )
}

export function BanksSection() {
  const { engagements } = useFinance()
  const [openBank, setOpenBank] = useState<Bank | null>(null)

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-base font-semibold">Engagements bancaires</h2>
        <p className="text-xs text-muted-foreground">Cliquez sur une banque pour ouvrir son tableau de bord détaillé.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        {BANKS.map((b) => {
          const effets = engagements.filter((e) => e.banque === b.nom && e.status !== "paye").length
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setOpenBank(b)}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary/50 hover:bg-secondary/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Landmark className="size-5" />
                </span>
                <div>
                  <div className="font-medium">{b.nom}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.abreviation} · {effets} effet{effets > 1 ? "s" : ""} en attente
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Engagement</div>
                  <div className="font-semibold">
                    <Amount value={totalEngagement(b)} />
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </button>
          )
        })}
      </div>

      {openBank ? <BankDetail bank={openBank} onClose={() => setOpenBank(null)} /> : null}
    </section>
  )
}
