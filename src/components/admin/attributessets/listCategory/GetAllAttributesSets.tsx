// "use client";
// import React, { useEffect } from "react";
// import { fetchCategories } from "@/hooks/slices/category/CategorySlice";
// import { AppDispatch, RootState } from "@/store/store";

// import { useDispatch, useSelector } from "react-redux";
// import { fetchAttributeSets } from "@/hooks/slices/attributessets/attributeSetsSlice";

// const GetAllAttributesSets = () => {
//   const { isAttributeSetsLoading, hasFetched } = useSelector(
//     (state: RootState) => state.attributeSets,
//   );
//   const { user } = useSelector((state: RootState) => state.user);
//   const { currentWebsite } = useSelector((state: RootState) => state.websites);

//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     if (
//       !hasFetched &&
//       !isAttributeSetsLoading &&
//       currentWebsite &&
//       currentWebsite._id
//     ) {
//       dispatch(fetchAttributeSets({ websiteId: String(currentWebsite._id) }));
//     }
//   }, [hasFetched, isAttributeSetsLoading, user, dispatch, currentWebsite]);

//   return null;
// };

// export default GetAllAttributesSets;

"use client";
import React, { useEffect } from "react";
import { fetchCategories } from "@/hooks/slices/category/CategorySlice";
import { AppDispatch, RootState } from "@/store/store";

import { useDispatch, useSelector } from "react-redux";
import { fetchAttributeSets } from "@/hooks/slices/attributessets/attributeSetsSlice";

const GetAllAttributesSets = () => {
  const { isAttributeSetsLoading, hasFetched } = useSelector(
    (state: RootState) => state.attributeSets,
  );
  const { user } = useSelector((state: RootState) => state.user);
  // const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      !hasFetched &&
      !isAttributeSetsLoading &&
      currentBusiness &&
      currentBusiness._id
    ) {
      dispatch(fetchAttributeSets({ websiteId: String(currentBusiness._id) }));
    }
  }, [hasFetched, isAttributeSetsLoading, user, dispatch, currentBusiness]);

  return null;
};

export default GetAllAttributesSets;
