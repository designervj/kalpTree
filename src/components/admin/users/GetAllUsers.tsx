"use client";

import { clearAllUser } from "@/hooks/slices/user/userSlice";
import { getAgencyUser, getAllUser, getBusinessUser } from "@/hooks/slices/user/UserThunk";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllUsers = () => {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();


  useEffect(()=>{
     dispatch(clearAllUser())
  },[])

  // when user is superadmin then get all users
  useEffect(() => {
    if (
      user &&
      user.role &&
      user.role == "superadmin" &&
      !hasFetchedAllUsers &&
      alluser.length == 0
    ) {
      dispatch(getAllUser());
    }
  }, [user,hasFetchedAllUsers,alluser]);



  // when user is admin then get all users of that agency
  useEffect(() => {
    if (
      user &&
      user.role &&
      user?.tenantId &&
      user.role == "business" &&
      !hasFetchedAllUsers &&
      alluser.length == 0
    ) {
      dispatch(getBusinessUser(user?.tenantId?.toString()));
    }
  }, [user,hasFetchedAllUsers,alluser]);


  // when user is agency then get all users of that agency
  useEffect(() => {
    if (
      user &&
      user.role &&
      user?.tenantId &&
      user.role == "agency" &&
      !hasFetchedAllUsers &&
      alluser.length == 0
    ) {
      dispatch(getAgencyUser(user?.tenantId?.toString()));
    }
  }, [user,hasFetchedAllUsers,alluser]);
  return null;
};

export default GetAllUsers;
