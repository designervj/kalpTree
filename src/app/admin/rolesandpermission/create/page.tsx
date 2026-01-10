"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { useRouter } from "next/navigation";

// (optional) If you use sonner in your project
// import { toast } from "sonner";

type RoleFormData = {
  name: string;
  code: string;
  permissions: string[];
};

const ALL_PERMISSIONS = [
  "dashboard:read",
  "dashboard:create",
  "dashboard:update",

  "analytics:read",

  "security:read",
  "security:create",
  "security:update",

  "websites:read",
  "websites:create",
  "websites:update",
  "websites:delete",

  "media:read",
  "media:create",
  "media:update",

  "content:read",
  "content:create",
  "content:update",
  "content:delete",

  "product:read",
  "product:create",
  "product:update",
  "product:delete",

  "category:read",
  "category:create",
  "category:update",
  "category:delete",

  "attribute:read",
  "attribute:create",
  "attribute:update",
  "attribute:delete",

  "segment:read",
  "segment:create",
  "segment:update",
  "segment:delete",

  "ai:read",
  "ai:create",
  "ai:update",
  "ai:delete",

  "inventory:read",
] as const;

type Action = "read" | "create" | "update" | "delete";
const ACTIONS: Action[] = ["read", "create", "update", "delete"];

const ACTION_META: Record<Action, { label: string; badge: string }> = {
  read: { label: "Read", badge: "READ" },
  create: { label: "Create", badge: "CREATE" },
  update: { label: "Update", badge: "UPDATE" },
  delete: { label: "Delete", badge: "DELETE" },
};

