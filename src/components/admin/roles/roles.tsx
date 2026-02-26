"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Eye, Router } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchRolePermissions,
  RolePermissionModel,
  setCurrentRolePermission,
} from "@/hooks/slices/RolePermissions/rolePermissionSlice";
import { availablePermissions } from "./util/AllPermissionLayout";

interface formData {
  _id?: string;
  tenantId?: string;
  code: string;
  name: string;
  permissions: string[];
}

type Props = {
  businessid?: string
}
export default function RolesManagement({ businessid }: Props) {

  const { user } = useSelector((state: RootState) => state.user)
  const { rolesPermissions: roles } = useSelector(
    (state: RootState) => state.rolePermission
  );
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create" | null>(
    null
  );

  const getParams = useSearchParams();
  const businessId = getParams.get("businessid");
  const agencyid = getParams.get("agencyid");

  const { currentBusiness } = useSelector((state: RootState) => state.business)
  const [selectedRole, setSelectedRole] = useState<formData | null>(null);
  const [formData, setFormData] = useState<formData>({
    tenantId: "",
    code: "",
    name: "",
    permissions: [],
  });

  const dispatch = useDispatch<AppDispatch>();



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

  // useEffect(() => {
  //   if (roles.length <= 0) {
  //     dispatch(fetchRolePermissions());
  //   }
  // }, []);

  const router = useRouter();

  const categorizePermissions = (permissions: string[]) => {
    const categories: { [key: string]: string[] } = {};
    permissions.forEach((perm) => {
      const [category, action] = perm.split(":");
      if (!categories[category]) categories[category] = [];
      categories[category].push(action);
    });
    return categories;
  };



  const closeModal = () => {
    setModalMode(null);
    setSelectedRole(null);
    setFormData({
      tenantId: "",
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

  const handleSubmit = async () => {
    if (!formData.code || !formData.name) {
      alert("Please fill in all required fields");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tenantId: businessid ?? user?.tenantId,
    }));

    try {
      const url = selectedRole
        ? `/api/roles/${selectedRole._id}`
        : "/api/roles";
      const method = selectedRole ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // fetchRoles();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleEdit = (role: RolePermissionModel) => {
    dispatch(setCurrentRolePermission(role));
    // router.push(`/admin/rolesandpermission/${role?._id}`);
       const finalBusinessId = businessid || businessId;
    const finalAgencyId = agencyid || currentBusiness?.tenantId;

    if (
      finalBusinessId &&
      finalAgencyId &&
      currentBusiness?.website?.primaryDomain &&
      currentBusiness.website.primaryDomain.length > 0
    ) {
      router.push(
        `/admin/websites/${currentBusiness.website.primaryDomain[0]}/users/roles-permissions/${role?._id}?businessid=${finalBusinessId}&agencyid=${finalAgencyId}`
      );
    } else {
      router.push(`/admin/rolesandpermission/${role?._id}`);
    }
  }

  const handleCreateRole = () => {
    const finalBusinessId = businessid || businessId;
    const finalAgencyId = agencyid || currentBusiness?.tenantId;

    if (
      finalBusinessId &&
      finalAgencyId &&
      currentBusiness?.website?.primaryDomain &&
      currentBusiness.website.primaryDomain.length > 0
    ) {
      router.push(
        `/admin/websites/${currentBusiness.website.primaryDomain[0]}/users/roles-permissions/create?businessid=${finalBusinessId}&agencyid=${finalAgencyId}`
      );
    } else {
      router.push(`/admin/rolesandpermission/create`);
    }
  };


  const handleDelete = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // fetchRoles();
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const selectedCategorized = selectedRole
    ? categorizePermissions(selectedRole.permissions)
    : {};

  return (
    <div className="min-h-screen">
      <div className=" mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Roles & Permissions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review your members roles and allocate permissions
            </p>
          </div>

          <Button
            onClick={handleCreateRole}
          >
            Create New Role
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles && roles.length > 0 ?roles.map((role: RolePermissionModel) => (
            <div
              key={role._id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {role.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{role.code}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">
                  {role?.permissions?.length} Permissions
                </p>
              </div>

              <div className="flex gap-2">
                {/* <Button
                  onClick={() => openModal("view", role)}
                  variant="outline"
                  className="w-[50%]"
                  // className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button> */}
                <Button
                  // onClick={() => openModal("view", role)}
                  onClick={() => handleEdit(role)}
                  className="flex-1"
                // className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </div>
          )) : <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No roles found</p>
          </div>}
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {modalMode === "view" && "View Role"}
                {modalMode === "edit" && "Edit Role"}
                {modalMode === "create" && "Create New Role"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalMode === "view" ? (
                // View Mode
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Name
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedRole?.name}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Code
                    </label>
                    <p className="text-base text-gray-900">
                      {selectedRole?.code}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="space-y-4">
                      {Object.entries(selectedCategorized).map(
                        ([category, actions]) => (
                          <div key={category} className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2 capitalize">
                              {category}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {actions.map((action) => (
                                <span
                                  key={action}
                                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Edit/Create Mode
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter role code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="space-y-4">
                      {Object.entries(permissionGroups).map(
                        ([category, actions]) => (
                          <div key={category} className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3 capitalize">
                              {category}
                            </h4>
                            <div className="space-y-2">
                              {actions.map((action) => {
                                const permission = `${category}:${action}`;
                                return (
                                  <label
                                    key={permission}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions.includes(
                                        permission
                                      )}
                                      onChange={() =>
                                        togglePermission(category, action)
                                      }
                                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                      {action}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>
              {modalMode !== "view" && (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                >
                  {modalMode === "create" ? "Create Role" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
