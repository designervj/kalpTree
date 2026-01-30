"use client";

import { AppDispatch, RootState } from '@/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTableExt } from '../DataTableExt';
import { setCurrentUser } from '@/hooks/slices/user/userSlice';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';

const ShowAllUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { alluser } = useSelector((state: RootState) => state.user)
  const createHref = "/admin/users/create"
  const initialColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "tenantId", label: "Tenant ID" },
    // {key: "permissions", label: "Permissions"},
    { key: "createdAt", label: "Created" },
    { key: "passwordHash", label: "Password Hash", hidden: true },
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