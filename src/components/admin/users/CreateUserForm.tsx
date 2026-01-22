"use client";

import { useMemo, useState } from "react";
import { User, Lock, Shield, Check } from "lucide-react";
import { User as Usertype } from "@/types";

interface UserFormData {
  email: string;
  password: string;
  role: string;
  permissions: string[];
  name: string;
  createdById: string;
}

interface CreateUserFormProps {
  user: Usertype;
}

export default function CreateUserForm({ user, roles }: any) {
  const filteredRoles = roles.items.filter(
    (d: any) => d.code.includes(user.role) && d.code !== user.role,
  );

  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    role: "",
    permissions: [],
    name: "",
    createdById: user.id,
  });

  const PERMISSION_CATEGORIES = useMemo<Record<string, string[]>>(() => {
    const rolefiltered = filteredRoles.find((d: any) => {
      return d.code == formData.role;
    });
    if (!rolefiltered) return [];
    return rolefiltered.permissions.reduce(
      (acc: any, permission: any) => {
        const category = permission.split(":")[0];
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [formData.role]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const allPermissions =
    PERMISSION_CATEGORIES && Object.values(PERMISSION_CATEGORIES).flat();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleCategoryToggle = (category: string[]) => {
    const allSelected = category.every((p) => formData.permissions.includes(p));
    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !category.includes(p))
        : [...new Set([...prev.permissions, ...category])],
    }));
  };

  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions:
        prev.permissions.length === allPermissions.length
          ? []
          : [...allPermissions],
    }));
  };

  const isCategorySelected = (category: string[]) => {
    return category.every((p) => formData.permissions.includes(p));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/public/onboarding/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "User created successfully!" });
        setFormData({
          email: "",
          password: "",
          role: "agency",
          permissions: [],
          name: "",
          createdById: user.id,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create user",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while creating the user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPermissionColor = (permission: string) => {
    if (permission.includes("create"))
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (permission.includes("read"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (permission.includes("update"))
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (permission.includes("delete"))
      return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-purple-100 text-purple-700 border-purple-200";
  };

  const sentenceCase = (s: string) => {
    if (!s) return "";
    let t = s[0].toUpperCase() + s.slice(1).toLowerCase();
    return t;
  };

  return (
    <div className="">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8" />
            Create New User
          </h2>
          <p className="text-blue-100 mt-1">
            Set up a new user account with custom permissions
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                User Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value={""}>Select Role</option>
                  {filteredRoles.map((d: any) => {
                    return (
                      <option key={d.code} value={d.code}>
                        {d.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Name
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Permissions
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.permissions.length} of {allPermissions.length}{" "}
                  selected
                </p>
              </div>
              <button
                type="button"
                onClick={handleSelectAllPermissions}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium text-sm transition-colors"
              >
                {formData.permissions.length === allPermissions.length
                  ? "Clear All"
                  : "Select All"}
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(PERMISSION_CATEGORIES).map(
                ([category, permissions]) => (
                  <div
                    key={category}
                    className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800 text-base">
                        {sentenceCase(category)}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(permissions)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isCategorySelected(permissions)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {isCategorySelected(permissions)
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <button
                          key={permission}
                          type="button"
                          onClick={() => handlePermissionToggle(permission)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all transform hover:scale-105 ${
                            formData.permissions.includes(permission)
                              ? getPermissionColor(permission) + " shadow-sm"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {formData.permissions.includes(permission) && (
                              <Check className="w-4 h-4" />
                            )}
                            {permission.split(":")[1]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl border-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating User...
              </span>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
