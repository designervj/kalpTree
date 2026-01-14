"use client";
import { RootState } from "@/store/store";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { IUser } from "@/models/user";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { deleteAgency } from "@/hooks/slices/user/agencySlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import AgencyGrid from "./AgencyGrid";
import Link from "next/link";
const AgencyList = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { allAgencies, isAgencyLoading } = useSelector(
    (state: RootState) => state.agency
  );

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const columns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "passwordHash", label: "password Hash", hidden: true },
    {
      key: "createdAt",
      label: "Created",
      render: (value: any) => (value ? new Date(value).toLocaleString() : "-"),
    },
  ];

  const handleAdd = () => {
    if (user?.role === "superadmin") {
      router.push("/admin/agencies/create");
    } else {
      // toast("Your are unable to add agency")
    }
  };

  const handleDelete = async (row: IUser) => {
    let id = row?._id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }
    // Convert ObjectId to string if needed
    if (typeof id !== "string") {
      id = id.toString();
    }
    const ok = confirm(`Delete attribute "${row?.name ?? id}"?`);
    if (!ok) return;
    try {
      const response = await dispatch(deleteAgency(id));
      toast({
        title: "Deleted",
        description: `Attribute ${row?.name ?? id} removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete attribute", err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
      });
    }
  };

  const handleBusiness = () => {};
  return (
    <>
      <div className="flex items-center justify-between">
        {/* <div className="text-xl font-semibold">{title} </div> */}
        <div className="flex items-center gap-2 justify-between w-full">
          <BreadCrumbPage />
          <Link href="/admin/agencies/create">
            <Button size="sm" className="py-2 rounded-sm px-4 py-2">
              Create New
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="flex justify-end items-center me-auto">
          <TabsTrigger value="account">List</TabsTrigger>
          <TabsTrigger value="password">Grid</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <DataTableExt
            title="Agencies"
            data={allAgencies}
            onCreate={handleAdd}
            initialColumns={columns}
            opentab={() => handleBusiness}
            onDelete={(row) => handleDelete(row)}
          />
        </TabsContent>

        <TabsContent value="password">
          <AgencyGrid />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AgencyList;
