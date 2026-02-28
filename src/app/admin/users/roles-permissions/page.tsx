"use client"
import GetAllRolePermission from "@/components/admin/onboarding/GetAllRolePermission";

import RolesManagement from "@/components/admin/roles/roles";
import GetBusinessUsers from "@/components/admin/users/GetBusinessUsers";

export default async function RolesPage() {

  console.log("roles page")
  return (
    <div>
      <GetAllRolePermission />
      <GetBusinessUsers />
      <RolesManagement />
    </div>
  );
}
