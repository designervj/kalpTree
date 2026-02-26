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
import { useParams, useRouter } from "next/navigation";
import { da } from "zod/v4/locales";
import { RolePermissionModel } from "@/hooks/slices/RolePermissions/rolePermissionSlice";
import { TenantModel } from "@/hooks/slices/user/accountSlice";
import { IUser } from "@/models/user";
import type { ObjectId } from "mongodb";
import { createBusinessUser, updateBusinessUser } from "@/hooks/slices/user/UserThunk";
import { setCurrentUser } from "@/hooks/slices/user/userSlice";
import { Button } from "@/components/ui/button";


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
  const id = params.id as string;
  console.log("id", id);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const {
    user,
    alluser,
    hasFetched: alluserfetched,
    currentUser: reduxCurrentUser,
  } = useSelector((state: RootState) => state.user);

  const currentUser = useMemo(() => {
    if (reduxCurrentUser) return reduxCurrentUser;
    if (id && alluser.length > 0) {
      return alluser.find((u) => u._id === id || u.id === id);
    }
    return null;
  }, [reduxCurrentUser, id, alluser]);

  const { rolesPermissions } = useSelector(
    (state: RootState) => state.rolePermission
  );
  const [availableRoles, setAvailableRoles] = useState<RolePermissionModel[]>(
    []
  );
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const { allAccounts, hasFetched: allaccountsfetched } = useSelector(
    (state: RootState) => state.account
  );

  const dispatch = useDispatch<AppDispatch>();
  const isInitialLoad = useRef(true);
  const router = useRouter();
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rolesPermissions.length > 0) {
      setAvailableRoles(rolesPermissions);
    }
  }, [rolesPermissions]);

  const [formData, setFormData] = useState<IUser>({
    email: "",
    password: "",
    name: "",
    role: "",
    status: "active",
    tenantId: "",
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    // createdById:new ObjectId()

  });



  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canSelectMultipleTenants, setCanSelectMultipleTenants] =
    useState(false);

  // update forma as per current user
  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      const userId = currentUser._id || currentUser.id;
      setFormData({
        _id: userId,
        email: currentUser.email || "",
        name: currentUser.name || "",
        role: currentUser.role || "",
        status: currentUser.status || "active",
        tenantId: currentUser.tenantId || "",
        permissions: currentUser.permissions || [],
        createdAt: currentUser.createdAt || new Date(),
        updatedAt: currentUser.updatedAt || new Date(),
      });
      if (currentUser.permissions) {
        setSelectedPermissions(currentUser.permissions);
      }
    }
  }, [currentUser]);

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
        // setSelectedPermissions(selectedRole.permissions || []); // Removed: this should only happen if not initial load
        setCanSelectMultipleTenants(false);

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
          // ... (existing commented out code)
        } else {
          // Prevent overwriting permissions on initial load if we're editing a user
          if (isInitialLoad.current && id) {
            isInitialLoad.current = false;
          } else {
            setSelectedPermissions(selectedRole.permissions || []);
          }

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
      // setFormData((prev) => ({ ...prev, tenantId: [] }));
      setExpandedCategories({});
    }
  }, [formData.role, availableRoles]);

  // Sync selectedPermissions back to formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, permissions: selectedPermissions }));
  }, [selectedPermissions]);

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
    } else if (!id && formData.password && formData.password.length < 8) {
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
    if (!currentBusiness?._id) {
      toast.error("Business not found");
      return;
    }
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email: formData.email ?? "  ",
        password: formData.password ?? "",
        name: formData.name ?? "",
        role: formData.role ?? "",
        permissions: formData.permissions ?? [],
        status: formData.status ?? "active",
        tenantId: currentBusiness?._id.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: user?._id
      };


      const result = await dispatch(createBusinessUser(userData)).unwrap();
      if (result) {
        toast.success("User created successfully");
        setFormData({
          email: "",
          password: "",
          name: "",
          role: "",
          status: "active",
          tenantId: "",
        });
        setSelectedPermissions([]);
        setRolePermissions([]);
        setErrors({});
        setCanSelectMultipleTenants(false);
        router.back()
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

  const handleUpdate = async () => {
    setMessage({ type: "", text: "" });
    if (!currentBusiness?._id) {
      toast.error("Business not found");
      return;
    }
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        _id: formData._id,
        email: formData.email ?? "  ",
        password: formData.password ?? "",
        name: formData.name ?? "",
        role: formData.role ?? "",
        permissions: formData.permissions ?? [],
        status: formData.status ?? "active",
        tenantId: currentBusiness?._id.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: user?._id
      };


      const result = await dispatch(updateBusinessUser(userData)).unwrap();
      if (result) {
        toast.success("User updated successfully");
        setFormData({
          email: "",
          password: "",
          name: "",
          role: "",
          status: "active",
          tenantId: "",
        });
        setSelectedPermissions([]);
        setRolePermissions([]);
        setErrors({});
        setCanSelectMultipleTenants(false);
        dispatch(setCurrentUser(null))
        router.back()
      }


    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log("name", name);
    console.log("value", value);

    const selectedPermission = availableRoles.find((role) => role.name === value);
    // console.log("selectedPermission", selectedPermission);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const handleSelectedRole = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log("name", name);
    console.log("value", value);

    const selectedPermission = availableRoles.find((role) => role.name === value);
    // console.log("selectedPermission", selectedPermission);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      permissions: selectedPermission?.permissions

    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleReset = () => {

    dispatch(setCurrentUser(null))
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "",
      status: "active",
      tenantId: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setTenantSearchQuery("");
    setCanSelectMultipleTenants(false);
    setSelectedPermissions([]);
    setRolePermissions([]);
    router.back()
  };

  // Cast allAccounts to Tenant[] to resolve type mismatch
  const tenants = (allAccounts as TenantModel[]) || [];

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.slug?.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );



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
    <div className="min-h-screen p-6 pt-2">
      <div className=" mx-auto">
        <div className="bg-white rounded-lg  p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {id ? "Update User" : "Create User"}
          </h1>
          <p className="text-gray-600 mb-6">Add a new user to the system</p>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === "success"
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"
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
                disabled={currentUser?._id ? true : false}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"
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
                    className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? "border-red-500" : "border-gray-300"
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
                onChange={handleSelectedRole}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.role ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select a role</option>
                {availableRoles && availableRoles.length > 0 ? availableRoles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                )) : <option value="">No roles available  </option>}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Permissions Selection with Categories */}
            {/* {rolePermissions.length > 0 && (
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
            )} */}


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
              {id ? <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update User"}
              </button> : <button
                onClick={handleSubmit}
                disabled={loading}
                // className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create User"}
              </button>}
              <Button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
