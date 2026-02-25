"use client";

import React from "react";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
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

export default function Page() {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );

  const router = useRouter();

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
      {/* <GetAllUsers /> */}
      {/* get business users */}
      <GetBusinessUsers />

      <DataTableExt
        title=""
        data={alluser ?? []}
        onCreate={handleAdd}
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />
    </>
  );
}
