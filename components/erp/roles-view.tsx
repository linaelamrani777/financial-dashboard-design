"use client"

import { useMemo, useState } from "react"
import { Plus, Search, ChevronDown, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { SlideOver } from "@/components/erp/slide-over"
import { INITIAL_ROLES, PERMISSION_GROUPS, type Role } from "@/lib/roles-data"

export function RolesView() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [query, setQuery] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return roles
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.permissions.some((p) => p.toLowerCase().includes(q)),
    )
  }, [roles, query])

  function openCreate() {
    setEditing(null)
    setPanelOpen(true)
  }

  function openEdit(role: Role) {
    setEditing(role)
    setPanelOpen(true)
  }

  function handleSave(role: Role) {
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === role.id)
      return exists ? prev.map((r) => (r.id === role.id ? role : r)) : [...prev, role]
    })
    setPanelOpen(false)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Roles &amp; Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Définissez les niveaux d&apos;accès en combinant des rôles et des jeux de permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden />
          Create role
        </button>
      </header>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un rôle ou une permission"
            className="w-full rounded-lg border border-border bg-secondary py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          {filtered.length} of {roles.length} roles
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[160px_1fr] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Role</span>
          <span>Permissions</span>
        </div>
        <ul>
          {filtered.map((role) => (
            <li
              key={role.id}
              className="grid grid-cols-[160px_1fr] gap-4 border-b border-border px-5 py-5 last:border-b-0"
            >
              <div>
                <button
                  type="button"
                  onClick={() => openEdit(role)}
                  className="inline-flex items-center rounded-md bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
                >
                  {role.name}
                </button>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {role.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-secondary px-2.5 py-1 text-xs text-foreground/80"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="px-5 py-12 text-center text-sm text-muted-foreground">
              Aucun rôle ne correspond à votre recherche.
            </li>
          ) : null}
        </ul>
      </div>

      <RolePanel
        key={editing?.id ?? "new"}
        open={panelOpen}
        role={editing}
        onClose={() => setPanelOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

function RolePanel({
  open,
  role,
  onClose,
  onSave,
}: {
  open: boolean
  role: Role | null
  onClose: () => void
  onSave: (role: Role) => void
}) {
  const [name, setName] = useState(role?.name ?? "")
  const [description, setDescription] = useState(role?.description ?? "")
  const [selected, setSelected] = useState<Set<string>>(new Set(role?.permissions ?? []))
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set([PERMISSION_GROUPS[0].key]))

  function togglePermission(p: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(p)) next.delete(p)
      else next.add(p)
      return next
    })
  }

  function toggleGroup(key: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleAllInGroup(perms: string[], allOn: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      perms.forEach((p) => (allOn ? next.delete(p) : next.add(p)))
      return next
    })
  }

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave({
      id: role?.id ?? trimmed.toLowerCase().replace(/\s+/g, "-"),
      name: trimmed,
      description: description.trim() || undefined,
      permissions: [...selected].sort(),
    })
  }

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={role ? "Edit Role" : "Create Role"}
      description={
        role ? "Modifiez le rôle et ses permissions." : "Combinez un nom de rôle avec un jeu de permissions."
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{selected.size} permission(s)</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!name.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {role ? "Enregistrer" : "Créer le rôle"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Role Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Depot Supervisor"
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" aria-hidden />
            <p className="text-sm font-medium text-foreground">Permissions</p>
          </div>

          <div className="space-y-2">
            {PERMISSION_GROUPS.map((group) => {
              const isOpen = openGroups.has(group.key)
              const selectedCount = group.permissions.filter((p) => selected.has(p)).length
              const allOn = selectedCount === group.permissions.length
              return (
                <div key={group.key} className="overflow-hidden rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className="flex w-full items-center justify-between gap-3 bg-secondary/40 px-3 py-2.5 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <ChevronDown
                        className={cn(
                          "size-4 text-muted-foreground transition-transform",
                          isOpen ? "" : "-rotate-90",
                        )}
                        aria-hidden
                      />
                      <span className="text-sm font-medium text-foreground">{group.label}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedCount}/{group.permissions.length}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="space-y-1.5 p-3">
                      <p className="mb-1 text-xs italic text-muted-foreground">{group.description}</p>
                      <button
                        type="button"
                        onClick={() => toggleAllInGroup(group.permissions, allOn)}
                        className="mb-1 text-xs font-medium text-primary hover:underline"
                      >
                        {allOn ? "Tout désélectionner" : "Tout sélectionner"}
                      </button>
                      {group.permissions.map((p) => {
                        const on = selected.has(p)
                        return (
                          <label
                            key={p}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
                              on
                                ? "border-primary/40 bg-primary/10 text-foreground"
                                : "border-border bg-secondary/40 text-foreground/80 hover:bg-secondary",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => togglePermission(p)}
                              className="size-4 accent-primary"
                            />
                            {p}
                          </label>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SlideOver>
  )
}
