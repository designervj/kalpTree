import AdminIndex from "@/components/admin/agency/SingleAgency";

export default async function SinglAgencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <>
      <AdminIndex />
    </>
  );
}
