import { auth } from "@/auth";
import BusinessCreatePage from "@/components/admin/users/usercomp";


export default async function Users() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <BusinessCreatePage user={user} />
    </>
  );
}
