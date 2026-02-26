"use client";

import React, { useMemo } from "react";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { IUser } from "@/models/user";
import { Button } from "@/components/ui/button";
// import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
// import { hasPermission } from "@/lib/utils";
import { toast } from "sonner";
import { DataTableExt } from "@/components/admin/DataTableExt";
import GetAllUsers from "@/components/admin/users/GetAllUsers";
import GetBusinessUsers from "@/components/admin/users/GetBusinessUsers";
import { setCurrentUser } from "@/hooks/slices/user/userSlice";
import GetAllRolePermission from "@/components/admin/onboarding/GetAllRolePermission";
import { RolePermissionModel, setCurrentRolePermission, setIsUserRole } from "@/hooks/slices/RolePermissions/rolePermissionSlice";

export default function Page() {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );


  const updatedAllUser: IUser[] = useMemo(() => {
    return (alluser || []).filter((user) => user?.role !== "business");
  }, [alluser]);

  const dispatch = useDispatch<AppDispatch>();
  const { currentBusiness } = useSelector((state: RootState) => state.business)
  const router = useRouter();

  const handleAdd = () => {
    // const check = hasPermission(user, "user:create");
    const finalBusinessId = currentBusiness?._id?.toString()
    const finalAgencyId = currentBusiness?.tenantId;
    if (
      finalBusinessId &&
      finalAgencyId &&
      currentBusiness?.website?.primaryDomain &&
      currentBusiness.website.primaryDomain.length > 0
    ) {
      router.push(
        `/admin/websites/${currentBusiness.website.primaryDomain[0]}/users/all-user/create?businessid=${finalBusinessId}&agencyid=${finalAgencyId}`
      );
    }
    // if (true) {
    //   router.push("/admin/users/all-user/create");
    // } else {
    //   toast.error("You are not Allowed");
    // }
  };

  const handleView = (row: IUser) => {
    dispatch(setCurrentUser(row))
    // const check = hasPermission(user, "user:update");
    const finalBusinessId = currentBusiness?._id?.toString()
    const finalAgencyId = currentBusiness?.tenantId;
    if (
      finalBusinessId &&
      finalAgencyId &&
      currentBusiness?.website?.primaryDomain &&
      currentBusiness.website.primaryDomain.length > 0
    ) {
      router.push(
        `/admin/websites/${currentBusiness.website.primaryDomain[0]}/users/all-user/${row._id}?businessid=${finalBusinessId}&agencyid=${finalAgencyId}`
      );
    }

  };

  const handleDelete = (row: IUser) => { };
  const handleEditPermissions = (row: IUser) => {
    dispatch(setCurrentUser(row))
    const selectedRole: RolePermissionModel = {
      _id: row._id?.toString() ?? "",
      name: row.role ?? "",
      permissions: row?.permissions || [],
      tenantId: row.tenantId ?? "",
    }
    dispatch(setIsUserRole(true))
    dispatch(setCurrentRolePermission(selectedRole))
    //http://localhost:55803/admin/websites/stay-vacation.kalptree.xyz/users/roles-permissions
    const finalBusinessId = currentBusiness?._id?.toString()
    const finalAgencyId = currentBusiness?.tenantId;
    if (
      finalBusinessId &&
      finalAgencyId &&
      currentBusiness?.website?.primaryDomain &&
      currentBusiness.website.primaryDomain.length > 0
    ) {
      router.push(
        `/admin/websites/${currentBusiness.website.primaryDomain[0]}/users/roles-permissions/${row?._id}?businessid=${finalBusinessId}&agencyid=${finalAgencyId}`
      );
    }

  };
  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "tenantId", label: "Tenant ID" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
    { key: "password", label: "Password", hidden: true },
    { key: "passwordHash", label: "Password Hash", hidden: true },
    { key: "permissions", label: "Permissions", hidden: true },

  ];
  return (
    <>
      {/* get all users */}
      {/* <GetAllUsers /> */}
      {/* get business users */}
      <GetAllRolePermission />
      <GetBusinessUsers />

      <DataTableExt
        title=""
        data={updatedAllUser ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
        onEditPermissions={(row) => handleEditPermissions(row)}
      />
    </>
  );
}
