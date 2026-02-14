"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { da } from "zod/v4/locales";
import { RolePermissionModel } from "@/hooks/slices/RolePermissions/rolePermissionSlice";
import { TenantModel } from "@/hooks/slices/user/accountSlice";

interface FormData {
  email: string;
  password: string;
  name: string;
  role: string;
  status: string;
  tenantId: string | string[];
}

// Helper function to categorize permissions
const categorizePermissions = (permissions: string[]) => {
  const categories: Record<string, string[]> = {};

  permissions.forEach((permission) => {
    const [category] = permission.split(":");
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(permission);
  });

  return categories;
};

// Helper function to format permission display
const formatPermission = (permission: string) => {
  const [category, action] = permission.split(":");
  return {
    category: category.charAt(0).toUpperCase() + category.slice(1),
    action: action.charAt(0).toUpperCase() + action.slice(1),
  };
};

export function UserForm() {
  const params = useParams();
  const id = params.id;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const {
    user,
    alluser,
    hasFetched: alluserfetched,
  } = useSelector((state: RootState) => state.user);

  const [availableRoles, setAvailableRoles] = useState<RolePermissionModel[]>(
    []
  );
  const { rolesPermissions, hasFetched } = useSelector(
    (state: RootState) => state.rolePermission
  );

  const { allAccounts, hasFetched: allaccountsfetched } = useSelector(
    (state: RootState) => state.account
  );

  

  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.role == "superadmin") {
      setAvailableRoles(rolesPermissions);
    } else {
      const find = rolesPermissions.find(
        (d) => d.code == user?.role
      )?.canCreateRole;
      const filteredRoles = rolesPermissions.filter((d) => {
        return find?.includes(d.code!);
      });
      setAvailableRoles(filteredRoles);
    }
  }, [user, rolesPermissions]);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    role: "",
    status: "active",
    tenantId: [],
  });

  useEffect(() => {
    if (alluser.length > 0 && id) {
      const dataifId = alluser.find((d) => d._id == id);
      if (
        dataifId &&
        dataifId.email &&
        dataifId.name &&
        dataifId.role &&
        dataifId.status &&
        dataifId.tenantId
      ) {
        setFormData({
          email: dataifId?.email,
          name: dataifId.name,
          role: dataifId?.role,
          status: dataifId?.status,
          tenantId: dataifId?.tenantId,
          password: "",
        });
      }
    }
  }, [alluser]);

  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canSelectMultipleTenants, setCanSelectMultipleTenants] =
    useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTenantDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.role) {
      const selectedRole = availableRoles.find((r) => r.code === formData.role);

      if (selectedRole) {
        setRolePermissions(selectedRole.permissions || []);
        setSelectedPermissions(selectedRole.permissions || []);
        setCanSelectMultipleTenants(selectedRole.canMultipleTenants);

        // Initialize all categories as expanded
        const categories = categorizePermissions(
          selectedRole.permissions || []
        );
        const expanded: Record<string, boolean> = {};
        Object.keys(categories).forEach((cat) => {
          expanded[cat] = true;
        });
        setExpandedCategories(expanded);

        // Reset tenantId based on canMultipleTenants
        if (selectedRole.canMultipleTenants) {
          setFormData((prev) => ({
            ...prev,
            tenantId: Array.isArray(prev.tenantId)
              ? prev.tenantId
              : prev.tenantId
              ? [prev.tenantId]
              : [],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            tenantId: Array.isArray(prev.tenantId)
              ? prev.tenantId[0] || ""
              : prev.tenantId,
          }));
        }
      }
    } else {
      setRolePermissions([]);
      setSelectedPermissions([]);
      setCanSelectMultipleTenants(false);
      setFormData((prev) => ({ ...prev, tenantId: [] }));
      setExpandedCategories({});
    }
  }, [formData.role, availableRoles]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const toggleCategoryPermissions = (
    category: string,
    permissions: string[]
  ) => {
    const allSelected = permissions.every((p) =>
      selectedPermissions.includes(p)
    );

    if (allSelected) {
      // Deselect all permissions in this category
      setSelectedPermissions((prev) =>
        prev.filter((p) => !permissions.includes(p))
      );
    } else {
      // Select all permissions in this category
      setSelectedPermissions((prev) => {
        const newPermissions = [...prev];
        permissions.forEach((p) => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
        return newPermissions;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!id && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!id && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        passwordHash: formData.password,
        name: formData.name,
        role: formData.role,
        permissions: selectedPermissions,
        status: formData.status,
        tenantId: formData.tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let result;
      if (!id) {
        let response = await fetch("/api/admin/users", {
          method: "POST",
          body: JSON.stringify(userData),
        });
        result = await response.json();
      } else {
        let response = await fetch(`/api/admin/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(userData),
        });
        result = await response.json();
      }

      if (result.success) {
        toast.success(result.message);
        if (!id) {
          setMessage({ type: "success", text: result.message });
          setFormData({
            email: "",
            password: "",
            name: "",
            role: "",
            status: "active",
            tenantId: [],
          });
          setSelectedPermissions([]);
          setRolePermissions([]);
          setErrors({});
          setCanSelectMultipleTenants(false);
        }
      } else {
        toast.error(result.message || "Not Possible");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to create user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "",
      status: "active",
      tenantId: [],
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setTenantSearchQuery("");
    setCanSelectMultipleTenants(false);
    setSelectedPermissions([]);
    setRolePermissions([]);
  };

  const toggleTenantSelection = (tenantId: string) => {
    if (canSelectMultipleTenants) {
      // Multiple selection mode (array)
      setFormData((prev) => {
        const currentIds = Array.isArray(prev.tenantId) ? prev.tenantId : [];
        const isSelected = currentIds.includes(tenantId);
        return {
          ...prev,
          tenantId: isSelected
            ? currentIds.filter((id) => id !== tenantId)
            : [...currentIds, tenantId],
        };
      });
    } else {
      // Single selection mode (string)
      setFormData((prev) => ({
        ...prev,
        tenantId: tenantId,
      }));
      setShowTenantDropdown(false);
    }
  };

  const removeTenant = (tenantId: string) => {
    if (canSelectMultipleTenants && Array.isArray(formData.tenantId)) {
      setFormData((prev) => ({
        ...prev,
        tenantId: (prev.tenantId as string[]).filter((id) => id !== tenantId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        tenantId: "",
      }));
    }
  };

  // Cast allAccounts to Tenant[] to resolve type mismatch
  const tenants = (allAccounts as TenantModel[]) || [];

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.slug?.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );

  console.log(allAccounts)


  const selectedTenants = tenants.filter((tenant) => {
    if (Array.isArray(formData.tenantId) && typeof tenant._id == "string") {
      return formData.tenantId.includes(tenant._id);
    }
    return formData.tenantId === tenant._id;
  });

  const isTenantSelected = (tenantId: string): boolean => {
    if (Array.isArray(formData.tenantId)) {
      return formData.tenantId.includes(tenantId);
    }
    return formData.tenantId === tenantId;
  };

  const categorizedPermissions = categorizePermissions(rolePermissions);

  const isDataLoading = alluser.length <= 0;

  // Show loading screen when data is not ready
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
            <p className="text-gray-600 text-center">
              Please wait while we load the required data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {id ? "Update User" : "Create User"}
          </h1>
          <p className="text-gray-600 mb-6">Add a new user to the system</p>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            {!id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a role</option>
                {availableRoles.map((role) => (
                  <option key={role._id} value={role.code}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Permissions Selection with Categories */}
            {rolePermissions.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Role Permissions
                  </h3>
                  <span className="text-xs text-gray-500">
                    {selectedPermissions.length} of {rolePermissions.length}{" "}
                    selected
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(categorizedPermissions).map(
                    ([category, permissions]) => {
                      const allSelected = permissions.every((p) =>
                        selectedPermissions.includes(p)
                      );
                      const someSelected = permissions.some((p) =>
                        selectedPermissions.includes(p)
                      );

                      return (
                        <div
                          key={category}
                          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                        >
                          <div
                            className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer hover:bg-gray-150"
                            onClick={() => toggleCategory(category)}
                          >
                            <div className="flex  items-center gap-3">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleCategoryPermissions(
                                    category,
                                    permissions
                                  );
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="font-medium text-gray-900 capitalize">
                                {category}
                              </span>
                              <span className="text-xs text-gray-500">
                                (
                                {
                                  permissions.filter((p) =>
                                    selectedPermissions.includes(p)
                                  ).length
                                }
                                /{permissions.length})
                              </span>
                            </div>
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedCategories[category] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {expandedCategories[category] && (
                            <div className="p-3 space-y-2">
                              {permissions.map((permission) => {
                                const { action } = formatPermission(permission);
                                return (
                                  <label
                                    key={permission}
                                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPermissions.includes(
                                        permission
                                      )}
                                      onChange={() =>
                                        togglePermission(permission)
                                      }
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      {action}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-auto font-mono">
                                      {permission}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Tenant Selection */}
            {formData.role && user?.role == "superadmin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant{canSelectMultipleTenants ? "s" : ""}
                  {canSelectMultipleTenants && (
                    <span className="ml-2 text-xs text-blue-600 font-normal">
                      (Multiple selection enabled)
                    </span>
                  )}
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">
                        {selectedTenants.length > 0
                          ? canSelectMultipleTenants
                            ? `${selectedTenants.length} tenant(s) selected`
                            : selectedTenants[0]?.name
                          : canSelectMultipleTenants
                          ? "Search and select tenants"
                          : "Search and select a tenant"}
                      </span>
                    </div>
                  </div>

                  {showTenantDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          value={tenantSearchQuery}
                          onChange={(e) => setTenantSearchQuery(e.target.value)}
                          placeholder="Search tenants..."
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredTenants.length > 0 ? (
                          filteredTenants.map((tenant) => (
                            <div
                              key={String(tenant._id)}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                              onClick={() =>
                                toggleTenantSelection(String(tenant._id))
                              }
                            >
                              {canSelectMultipleTenants ? (
                                <input
                                  type="checkbox"
                                  checked={isTenantSelected(String(tenant._id))}
                                  onChange={() => {}}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                              ) : (
                                <input
                                  type="radio"
                                  checked={isTenantSelected(String(tenant._id))}
                                  onChange={() => {}}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {tenant.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {tenant.slug}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No tenants found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Tenants Display */}
                {selectedTenants.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTenants.map((tenant) => (
                      <div
                        key={String(tenant._id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                      >
                        <span className="text-sm font-medium">
                          {tenant.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTenant(String(tenant._id))}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
