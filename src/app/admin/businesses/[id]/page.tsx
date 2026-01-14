"use client";

import ShowBussinesById from "@/components/admin/business/businessID/ShowBussinesById";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import GetBusinessById from "@/components/admin/business/businessID/GetBusinessById";
import GetAllWebsites from "@/components/admin/website/GetAllWebsites";




export const BusinesswithID = () => {
  const { user } = useSelector((state: RootState) => state.user)
  const { businessWebsite } = useSelector((state: RootState) => state.business)

  const upadatedBusiness = useMemo(() => {
    return businessWebsite
  }, [businessWebsite])

  // Handle null case
  // if (!upadatedBusiness || !user) {
  //   return (
  //     <div className="p-6 text-sm text-slate-600">
  //       {!user ? "User not found" : "Business not found"}
  //       <GetBusinessById />
  //       <GetAllWebsites/>
  //     </div>
  //   );
  // }

  return (
    <>
    {user && upadatedBusiness ?( <ShowBussinesById user={user} business={upadatedBusiness} />):(
      <h2>Loading ....</h2>
    )
     }
    </>
  );
}

export default BusinesswithID
//  const param = await params;
//   let id = param.id;
//   const sesssion = await auth();

//   const req = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/admin/business/${id}`
//   );

//   const res = await req.json();

//   if (!res.success) {
//     return <div className="p-6 text-sm text-slate-600">Business not found</div>;
//   }
//   const business: IBusiness = res.data;