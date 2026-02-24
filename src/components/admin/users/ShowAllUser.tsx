"use client";

import { AppDispatch, RootState } from '@/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTableExt } from '../DataTableExt';
import { setCurrentUser } from '@/hooks/slices/user/userSlice';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';
import { IUser } from '@/models/user';
import { RolePermissionModel, setCurrentRolePermission } from '@/hooks/slices/RolePermissions/rolePermissionSlice';

const ShowAllUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { alluser } = useSelector((state: RootState) => state.user)
  const createHref = "/admin/users/create";

  const handlePermissionView = (data: IUser) => {

    const userData: RolePermissionModel = {
      _id: data?._id?.toString(),
      code: data?.role,
      name: data?.name,
      permissions: data?.permissions || [],
      canCreateRole: [""],
      type: "internal",
      canMultipleTenants: false,

    }

    dispatch(setCurrentRolePermission(userData));
    router.push(`/admin/rolesandpermission/${userData?._id}`);
  }





  const initialColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    // {key: "permissions", label: "Permissions",createdById},
    { key: "createdAt", label: "Created" },
    { key: "passwordHash", label: "Password Hash", hidden: true },
    { key: "tenantId", label: "Tenant ID", hidden: true },
    { key: "lastLoginAt", label: "Last Login At", hidden: true },
    { key: "createdById", label: "Created By", hidden: true },
    {
      key: "permissions",
      label: "Permissions",
      render: (value: string[], row: IUser) => (
        <div className="flex items-center gap-2">
          <span className="truncate max-w-[150px]">
            {Array.isArray(value) && value.length > 0 ? value.join(", ") : "No permissions"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePermissionView(row);
            }}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
          >
            Edit Permission <Edit2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];
  const handleDelete = (id: string) => {
    console.log(id);
  };


  const handleView = (id: string) => {
    const currentUser = alluser.find((user) => user.id === id);
    if (!currentUser) {
      toast.error("User not found");
      return;
    }
    dispatch(setCurrentUser(currentUser));
    redirect(`/admin/users/${id}`);
  };


  const handleViewTab = (id: string) => {
    console.log(id);
  };
  return (
    <div>
      <div>


        <DataTableExt
          title="Users"
          data={alluser}
          createHref={createHref}
          initialColumns={initialColumns}
          onDelete={handleDelete}
          onView={handleView}
          opentab={handleViewTab}
        />
      </div>
    </div>
  )
}

export default ShowAllUser