"use client"

import { useState } from "react"
import { Users, Banknote, Building2, FileSignature, ShieldCheck, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Amount } from "@/components/amount"
import { FIXED_COMMITMENTS, type FixedCommitment } from "@/lib/finance-data"

const CATEGORY_META: Record<FixedCommitment["categorie"], { icon: typeof Users }> = {
  "Masse salariale": { icon: Users },
  "Charges sociales": { icon: ShieldCheck },
  Crédit: { icon: Banknote },
  "Engagement bancaire": { icon: FileSignature },
  Loyer: { icon: Building2 },
}

export function FixedChargesSection() {
  const [open, setOpen] = useState<string | null>("Masse salariale")

  const categories = Array.from(new Set(FIXED_COMMITMENTS.map((c) => c.categorie)))
  const grandTotal = FIXED_COMMITMENTS.reduce((a, c) => a + c.montantMensuel, 0)

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h2 className="text-base font-semibold">Charges fixes mensuelles</h2>
          <p className="text-xs text-muted-foreground">Masse salariale, crédits, engagements &amp; loyers.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total / mois</div>
          <div className="font-semibold text-primary">
            <Amount value={grandTotal} />
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {categories.map((cat) => {
          const items = FIXED_COMMITMENTS.filter((c) => c.categorie === cat)
          const total = items.reduce((a, c) => a + c.montantMensuel, 0)
          const Icon = CATEGORY_META[cat].icon
          const isOpen = open === cat
          return (
            <div key={cat}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : cat)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{cat}</div>
                    <div className="text-xs text-muted-foreground">{items.length} ligne{items.length > 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    <Amount value={total} />
                  </span>
                  <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>
              {isOpen ? (
                <ul className="space-y-1 px-4 pb-3">
                  {items.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5 text-sm"
                    >
                      <div>
                        <div className="font-medium">{c.libelle}</div>
                        <div className="text-xs text-muted-foreground">{c.banque}</div>
                      </div>
                      <Amount value={c.montantMensuel} className="font-medium" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
