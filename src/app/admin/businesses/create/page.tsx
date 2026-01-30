import { auth } from "@/auth";
import BusinessCreatePage from "@/components/admin/users/usercomp";
import { getDatabase } from "@/lib/db/mongodb";
import { IBusiness } from "@/models/business";

export default async function AddBusiness() {
  const session = await auth();
  const user = session?.user;
  let agencies: any[] = [];
  if (user?.role == "superadmin") {
    const db = await getDatabase();
    const coll = db.collection("tenants");
    agencies = await coll.find({ type: "agency" }).toArray();
  }

  return (
    <div className="space-y-6">
      <BusinessCreatePage user={user} agencies={agencies} />
    </div>
  );
}
