
"use client"
import { IBusiness } from '@/models/business'
import React from 'react'
import UpdateBusiness from './UpdateBusiness'
import ShowBusiness from './showbussiness/showbusiness'
import GetAllAgency from '../agency/GetAllAgency'
import GetAllBusiness from './GetAllBusiness'
import GetAllWebsites from '../website/GetAllWebsites'

const BusinessHome = () => {
  return (
  <>
      <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites />
      <UpdateBusiness  />
      <ShowBusiness />
    </>
  )
}

export default BusinessHome