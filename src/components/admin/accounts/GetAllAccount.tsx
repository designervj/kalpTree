"use client";
import React, { useEffect } from "react";

import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setAccounts, TenantModel } from "@/hooks/slices/user/accountSlice";

type Props = {
  allaccounts: TenantModel[];
};
const GetAllAccount = ({ allaccounts }: Props) => {
  const { allAccounts, hasFetched } = useSelector(
    (state: RootState) => state.account
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (
      allAccounts &&
      allAccounts.length == 0 &&
      allaccounts.length > 0 &&
      !hasFetched
    ) {
      dispatch(setAccounts(allaccounts));
    }
  }, [allAccounts, hasFetched]);
  return null;
};

export default GetAllAccount;
