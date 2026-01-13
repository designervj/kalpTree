"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  Save,
  Loader2,
  ArrowLeft,
  Users,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchRolePermissions,
  setCurrentRolePermission,
  updateRolePermission,
} from "@/hooks/slices/RolePermissions/rolePermissionSlice";

type RoleFormData = {
  name: string;
  code: string;
  permissions: string[];
  canCreateRole: string[];
  type: "internal" | "external";
  canMultipleTenants: boolean;
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

interface Rolesprops {
  id: string;
}

export default function RolesPersmissionForm({ id }: Rolesprops) {
  const router = useRouter();

  const { rolesPermissions: roles, current } = useSelector(
    (state: RootState) => state.rolePermission
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    code: "",
    permissions: [],
    canCreateRole: [],
    type: "internal",
    canMultipleTenants: false,
  });

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<Set<Action>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Get available roles for canCreateRole (all roles with code)
  const availableRolesForCreation = useMemo(() => {
    return roles
      .filter((role) => role.code && role._id !== id)
      .map((role) => ({
        code: role.code!,
        name: role.name || role.code!,
      }));
  }, [roles, id]);

  useEffect(() => {
    setIsInitialLoading(true);
    if (!current && roles.length > 0 && id) {
      const find = roles.find((d) => d._id == id);
      if (find && find.name && find.code) {
        dispatch(setCurrentRolePermission(find));
        setFormData({
          name: find.name,
          code: find.code,
          permissions: find.permissions || [],
          canCreateRole: find.canCreateRole || [],
          type: (find.type as "internal" | "external") || "internal",
          canMultipleTenants: find.canMultipleTenants || false,
        });
      }
    } else if (current?.name && current?.code) {
      setFormData({
        name: current.name,
        code: current.code,
        permissions: current.permissions || [],
        canCreateRole: current.canCreateRole || [],
        type: (current.type as "internal" | "external") || "internal",
        canMultipleTenants: current.canMultipleTenants || false,
      });
    }

    setTimeout(() => setIsInitialLoading(false), 300);
  }, [roles, id, current, dispatch]);

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

  const toggleCanCreateRole = (roleCode: string) => {
    setFormData((prev) => ({
      ...prev,
      canCreateRole: prev.canCreateRole.includes(roleCode)
        ? prev.canCreateRole.filter((r) => r !== roleCode)
        : [...prev.canCreateRole, roleCode],
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
    return true;
  };

  const saveRole = async () => {
    if (!validate()) return false;

    setIsSaving(true);
    try {
      if (id) {
        dispatch(updateRolePermission(formData));
      } else {
        // const res = await fetch("/api/admin/roles", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(formData),
        // });

        // if (!res.ok) {
        //   const txt = await res.text().catch(() => "");
        //   throw new Error(txt || "Save failed");
        // }

        miniToast("Role saved successfully ✅");
        return true;
      }
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

  if (isInitialLoading) {
    return (
      <div className="w-full pb-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <BreadCrumbPage />
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading role permissions...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

          <Button type="button" onClick={onSaveAndClose} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save & Close"
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={selectAll}
            className="gap-2"
          >
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
          {/* Basic Role Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Super Admin"
                />
                <p className="text-xs text-muted-foreground">
                  A readable name for admins to identify the role.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Role Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, code: e.target.value }))
                  }
                  placeholder="e.g. super_admin"
                />
                <p className="text-xs text-muted-foreground">
                  A unique slug used internally (lowercase + underscores).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Role Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "internal" | "external") =>
                    setFormData((p) => ({ ...p, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Internal
                      </div>
                    </SelectItem>
                    <SelectItem value="external">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        External
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Internal roles are for organization members, external for
                  clients/partners.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="multitenants">Multiple Tenants</Label>
                  <Switch
                    id="multitenants"
                    checked={formData.canMultipleTenants}
                    onCheckedChange={(checked) =>
                      setFormData((p) => ({
                        ...p,
                        canMultipleTenants: checked,
                      }))
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enable if this role can be assigned across multiple tenants.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Can Create Roles */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">
                Role Creation Permissions
              </h3>
              <Badge variant="outline">
                {formData.canCreateRole.length} selected
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Select which roles this role can create. This determines what user
              roles can be assigned by someone with this role.
            </p>

            {availableRolesForCreation.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {availableRolesForCreation.map((role) => {
                  const isSelected = formData.canCreateRole.includes(role.code);
                  return (
                    <label
                      key={role.code}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3",
                        "hover:bg-muted/40 transition cursor-pointer",
                        isSelected && "border-primary bg-primary/5"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCanCreateRole(role.code)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{role.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.code}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No other roles available. Create additional roles to enable
                  role creation permissions.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Permission tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Module Permissions</h3>
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
                  const active =
                    actionFilter.size === 0 ? true : actionFilter.has(a);
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
                <Button
                  type="button"
                  onClick={() => setActionFilter(new Set())}
                  className="h-9"
                >
                  Reset filter
                </Button>
              </div>
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
                          <div className="text-base font-semibold">
                            {titleCase(category)}
                          </div>
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
                        const checked =
                          formData.permissions.includes(permission);

                        return (
                          <label
                            key={permission}
                            className={cn(
                              "flex items-center gap-3 rounded-md border px-3 py-2",
                              "flex-1 md:flex-none",
                              "hover:bg-muted/40 transition cursor-pointer"
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() =>
                                togglePermission(permission)
                              }
                            />
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={checked ? "default" : "secondary"}
                                className="text-[11px]"
                              >
                                {ACTION_META[action].badge}
                              </Badge>
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
            <div className="text-sm font-semibold mb-2">
              Preview (selected permissions)
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.permissions.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  No permissions selected.
                </span>
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
    </div>
  );
}
