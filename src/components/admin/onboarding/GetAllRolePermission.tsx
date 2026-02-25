"use client";
import { fetchRolePermissions } from "@/hooks/slices/RolePermissions/rolePermissionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllRolePermission = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rolesPermissions, hasFetched, current } = useSelector(
    (state: RootState) => state.rolePermission
  );
  const {currentBusiness  } = useSelector(
    (state: RootState) => state.business
  );
  const getParams = useSearchParams();
  const businessid = getParams.get("businessid");

 const {user} = useSelector(
  (state: RootState) => state.user
 );

 const isApi= useRef<boolean>(true)
  useEffect(() => {
    if (businessid && !hasFetched && isApi.current) {
      console.log("called fetch role permission",businessid)
      dispatch(fetchRolePermissions(businessid));
      isApi.current=false
    }else{
      isApi.current=true
    }
  }, [hasFetched, businessid]);
  return null;
};

export default GetAllRolePermission;
