
"use client"
import { fetchAllAgencies } from '@/hooks/slices/user/agencySlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllAgency = () => {
const dispatch=useDispatch<AppDispatch>()
    const { hasfetched}=useSelector((state: RootState) => state.agency)
  
  
    useEffect(() => {
         if(!hasfetched){
             dispatch(fetchAllAgencies())
         }
    }, [hasfetched])
  return (
    null
  )
}

export default GetAllAgency