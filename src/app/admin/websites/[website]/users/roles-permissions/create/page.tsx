
import React from 'react'
import CreateRole from '@/app/admin/rolesandpermission/create/page'

interface PageProps {
  id?: string;
}

const page = ({ id }: PageProps) => {
  return (
    <CreateRole
      id={id || ""}
    />
  )
}

export default page