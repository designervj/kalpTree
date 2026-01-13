
"use client"
import { IBusiness } from '@/models/business'
import React from 'react'
import UpdateBusiness from './UpdateBusiness'
import ShowBusiness from './showbussiness/showbusiness'

const BusinessHome = () => {
  return (
  <>
      <UpdateBusiness  />
      <ShowBusiness />
    </>
  )
}

export default BusinessHome