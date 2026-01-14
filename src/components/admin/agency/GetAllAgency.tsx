
"use client"
import { fetchAllAgencies, fetchSingleAgency } from '@/hooks/slices/user/agencySlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllAgency = () => {
const dispatch=useDispatch<AppDispatch>()
    const { hasfetched}=useSelector((state: RootState) => state.agency)
   const {user }=useSelector((state: RootState) => state.user)     
  
    useEffect(() => {
         if(!hasfetched && user && user.role==='superadmin'){
             dispatch(fetchAllAgencies())
         }
    }, [hasfetched, user])

   useEffect(()=>{
    if(user && user.role==='agency' && user.tenantId){
        dispatch(fetchSingleAgency({id:user.tenantId}))
    }
   },[user])
  return (
    null
  )
}

export default GetAllAgency