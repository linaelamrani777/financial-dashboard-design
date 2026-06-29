export type PaymentMethod = "Chèque" | "LCN"
export type EngagementStatus = "a_payer" | "en_cours" | "paye"

export interface Engagement {
  id: string
  nom: string
  entreprise: string
  montant: number
  methode: PaymentMethod
  reference: string
  banque: string
  dateEcheance: string
  datePaiement?: string
  status: EngagementStatus
}

export interface FixedCommitment {
  id: string
  categorie: "Masse salariale" | "Crédit" | "Engagement bancaire" | "Loyer" | "Charges sociales"
  libelle: string
  banque: string
  montantMensuel: number
}

export interface Bank {
  id: string
  nom: string
  abreviation: string
  /** découvert autorisé */
  decouvertAutorise: number
  /** découvert utilisé */
  decouvertUtilise: number
  /** ligne d'escompte / LCN */
  ligneEscompte: number
  /** cautions & avals */
  cautions: number
  /** crédit moyen terme restant dû */
  creditRestantDu: number
  /** échéance mensuelle du crédit */
  echeanceMensuelle: number
  /** masse salariale domiciliée */
  masseSalariale: number
}

export type ModuleKey = "engagements" | "banques" | "fixes"

export const MODULES: { key: ModuleKey; label: string; description: string }[] = [
  {
    key: "engagements",
    label: "Engagements & Sorties",
    description: "Chèques, LCN et sorties prévisionnelles",
  },
  {
    key: "banques",
    label: "Engagements bancaires",
    description: "Détail des engagements par banque",
  },
  {
    key: "fixes",
    label: "Charges fixes",
    description: "Masse salariale, crédits, loyers",
  },
]

export const BANKS: Bank[] = [
  {
    id: "awb",
    nom: "Attijariwafa Bank",
    abreviation: "AWB",
    decouvertAutorise: 3_000_000,
    decouvertUtilise: 1_840_000,
    ligneEscompte: 2_500_000,
    cautions: 650_000,
    creditRestantDu: 4_200_000,
    echeanceMensuelle: 78_000,
    masseSalariale: 540_000,
  },
  {
    id: "boa",
    nom: "Bank of Africa",
    abreviation: "BOA",
    decouvertAutorise: 1_500_000,
    decouvertUtilise: 920_000,
    ligneEscompte: 1_200_000,
    cautions: 300_000,
    creditRestantDu: 1_850_000,
    echeanceMensuelle: 42_000,
    masseSalariale: 0,
  },
  {
    id: "bp",
    nom: "Banque Populaire",
    abreviation: "BP",
    decouvertAutorise: 2_000_000,
    decouvertUtilise: 410_000,
    ligneEscompte: 1_800_000,
    cautions: 220_000,
    creditRestantDu: 2_600_000,
    echeanceMensuelle: 55_000,
    masseSalariale: 0,
  },
  {
    id: "cih",
    nom: "CIH Bank",
    abreviation: "CIH",
    decouvertAutorise: 800_000,
    decouvertUtilise: 0,
    ligneEscompte: 600_000,
    cautions: 0,
    creditRestantDu: 0,
    echeanceMensuelle: 0,
    masseSalariale: 0,
  },
]

export const FIXED_COMMITMENTS: FixedCommitment[] = [
  { id: "f1", categorie: "Masse salariale", libelle: "Salaires nets — personnel", banque: "Attijariwafa Bank", montantMensuel: 540_000 },
  { id: "f2", categorie: "Charges sociales", libelle: "CNSS & AMO", banque: "Attijariwafa Bank", montantMensuel: 168_000 },
  { id: "f3", categorie: "Crédit", libelle: "Crédit investissement — ligne 1", banque: "Attijariwafa Bank", montantMensuel: 78_000 },
  { id: "f4", categorie: "Crédit", libelle: "Crédit matériel roulant", banque: "Bank of Africa", montantMensuel: 42_000 },
  { id: "f5", categorie: "Crédit", libelle: "Crédit fonds de roulement", banque: "Banque Populaire", montantMensuel: 55_000 },
  { id: "f6", categorie: "Engagement bancaire", libelle: "Commission caution marché", banque: "Banque Populaire", montantMensuel: 12_000 },
  { id: "f7", categorie: "Loyer", libelle: "Loyer siège & dépôt", banque: "Attijariwafa Bank", montantMensuel: 65_000 },
]

const today = new Date()
function dayOffset(days: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const INITIAL_ENGAGEMENTS: Engagement[] = [
  { id: "e1", nom: "Facture FA-2041", entreprise: "Sotrameg SARL", montant: 184_500, methode: "LCN", reference: "LCN-77120", banque: "Attijariwafa Bank", dateEcheance: dayOffset(2), status: "a_payer" },
  { id: "e2", nom: "Acompte chantier Nord", entreprise: "BTP Atlas", montant: 320_000, methode: "Chèque", reference: "CHQ-4456012", banque: "Banque Populaire", dateEcheance: dayOffset(5), status: "a_payer" },
  { id: "e3", nom: "Fournitures bureau Q3", entreprise: "Comptoir Papetier", montant: 27_800, methode: "Chèque", reference: "CHQ-4456013", banque: "Banque Populaire", dateEcheance: dayOffset(9), status: "a_payer" },
  { id: "e4", nom: "Marché transport", entreprise: "Logix Trans", montant: 96_400, methode: "LCN", reference: "LCN-77121", banque: "Bank of Africa", dateEcheance: dayOffset(14), status: "a_payer" },
  { id: "e5", nom: "Facture FA-1987", entreprise: "Maroc Acier", montant: 412_000, methode: "LCN", reference: "LCN-77100", banque: "Attijariwafa Bank", dateEcheance: dayOffset(1), status: "en_cours" },
  { id: "e6", nom: "Prestation maintenance", entreprise: "TechServ", montant: 58_900, methode: "Chèque", reference: "CHQ-4455998", banque: "Bank of Africa", dateEcheance: dayOffset(3), status: "en_cours" },
  { id: "e7", nom: "Facture FA-1902", entreprise: "Sotrameg SARL", montant: 145_000, methode: "LCN", reference: "LCN-76980", banque: "Attijariwafa Bank", dateEcheance: dayOffset(-6), datePaiement: dayOffset(-6), status: "paye" },
  { id: "e8", nom: "Loyer dépôt T2", entreprise: "Immo Anfa", montant: 65_000, methode: "Chèque", reference: "CHQ-4455900", banque: "Attijariwafa Bank", dateEcheance: dayOffset(-12), datePaiement: dayOffset(-12), status: "paye" },
  { id: "e9", nom: "Facture FA-1860", entreprise: "Maroc Acier", montant: 233_400, methode: "LCN", reference: "LCN-76900", banque: "Banque Populaire", dateEcheance: dayOffset(-20), datePaiement: dayOffset(-19), status: "paye" },
]

const dhFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })

export function formatDH(amount: number): string {
  return `${dhFormatter.format(amount)} DH`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

export function daysUntil(iso: string): number {
  const d = new Date(iso)
  const now = new Date()
  d.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - now.getTime()) / 86_400_000)
}
