"use client";
import {
  fetchAllAgencies,
  fetchSingleAgency,
} from "@/hooks/slices/user/agencySlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetSingleAgency = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAgencyLoading, curretAgency } = useSelector(
    (state: RootState) => state.agency
  );

  const param = useParams();

  const id =
    typeof param?.id === "string"
      ? param.id
      : Array.isArray(param?.id)
      ? param.id[0]
      : undefined;

  useEffect(() => {
    if (!curretAgency) {
      dispatch(fetchSingleAgency({ id: id! }));
    }
  }, [param]);
  return null;
};

export default GetSingleAgency;
