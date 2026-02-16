// "use client";
// import { getAllWebsites } from "@/hooks/slices/websites/WebsiteThunk";
// import { AppDispatch, RootState } from "@/store/store";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const GetAllWebsites = () => {
//   const { hasfetched } = useSelector((state: RootState) => state.websites);
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.user);
//   const { allBusiness, currentBusiness } = useSelector(
//     (state: RootState) => state.business,
//   );

//   console.log("===>>",currentBusiness)

//   useEffect(() => {
//     if (!hasfetched && user && user.role === "superadmin") {
//       dispatch(getAllWebsites({ tenantId: "" }));
//     }
//   }, [hasfetched, user]);

//   useEffect(() => {
//     if (user && user.role === "agency" && allBusiness && allBusiness[0]?._id) {
//       dispatch(getAllWebsites({ tenantId: allBusiness[0]?._id.toString() }));
//     }
//   }, [user, allBusiness]);

//   useEffect(() => {
//     if (
//       user &&
//       user.role === "business" &&
//       currentBusiness &&
//       currentBusiness._id
//     ) {
//       dispatch(getAllWebsites({ tenantId: currentBusiness._id.toString() }));
//     }
//   }, [user, currentBusiness]);
//   return null;
// };

// export default GetAllWebsites;

"use client";
import { getAllWebsites } from "@/hooks/slices/websites/WebsiteThunk";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllWebsites = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { hasfetched } = useSelector((state: RootState) => state.websites);
  const { user } = useSelector((state: RootState) => state.user);
  const { allBusiness, currentBusiness } = useSelector(
    (state: RootState) => state.business,
  );


  useEffect(() => {
    if (!user || hasfetched) return;

    let tenantId: string | undefined;

    switch (user.role) {
      case "superadmin":
        tenantId = ""; // no tenant filter
        break;

      case "agency":
        tenantId = "";
        break;

      case "business":
        tenantId = currentBusiness?._id?.toString();
        break;

      default:
        return;
    }

    if (tenantId !== undefined) {
      dispatch(getAllWebsites({ tenantId }));
    }
  }, [user, hasfetched, allBusiness, currentBusiness, dispatch]);

  return null;
};

export default GetAllWebsites;
