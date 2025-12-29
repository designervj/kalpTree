"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

interface formData {
  _id?: string;
  code: string;
  name: string;
  permissions: string[];
}

export default function RolesManagement() {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<formData | null>(null);
  const [formData, setFormData] = useState<formData>({
    code: "",
    name: "",
    permissions: [],
  });

  const availablePermissions = [
  // Dashboard
  "dashboard:create",
  "dashboard:read",
  "dashboard:update",
  "dashboard:delete",

  // Analytics
  "analytics:create",
  "analytics:read",
  "analytics:update",
  "analytics:delete",

  // Security / System
  "security:create",
  "security:read",
  "security:update",
  "security:delete",

  // Websites / CMS
  "websites:create",
  "websites:read",
  "websites:update",
  "websites:delete",

  // Media
  "media:create",
  "media:read",
  "media:update",
  "media:delete",

  // Content / Branding / Marketing / Users / Settings
  "content:create",
  "content:read",
  "content:update",
  "content:delete",

  // Products & E-commerce core
  "product:create",
  "product:read",
  "product:update",
  "product:delete",

  // AI Studio
  "ai:create",
  "ai:read",
  "ai:update",
  "ai:delete",
];


  type PermissionGroups = Record<string, string[]>;

const permissionGroups: PermissionGroups = availablePermissions.reduce(
  (acc, permission) => {
    const [resource, action] = permission.split(":");

    if (!acc[resource]) {
      acc[resource] = [];
    }

    if (!acc[resource].includes(action)) {
      acc[resource].push(action);
    }

    return acc;
  },
  {} as PermissionGroups
);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      const data = await response.json();
      setRoles(data.items);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleOpenModal = (role: formData | null = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        code: role.code,
        name: role.name,
        permissions: role.permissions,
      });
    } else {
      setEditingRole(null);
      setFormData({
        code: "",
        name: "",
        permissions: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({
      code: "",
      name: "",
      permissions: [],
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permission: any) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const url = editingRole ? `/api/roles/${editingRole._id}` : "/api/roles";
      const method = editingRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchRoles();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRoles();
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const togglePermission = (resource: string, action: string) => {
  const permission = `${resource}:${action}`;

  setFormData((prev) => ({
    ...prev,
    permissions: prev.permissions.includes(permission)
      ? prev.permissions.filter((p) => p !== permission)
      : [...prev.permissions, permission],
  }));
};
  const hasPermission = (resource: string, action: string) => {
  return formData.permissions.includes(`${resource}:${action}`);
};
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Roles Management </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Roles Found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first role. Roles help you manage
              permissions and access control in your application.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Your First Role
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role: formData) => (
            <div
              key={role._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {role.name}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {role.code}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(role)}
                    className="p-2 text-black hover:bg-blue-50 rounded-sm transition-colors border  border-gray-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(role._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors border border-gray-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Permissions ({role.permissions.length})
                </h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded shadow-sm "
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingRole ? "Edit Role" : "Add New Role"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., admin, user, manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Administrator, User, Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  {/* <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div> */}
                   <div className="space-y-4">
    {Object.entries(permissionGroups).map(([resource, actions]) => (
      <div
        key={resource}
        className="border border-gray-200 rounded-lg p-4"
      >
        <div className="font-semibold text-gray-800 capitalize mb-3">
          {resource}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.map((action) => (
            <label
              key={action}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={hasPermission(resource, action)}
                onChange={() => togglePermission(resource, action)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm capitalize">{action}</span>
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingRole ? "Update Role" : "Create Role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
