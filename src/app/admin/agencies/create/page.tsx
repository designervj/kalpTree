// "use client";

import { auth } from "@/auth";
import BusinessCreatePage from "@/components/admin/users/usercomp";


export default async function () {
  const session = await auth()
  
  return (
    <>
      <BusinessCreatePage user={session?.user} />
    </>
  );
}
