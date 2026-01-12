
import { auth } from "@/auth";
import BusinessCreatePage from "@/components/admin/users/usercomp";

export default async function AddBusiness() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="space-y-6">
      <BusinessCreatePage user={user} />
    </div>
  );
} 
