"use client"
import { fetchAllBusinesses } from '@/hooks/slices/business/BusinessThunk'
import { IBusiness } from '@/models/business'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const GetAllBusiness = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { hasFetchedBusiness } = useSelector((state: RootState) => state.business)
   const {user }=useSelector((state: RootState) => state.user)     
  

  useEffect(() => {
    if (!hasFetchedBusiness && user && user.role==='superadmin') {
      dispatch(fetchAllBusinesses({ page: 1, itemsperpage: 30 }))
    }
  }, [hasFetchedBusiness,user])
    useEffect(() => {
    if (!hasFetchedBusiness && user && user.role==='agency' && user.tenantId) {
      dispatch(fetchAllBusinesses({ page: 1, itemsperpage: 30,tenantId:user.tenantId}))
    }
  }, [hasFetchedBusiness,user])
  return (
    null
  )
}

export default GetAllBusiness