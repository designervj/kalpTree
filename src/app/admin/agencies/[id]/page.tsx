import GetAllAgency from "@/components/admin/agency/GetAllAgency";
import AdminIndex from "@/components/admin/agency/SingleAgency";
import GetAllBusiness from "@/components/admin/business/GetAllBusiness";
import GetAllWebsites from "@/components/admin/website/GetAllWebsites";

export default async function SinglAgencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <>
      <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites />
      <AdminIndex />
    </>
  );
}
