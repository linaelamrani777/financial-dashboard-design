export type PermissionGroup = {
  key: string
  label: string
  description: string
  permissions: string[]
}

// Grouped view of the full permission catalog (from the provided list).
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "paiements",
    label: "Paiements",
    description: "Gérer tout le cycle de vie des paiements fournisseurs.",
    permissions: ["payment.approve", "payment.cancel", "payment.create", "payment.update", "payment.view"],
  },
  {
    key: "cheques",
    label: "Chèques",
    description: "Émission et suivi des chèques et LCN.",
    permissions: ["check.create", "check.issue", "check.view"],
  },
  {
    key: "achats",
    label: "Achats & Commandes",
    description: "Bons de commande et réponses fournisseurs.",
    permissions: ["purchase_order.manage", "purchase_order.respond", "purchase_order.view"],
  },
  {
    key: "livraisons",
    label: "Livraisons",
    description: "Bons de livraison et validations.",
    permissions: [
      "delivery_note.manage",
      "delivery_note.respond",
      "delivery_note.submit",
      "delivery_note.view",
    ],
  },
  {
    key: "factures",
    label: "Factures",
    description: "Soumission, validation et gestion des factures.",
    permissions: ["invoice.manage", "invoice.respond", "invoice.submit", "invoice.view"],
  },
  {
    key: "fournisseurs",
    label: "Fournisseurs",
    description: "Gestion et performance des fournisseurs.",
    permissions: ["supplier.manage", "supplier.view", "supplier_performance.manage"],
  },
  {
    key: "documents",
    label: "Documents",
    description: "Chargement et gestion des documents.",
    permissions: ["document.manage", "document.upload"],
  },
  {
    key: "tresorerie",
    label: "Trésorerie & Conventions",
    description: "Vue trésorerie et gestion des conventions.",
    permissions: ["treasury.view", "convention.manage", "convention.view"],
  },
  {
    key: "systeme",
    label: "Système & Sécurité",
    description: "Contrôle d'accès, politiques et notifications.",
    permissions: [
      "approval.review",
      "audit.view",
      "calendar.manage",
      "dashboard.view",
      "notification.manage",
      "policy.manage",
      "rbac.manage",
    ],
  },
]

export const ALL_PERMISSIONS: string[] = PERMISSION_GROUPS.flatMap((g) => g.permissions).sort()

export type Role = {
  id: string
  name: string
  description?: string
  permissions: string[]
}

export const INITIAL_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Accès complet à toutes les fonctionnalités.",
    permissions: [...ALL_PERMISSIONS],
  },
  {
    id: "supplier",
    name: "Supplier",
    description: "Accès limité au portail fournisseur.",
    permissions: [
      "check.view",
      "delivery_note.submit",
      "delivery_note.view",
      "document.upload",
      "invoice.submit",
      "invoice.view",
      "payment.view",
      "purchase_order.respond",
      "purchase_order.view",
    ],
  },
]
