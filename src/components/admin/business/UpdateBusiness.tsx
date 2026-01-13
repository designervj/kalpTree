"use client";

import { setBusinesses } from "@/hooks/slices/business/BusinessSlice";
import { IBusiness } from "@/models/business";
import { IUser } from "@/models/user";
import { AppDispatch } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

type Props = {
  business: IBusiness[];
};
const UpdateBusiness = ({ business }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (business && business.length > 0) {
      dispatch(setBusinesses(business));
    }
  }, [business]);
  return null;
};

export default UpdateBusiness;
