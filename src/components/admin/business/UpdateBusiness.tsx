"use client";

import { setBusinesses } from "@/hooks/slices/business/BusinessSlice";
import { fetchAllBusinesses } from "@/hooks/slices/business/BusinessThunk";
import { IBusiness } from "@/models/business";
import { IUser } from "@/models/user";
import { AppDispatch, RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UpdateBusiness = () => {
  const searchParams = useSearchParams();
  const { allBusiness, pagination } = useSelector(
    (state: RootState) => state.business
  );
  const page = searchParams.get("page") || 1;
  const itemsperpage = searchParams.get("itemsperpage") || 30;

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(
      fetchAllBusinesses({
        page: Number(page),
        itemsperpage: Number(itemsperpage),
      })
    );
  }, [page, itemsperpage]);
  return null;
};

export default UpdateBusiness;
