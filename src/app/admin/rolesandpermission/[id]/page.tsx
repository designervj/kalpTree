import GetAllRolePermission from "@/components/admin/onboarding/GetAllRolePermission";
import RolesPersmissionForm from "../create/page";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const id = param.id;
  return (
    <>
      <GetAllRolePermission />
      <RolesPersmissionForm id={id} />
    </>
  );
}
