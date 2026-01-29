import { auth } from "@/auth";
import AgenciesClient from "@/components/admin/agency/AgenciesClient";
import AgencyList from "@/components/admin/agency/AgencyList";
import { IUser } from "@/models/user";
import { getDatabase, toObjectId } from "@/lib/db/mongodb";
import GetAllAgency from "@/components/admin/agency/GetAllAgency";
import GetAllBusiness from "@/components/admin/business/GetAllBusiness";
import GetAllWebsites from "@/components/admin/website/GetAllWebsites";
import { redirect } from "next/navigation";

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
     const session = await auth();

  // Server-side authentication check
  if (!session) {
    redirect("/auth/signin");
  }
  return (
    <div className="w-full  space-y-6">
      <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites />
      <AgencyList />
    </div>
  );
}
