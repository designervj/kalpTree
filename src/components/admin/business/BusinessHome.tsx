
"use client"
import { IBusiness } from '@/models/business'
import React, { useEffect } from 'react'
import UpdateBusiness from './UpdateBusiness'
import ShowBusiness from './showbussiness/showbusiness'
import GetAllAgency from '../agency/GetAllAgency'
import GetAllBusiness from './GetAllBusiness'
import GetAllWebsites from '../website/GetAllWebsites'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import { setBusinessWebsite } from '@/hooks/slices/business/BusinessSlice'

const BusinessHome = () => {

  const dispatch= useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(setBusinessWebsite(null))
  }, [])
  return (
  <>
      <GetAllAgency />
      <GetAllBusiness />
      {/* <GetAllWebsites /> */}
      <UpdateBusiness  />
      <ShowBusiness />
    </>
  )
}

export default BusinessHome