import GetAllRolePermission from "@/components/admin/onboarding/GetAllRolePermission";
import RolesManagement from "@/components/admin/roles/roles";

export default async function RolesPage() {
  return (
    <div>
      <GetAllRolePermission />
      <RolesManagement />
    </div>
  );
}
