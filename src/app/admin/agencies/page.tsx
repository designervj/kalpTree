import { auth } from "@/auth";
import AgenciesClient from "@/components/admin/agency/AgenciesClient";
import AgencyList from "@/components/admin/agency/AgencyList";
import { IUser } from "@/models/user";
// import { useDispatch } from "react-redux";

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = searchParams;
  const session = await auth();
  const user = session?.user;
  const itemsPerPage = 10;
  const currentPage = Number(params?.page) || 1;
  // const dispatch = useDispatch();
  let agencies: IUser[] = [];
  let totalCount = 0;
  if (user && user.role === "superadmin") {
    // Get all users with role agency
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/admin/agency?role=agency&page=${currentPage}&limit=${itemsPerPage}`,
      { cache: "no-store" }
    );
    const result = await res.json();
    agencies = result.item || [];
    totalCount = result.totalCount || agencies.length;
  } else if (user && user.role === "agency") {
    // Get only the agency for this user
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/admin/agency?userId=${user.id}&role=agency&page=${currentPage}&limit=${itemsPerPage}`,
      { cache: "no-store" }
    );
    const result = await res.json();
    agencies = result.item || [];
    totalCount = result.totalCount || agencies.length;
  }

  return (
    <div className="w-full  space-y-6">
      <AgenciesClient agencies={agencies} />
      <AgencyList />
    </div>
  );
}
