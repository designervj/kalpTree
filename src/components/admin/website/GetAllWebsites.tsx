"use client";
import { getAllWebsites } from "@/hooks/slices/websites/WebsiteThunk";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllWebsites = () => {
  const { hasfetched } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { allBusiness, currentBusiness } = useSelector(
    (state: RootState) => state.business,
  );

  useEffect(() => {
    if (!hasfetched && user && user.role === "superadmin") {
      dispatch(getAllWebsites({ tenantId: "" }));
    }
  }, [hasfetched, user]);

  useEffect(() => {
    if (user && user.role === "agency" && allBusiness && allBusiness[0]?._id) {
      dispatch(getAllWebsites({ tenantId: allBusiness[0]?._id.toString() }));
    }
  }, [user, allBusiness]);

  useEffect(() => {
    if (
      user &&
      user.role === "business" &&
      currentBusiness &&
      currentBusiness._id
    ) {
      dispatch(getAllWebsites({ tenantId: currentBusiness._id.toString() }));
    }
  }, [user, currentBusiness]);
  return null;
};

export default GetAllWebsites;