function titleCase(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function categorizePermissions(perms: readonly string[]) {
  const map: Record<string, Action[]> = {};
  perms.forEach((perm) => {
    const [category, actionRaw] = perm.split(":");
    const action = actionRaw as Action;
    if (!map[category]) map[category] = [];
    map[category].push(action);
  });

  Object.keys(map).forEach((cat) => {
    map[cat] = ACTIONS.filter((a) => map[cat].includes(a));
  });

  return map;
}

function miniToast(msg: string) {
  const el = document.createElement("div");
  el.innerText = msg;
  el.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-xl bg-black text-white px-4 py-2 text-sm shadow-lg";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

export default function RolesPersmissionForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    code: "",
    permissions: [],
  });

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<Set<Action>>(new Set()); // empty => all
  const [isSaving, setIsSaving] = useState(false);

  const categorized = useMemo(() => categorizePermissions(ALL_PERMISSIONS), []);
  const allSelectedCount = formData.permissions.length;
  const totalCount = ALL_PERMISSIONS.length;

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const setPermissionsBulk = (next: string[]) => {
    const uniq = Array.from(new Set(next));
    setFormData((prev) => ({ ...prev, permissions: uniq }));
  };

  const selectAll = () => setPermissionsBulk([...ALL_PERMISSIONS]);
  const clearAll = () => setPermissionsBulk([]);

  const isActionFilteredIn = (action: Action) => {
    if (actionFilter.size === 0) return true;
    return actionFilter.has(action);
  };

  const toggleActionFilter = (action: Action) => {
    setActionFilter((prev) => {
      const next = new Set(prev);
      if (next.has(action)) next.delete(action);
      else next.add(action);
      return next;
    });
  };

  const matchesSearch = (category: string) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return category.toLowerCase().includes(q);
  };

  const categoryPermissions = (category: string, actions: Action[]) =>
    actions.map((a) => `${category}:${a}`);

  const isCategoryAllSelected = (category: string, actions: Action[]) => {
    const perms = categoryPermissions(category, actions);
    return perms.every((p) => formData.permissions.includes(p));
  };

  const categorySelectedCount = (category: string, actions: Action[]) => {
    const perms = categoryPermissions(category, actions);
    return perms.filter((p) => formData.permissions.includes(p)).length;
  };

  const toggleCategoryAll = (category: string, actions: Action[]) => {
    const perms = categoryPermissions(category, actions);
    const allOn = perms.every((p) => formData.permissions.includes(p));

    if (allOn) {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => !perms.includes(p)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: Array.from(new Set([...prev.permissions, ...perms])),
      }));
    }
  };

  const visibleCategories = Object.entries(categorized)
    .filter(([category]) => matchesSearch(category))
    .map(([category, actions]) => {
      const filteredActions = actions.filter((a) => isActionFilteredIn(a));
      return [category, filteredActions] as const;
    })
    .filter(([, actions]) => actions.length > 0);

  const validate = () => {
    if (!formData.name.trim()) {
      miniToast("Role Name is required");
      return false;
    }
    if (!formData.code.trim()) {
      miniToast("Role Code is required");
      return false;
    }
    // optional: enforce slug format
    // if (!/^[a-z0-9_]+$/.test(formData.code.trim())) {
    //   miniToast("Role Code must be lowercase with underscores only");
    //   return false;
    // }
    return true;
  };

  // ✅ Replace this endpoint with your real API
  const saveRole = async () => {
    if (!validate()) return false;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Save failed");
      }

      miniToast("Role saved successfully ✅");
      return true;
    } catch (e: any) {
      miniToast(e?.message || "Something went wrong");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = async () => {
    await saveRole();
  };

  const onSaveAndClose = async () => {
    const ok = await saveRole();
    if (ok) router.push("/admin/rolesandpermission");
  };

  return (
    <div className="w-full pb-24">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <BreadCrumbPage />

        <div className="flex flex-wrap items-center gap-2">

          <Badge variant="secondary" className="gap-2">
            <Layers className="h-4 w-4" />
            Selected: {allSelectedCount}/{totalCount}
          </Badge>


             <Button
                type="button"
                variant="secondary"
                onClick={onSave}
                disabled={isSaving}
     
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Role
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={onSaveAndClose}
                disabled={isSaving}
   
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Close"
                )}
              </Button>


          <Button type="button" variant="secondary" onClick={selectAll} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Select all
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={clearAll}
            className="gap-2 bg-white hover:bg-white hover:shadow-sm"
          >
            <XCircle className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Role fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Super Admin"
              />
              <p className="text-xs text-muted-foreground">
                A readable name for admins to identify the role.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                placeholder="e.g. super_admin"
              />
              <p className="text-xs text-muted-foreground">
                A unique slug used internally (lowercase + underscores).
              </p>
            </div>
          </div>

          <Separator />

          {/* Permission tools */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules… (dashboard, media, product)"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ACTIONS.map((a) => {
                const active = actionFilter.size === 0 ? true : actionFilter.has(a);
                return (
                  <Button
                    key={a}
                    type="button"
                    variant={active ? "secondary" : "outline"}
                    onClick={() => toggleActionFilter(a)}
                    className="h-9"
                  >
                    {ACTION_META[a].label}
                  </Button>
                );
              })}
              <Button type="button" onClick={() => setActionFilter(new Set())} className="h-9">
                Reset filter
              </Button>
            </div>
          </div>

          {/* Permission list */}
          <div className="grid gap-4">
            {visibleCategories.map(([category, actions]) => {
              const selectedInCat = categorySelectedCount(category, actions);
              const totalInCat = actions.length;
              const allCat = isCategoryAllSelected(category, actions);

              return (
                <Card key={category} className="border">
                  <CardHeader className="py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-base font-semibold">{titleCase(category)}</div>
                          <Badge variant="secondary">
                            {selectedInCat}/{totalInCat}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Manage permissions for {titleCase(category)} module.
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => toggleCategoryAll(category, actions)}
                          className="h-9"
                        >
                          {allCat ? "Unselect all" : "Select all"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-5">
                    <div className="flex flex-wrap gap-3">
                      {actions.map((action) => {
                        const permission = `${category}:${action}`;
                        const checked = formData.permissions.includes(permission);

                        return (
                          <label
                            key={permission}
                            className={cn(
                              "flex items-center gap-3 rounded-md border px-3 py-2",
                              " flex-1 md:flex-none",
                              "hover:bg-muted/40 transition cursor-pointer"
                            )}
                          >
                            {/* min-w-[180px] */}
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={checked ? "default" : "secondary"}
                                className="text-[11px]"
                              >
                                {ACTION_META[action].badge}
                              </Badge>
                              {/* <span className="text-sm font-medium">{ACTION_META[action].label}</span> */}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {visibleCategories.length === 0 && (
              <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
                No permissions found for your search/filter.
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="text-sm font-semibold mb-2">Preview (selected)</div>
            <div className="flex flex-wrap gap-2">
              {formData.permissions.length === 0 ? (
                <span className="text-sm text-muted-foreground">No permissions selected.</span>
              ) : (
                formData.permissions
                  .slice()
                  .sort()
                  .map((p) => (
                    <Badge key={p} variant="secondary">
                      {p}
                    </Badge>
                  ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ STICKY SAVE OPTIONS BAR */}
      {/* <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-white/95 backdrop-blur px-3 py-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-zinc-900">Unsaved changes</span>
              <span className="hidden sm:inline">•</span>
              <span>Don’t forget to save.</span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={onSave}
                disabled={isSaving}
                className="h-10"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Role
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={onSaveAndClose}
                disabled={isSaving}
                className="h-10"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Close"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
