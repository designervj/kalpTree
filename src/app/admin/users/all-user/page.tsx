"use client";

import React, { useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IUser } from "@/models/user";


import { useRouter } from "next/navigation";
// import { hasPermission } from "@/lib/utils";
import { toast } from "sonner";
import { DataTableExt } from "@/components/admin/DataTableExt";
import GetAllUsers from "@/components/admin/users/GetAllUsers";
import GetAllRolePermission from "@/components/admin/onboarding/GetAllRolePermission";

export default function Page() {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );

  const router = useRouter();
  const dispatch = useDispatch();



   
    const updatedAllUser: IUser[] = useMemo(() => {
      if(user && user.role==="superadmin" &&alluser && alluser.length>0){
        return (alluser || []).filter((user) => user?.role !== "superadmin");
      }
      else if(user && user.role==="business" &&alluser && alluser.length>0 ){
        return(alluser || []).filter((user) => user?.role !== "business");
      }
     return (alluser || [])
    }, [alluser, user]);
  
  const handleAdd = () => {
    // const check = hasPermission(user, "user:create");
    if (true) {
      router.push("/admin/users/all-user/create");
    } else {
      toast.error("You are not Allowed");
    }
  };

  const handleView = (row: IUser) => {
    // const check = hasPermission(user, "user:update");
    if (true) {
      router.push(`/admin/users/all-user/${row._id}`);
    } else {
      toast.error("You are not Allowed");
    }
  };

  const handleDelete = (row: IUser) => {};
  // const handleView = (row: IUser) => {

  // };
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
    { key: "passwordHash", label: "Password Hash", hidden: true },
    { key: "permissions", label: "Permissions", hidden: true },
  ];
  return (
    <>
      {/* get all users */}
         <GetAllRolePermission />
      <GetAllUsers />
      <DataTableExt
        title=""
        data={updatedAllUser ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />
    </>
  );
}
