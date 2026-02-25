"use client"
import GetAllRolePermission from '@/components/admin/onboarding/GetAllRolePermission'
import RolesManagement from '@/components/admin/roles/roles'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import GetBusinessUsers from '@/components/admin/users/GetBusinessUsers'

const page = () => {
    const getParams = useSearchParams();
    const businessid = getParams.get("businessid");
  return (
    <>
     <GetAllRolePermission />
     <GetBusinessUsers />
      <RolesManagement
      businessid={businessid??""}
      />
    </>
  )
}

export default page