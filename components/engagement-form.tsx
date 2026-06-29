"use client"

import { useState } from "react"
import { Modal } from "@/components/modal"
import { useFinance } from "@/components/finance-provider"
import { BANKS, type PaymentMethod } from "@/lib/finance-data"
import { cn } from "@/lib/utils"

interface EngagementFormProps {
  open: boolean
  onClose: () => void
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"

const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground"

export function EngagementForm({ open, onClose }: EngagementFormProps) {
  const { addEngagement } = useFinance()
  const [nom, setNom] = useState("")
  const [entreprise, setEntreprise] = useState("")
  const [montant, setMontant] = useState("")
  const [methode, setMethode] = useState<PaymentMethod>("Chèque")
  const [reference, setReference] = useState("")
  const [banque, setBanque] = useState(BANKS[0].nom)
  const [dateEcheance, setDateEcheance] = useState(new Date().toISOString().slice(0, 10))

  function reset() {
    setNom("")
    setEntreprise("")
    setMontant("")
    setMethode("Chèque")
    setReference("")
    setBanque(BANKS[0].nom)
    setDateEcheance(new Date().toISOString().slice(0, 10))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number.parseFloat(montant)
    if (!nom.trim() || !entreprise.trim() || Number.isNaN(value) || value <= 0) return
    addEngagement({
      nom: nom.trim(),
      entreprise: entreprise.trim(),
      montant: value,
      methode,
      reference: reference.trim() || "—",
      banque,
      dateEcheance,
    })
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nouvelle sortie prévisionnelle"
      description="Ajoutez un engagement à régler par chèque ou LCN."
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nom" className={labelClass}>
            Libellé / objet
          </label>
          <input id="nom" className={inputClass} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Facture FA-2042" required />
        </div>

        <div>
          <label htmlFor="entreprise" className={labelClass}>
            Entreprise (bénéficiaire)
          </label>
          <input id="entreprise" className={inputClass} value={entreprise} onChange={(e) => setEntreprise(e.target.value)} placeholder="Sotrameg SARL" required />
        </div>

        <div>
          <label htmlFor="montant" className={labelClass}>
            Montant (DH)
          </label>
          <input id="montant" type="number" min="0" step="0.01" className={inputClass} value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="184500" required />
        </div>

        <div>
          <span className={labelClass}>Mode de paiement</span>
          <div className="grid grid-cols-2 gap-2">
            {(["Chèque", "LCN"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethode(m)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  methode === m
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="reference" className={labelClass}>
            N° {methode}
          </label>
          <input id="reference" className={inputClass} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CHQ-4456014" />
        </div>

        <div>
          <label htmlFor="banque" className={labelClass}>
            Banque
          </label>
          <select id="banque" className={inputClass} value={banque} onChange={(e) => setBanque(e.target.value)}>
            {BANKS.map((b) => (
              <option key={b.id} value={b.nom}>
                {b.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className={labelClass}>
            Date d&apos;échéance
          </label>
          <input id="date" type="date" className={inputClass} value={dateEcheance} onChange={(e) => setDateEcheance(e.target.value)} required />
        </div>

        <div className="mt-1 flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
            Annuler
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Ajouter l&apos;engagement
          </button>
        </div>
      </form>
    </Modal>
  )
}
