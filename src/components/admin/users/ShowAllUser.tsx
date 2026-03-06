"use client";

import { AppDispatch, RootState } from '@/store/store';
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTableExt } from '../DataTableExt';
import { setCurrentUser } from '@/hooks/slices/user/userSlice';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';
import { IUser } from '@/models/user';
import { RolePermissionModel, setCurrentRolePermission, setIsUserRole } from '@/hooks/slices/RolePermissions/rolePermissionSlice';

const ShowAllUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { alluser, user } = useSelector((state: RootState) => state.user)
  const { allBusiness } = useSelector((state: RootState) => state.business)

  const updatedUSer = useMemo(() => {
    if (!alluser) return [];

    if (user && user.role == "superadmin" && allBusiness.length > 0) {
      return alluser.filter((user) => user.role != "superadmin").map((user) => {
        return {
          ...user,
          id: user._id?.toString(),
        }
      })
    } else if (user && user.role == "agency" && allBusiness.length > 0 && alluser.length > 0) {
      // getAll Businessid
      const business = allBusiness.map((business) => {
        return business._id?.toString()
      })
      console.log("allBusiness", allBusiness)
      return alluser?.filter((user) => {
        console.log("user", user)
        return user.role == "business" && business.includes(user.tenantId?.toString())
      }).map((user) => {
        return {
          ...user,
          id: user._id?.toString(),
        }
      })
    }
    return [];
  }, [alluser, user, allBusiness])


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
    dispatch(setCurrentUser(data))
    dispatch(setIsUserRole(true))
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
          {/* <span className="truncate max-w-[150px]">
            {Array.isArray(value) && value.length > 0 ? value.join(", ") : "No permissions"}
          </span> */}
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
          data={updatedUSer}
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