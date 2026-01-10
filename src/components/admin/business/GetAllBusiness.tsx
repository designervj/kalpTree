"use client"
import { IBusiness } from '@/models/business'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props={
   allData:IBusiness[] 
}
const GetAllBusiness = ({   allData}:Props) => {
    const dispatch=useDispatch<AppDispatch>()
    // const { hasFetched}=useSelector((state: RootState) => state.business)
  
  
    // useEffect(() => {
    //      if(!hasFetched && allData.length===0){
    //         dispatch(setBusinesses(allData))
    //      }
    // }, [hasFetched,allData])
  return (
    null
  )
}

export default GetAllBusiness