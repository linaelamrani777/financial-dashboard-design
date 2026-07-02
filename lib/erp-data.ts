export interface MonthlyPoint {
  month: string
  invoiced: number
  paid: number
}

export interface ActivityItem {
  id: string
  type: "invoice" | "payment" | "po" | "delivery" | "check"
  label: string
  company: string
  amount: number
  date: string
  status: "paid" | "pending" | "overdue" | "draft"
}

export interface ErpKpis {
  totalInvoiced: number
  outstanding: number
  paidThisMonth: number
  overdueAmount: number
  overdueCount: number
  openPoValue: number
  openPoCount: number
  pendingDeliveries: number
  checksPendingValue: number
  checksPendingCount: number
  avgPaymentDelay: number
  collectionRate: number
}

const madFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 })
const madCompact = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 })

export function formatMAD(amount: number): string {
  return `${madFormatter.format(amount)} MAD`
}

export function formatMADCompact(amount: number): string {
  return `${madCompact.format(amount)} MAD`
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

const today = new Date()
function dayOffset(days: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const MONTHLY_TREND: MonthlyPoint[] = [
  { month: "Jan", invoiced: 1_240_000, paid: 1_090_000 },
  { month: "Fév", invoiced: 980_000, paid: 1_010_000 },
  { month: "Mar", invoiced: 1_530_000, paid: 1_320_000 },
  { month: "Avr", invoiced: 1_180_000, paid: 1_240_000 },
  { month: "Mai", invoiced: 1_720_000, paid: 1_400_000 },
  { month: "Juin", invoiced: 1_460_000, paid: 1_510_000 },
]

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "invoice", label: "Facture FA-2041", company: "Sotrameg SARL", amount: 184_500, date: dayOffset(-1), status: "pending" },
  { id: "a2", type: "payment", label: "Règlement FA-1987", company: "Maroc Acier", amount: 412_000, date: dayOffset(-1), status: "paid" },
  { id: "a3", type: "check", label: "Chèque CHQ-4456012", company: "BTP Atlas", amount: 320_000, date: dayOffset(-2), status: "pending" },
  { id: "a4", type: "po", label: "Bon de commande BC-3310", company: "Comptoir Papetier", amount: 27_800, date: dayOffset(-3), status: "draft" },
  { id: "a5", type: "invoice", label: "Facture FA-1902", company: "Logix Trans", amount: 96_400, date: dayOffset(-4), status: "overdue" },
  { id: "a6", type: "delivery", label: "Bon de livraison BL-8842", company: "TechServ", amount: 58_900, date: dayOffset(-5), status: "pending" },
]

export const ERP_KPIS: ErpKpis = {
  totalInvoiced: 8_110_000,
  outstanding: 1_920_400,
  paidThisMonth: 1_510_000,
  overdueAmount: 341_800,
  overdueCount: 4,
  openPoValue: 742_500,
  openPoCount: 11,
  pendingDeliveries: 7,
  checksPendingValue: 698_900,
  checksPendingCount: 5,
  avgPaymentDelay: 12,
  collectionRate: 84,
}
