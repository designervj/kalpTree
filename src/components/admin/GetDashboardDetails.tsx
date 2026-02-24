"use client";
import { savedashboardDetailsThunk } from "@/hooks/slices/dashboardSlice/dashBoardSlice";
import { getAllUser } from "@/hooks/slices/user/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetDashBoardDetails = () => {
  const { agencies, hasfetched } = useSelector(
    (state: RootState) => state.agency,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const query = useSearchParams();
  const agencyid = query.get("agencyid");
  const businessid = query.get("businessid");
  const url = Array.isArray(params.website)
    ? params.website[0]
    : params.website;

  useEffect(() => {
    if (agencies.length == 0 && !hasfetched && agencyid && businessid && user) {
      dispatch(savedashboardDetailsThunk({ agencyid, businessid, user }));
    }
  }, [agencies, hasfetched, agencyid, businessid, user]);

  useEffect(() => {
    if (
      user?.role == "business" &&
      user.tenantId &&
      user.id &&
      agencies.length == 0 &&
      !hasfetched
    ) {
      console.log("I Ran")
      dispatch(
        savedashboardDetailsThunk({
          agencyid: user?.tenantId.toString(),
          businessid: user?.id.toString(),
          user,
        }),
      );
    }
  }, [user, agencies, hasfetched]);

  return null;
};

export default GetDashBoardDetails;
