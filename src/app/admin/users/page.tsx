import { auth } from "@/auth";
import BusinessCreatePage from "@/components/admin/users/usercomp";
import UserHome from "@/components/admin/users/UserHome";


// export default async function Users() {
//   const session = await auth();
//   const user = session?.user;

//   return (
//     <>
//       <BusinessCreatePage user={user} />
//     </>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <>
    <UserHome/>
    </>
  )
}

export default page