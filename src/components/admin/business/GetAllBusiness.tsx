"use client"
import { fetchAllBusinesses } from '@/hooks/slices/business/BusinessThunk'
import { IBusiness } from '@/models/business'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const GetAllBusiness = () => {
    const dispatch=useDispatch<AppDispatch>()
    const { hasFetchedBusiness}=useSelector((state: RootState) => state.business)
  
  
    useEffect(() => {
         if(!hasFetchedBusiness){
             dispatch(fetchAllBusinesses())
         }
    }, [hasFetchedBusiness])
  return (
    null
  )
}

export default GetAllBusiness