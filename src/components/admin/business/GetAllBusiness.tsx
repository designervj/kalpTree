// "use client";
// import { fetchAllBusinesses } from "@/hooks/slices/business/BusinessThunk";
// import { IBusiness } from "@/models/business";
// import { AppDispatch, RootState } from "@/store/store";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const GetAllBusiness = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { hasFetchedBusiness } = useSelector(
//     (state: RootState) => state.business,
//   );
//   const { user } = useSelector((state: RootState) => state.user);
//   console.log("===>>", user);

//   useEffect(() => {
//     if (!hasFetchedBusiness && user && user.role === "superadmin") {
//       dispatch(fetchAllBusinesses({ page: 1, itemsperpage: 30 }));
//     }
//   }, [hasFetchedBusiness, user]);

//   useEffect(() => {
//     if (
//       !hasFetchedBusiness &&
//       user &&
//       user.role === "agency" &&
//       user.tenantId
//     ) {
//       console.log("===>>", user.tenantId);
//       dispatch(
//         fetchAllBusinesses({
//           page: 1,
//           itemsperpage: 30,
//           tenantId: user.tenantId,
//         }),
//       );
//     }
//     // else if (!hasFetchedBusiness && user && user.role === "superadmin") {
//     //   dispatch(fetchAllBusinesses({ page: 1, itemsperpage: 30 }));
//     // }
//   }, [hasFetchedBusiness, user]);
//   return null;
// };

// export default GetAllBusiness;

"use client";
import { fetchAllBusinesses } from "@/hooks/slices/business/BusinessThunk";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllBusiness = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { hasFetchedBusiness } = useSelector(
    (state: RootState) => state.business,
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user || hasFetchedBusiness) return;

    const payload: {
      page: number;
      itemsperpage: number;
      tenantId?: string;
    } = {
      page: 1,
      itemsperpage: 30,
    };

    // Agency → tenant scoped
    if (user.role === "agency" && user.tenantId) {
      payload.tenantId = user.tenantId;
    }

    // Superadmin → no tenant filter
    if (user.role === "superadmin" || user.role === "agency") {
      dispatch(fetchAllBusinesses(payload));
    }
  }, [user, hasFetchedBusiness, dispatch]);

  return null;
};

export default GetAllBusiness;
