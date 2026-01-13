"use client"
import { getAllWebsites } from '@/hooks/slices/websites/WebsiteThunk'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllWebsites = () => {

    const {hasfetched}= useSelector((state: RootState)=>state.websites)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(()=>{
        if(!hasfetched){
            dispatch(getAllWebsites({tenantId: ""}))
        }
    },[hasfetched])
  return (
  null
  )
}

export default GetAllWebsites