
"use client"
import { IBusiness } from '@/models/business'
import React from 'react'
import UpdateBusiness from './UpdateBusiness'
import ShowBusiness from './showbussiness/showbusiness'

type Props={
    business:IBusiness[]
}
const BusinessHome = ({business}:Props) => {
  return (
  <>
      <UpdateBusiness business={business} />
      <ShowBusiness />
    </>
  )
}

export default BusinessHome