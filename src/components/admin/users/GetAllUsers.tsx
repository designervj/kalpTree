"use client";

import { getAllUser } from "@/hooks/slices/user/UserThunk";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllUsers = () => {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      user &&
      user.role &&
      user.role === "superadmin" &&
      !hasFetchedAllUsers &&
      alluser.length == 0
    ) {
     // dispatch(getAllUser());
    }
  }, [user]);

  return null;
};

export default GetAllUsers;
