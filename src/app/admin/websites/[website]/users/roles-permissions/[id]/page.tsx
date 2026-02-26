
"use client"
import GetAllRolePermission from "@/components/admin/onboarding/GetAllRolePermission";
import RolesPersmissionForm from "../create/page";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

 const page=()=> {
  
    const {current:currentrRolePermission}=useSelector((state:RootState)=>state.rolePermission)
  
  return (
    <>
     {currentrRolePermission?._id &&
      <RolesPersmissionForm
       id={currentrRolePermission?._id.toString()}/>}
      <GetAllRolePermission />
    </>
  );
}


export default page