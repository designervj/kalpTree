  
import { auth } from "@/auth";
import AgenciesClient from "@/components/admin/agency/AgenciesClient";
import AgencyList from "@/components/admin/agency/AgencyList";
import { IUser } from "@/models/user";
import { getDatabase, toObjectId } from "@/lib/db/mongodb";

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
  const skip = (currentPage - 1) * itemsPerPage;

  let agencies: IUser[] = [];
  let totalCount = 0;

  if (user && user.role === "superadmin") {
    // Get all users with role agency - direct database query
    const db = await getDatabase();
    const query = { role: "agency" };

    const [items, count] = await Promise.all([
      db.collection("users").find(query).skip(skip).limit(itemsPerPage).toArray(),
      db.collection("users").countDocuments(query),
    ]);

    agencies = items as IUser[];
    totalCount = count;
  } else if (user && user.role === "agency") {
    // Get only the agency for this user - direct database query
    const db = await getDatabase();
    const query = {
      role: "agency",
      _id: toObjectId(user.id)
    };

    const [items, count] = await Promise.all([
      db.collection("users").find(query).skip(skip).limit(itemsPerPage).toArray(),
      db.collection("users").countDocuments(query),
    ]);

    agencies = items as IUser[];
    totalCount = count;
  }

  return (
    <div className="w-full  space-y-6">
      <AgenciesClient agencies={agencies} />
      <AgencyList />

    </div>
  );
}
