"use client";
import {
  savedashboardDetailsThunk,
} from "@/hooks/slices/dashboardSlice/dashBoardSlice";
import { getAllUser } from "@/hooks/slices/user/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetDashBoardDetails = () => {
  // const {
  //   agencies,
  //   business,
  //   websites,
  //   totalbusiness,
  //   totalwebsites,
  //   currentAgency,
  // } = useSelector((state: RootState) => state.dashboardDetails);
  const {agencies,hasfetched}=useSelector((state: RootState)=>state.agency)
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const query = useSearchParams();
  const agencyid = query.get("agencyid");
  const businessid = query.get("businessid");
  const url = Array.isArray(params.website)
    ? params.website[0]
    : params.website;

  useEffect(() => {
    if (agencies.length == 0 && !hasfetched && agencyid) {
      dispatch(savedashboardDetailsThunk());
    }
  }, [agencies,hasfetched,agencyid]);

  // useEffect(() => {
  //   if (totalwebsites.length > 0 || websites.length > 0) {
  //     dispatch(onParamsChange({ agencyid, businessid, url }));
  //   }
  // }, [totalwebsites]);
  
  return null;
};

export default GetDashBoardDetails;
