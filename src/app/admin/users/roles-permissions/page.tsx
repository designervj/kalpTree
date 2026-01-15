import { RolesAndPermissions } from "@/components/admin/users/rolesAndPermissions/RolesAndPermissions";

export default async function RoleAndPermission() {
  const res = await fetch("/api/rolesandpermissions", {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text(); // 👈 important
    console.error("API Error Response:", text);
    throw new Error("Failed to fetch roles and permissions");
  }

  const result = await res.json();
  const { roles } = result;

  return (
    <div>
      <RolesAndPermissions totalroles={roles} />
    </div>
  );
}
