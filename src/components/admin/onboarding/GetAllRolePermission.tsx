"use client";
import { fetchRolePermissions } from "@/hooks/slices/RolePermissions/rolePermissionSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllRolePermission = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rolesPermissions, hasFetched, current } = useSelector(
    (state: RootState) => state.rolePermission
  );

  useEffect(() => {
    if (rolesPermissions && rolesPermissions.length == 0 && !hasFetched) {
      dispatch(fetchRolePermissions());
    }
  }, [rolesPermissions, hasFetched]);
  return null;
};

export default GetAllRolePermission;
