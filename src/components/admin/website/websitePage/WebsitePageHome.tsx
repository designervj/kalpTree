"use client"
import React, { useEffect } from 'react'
import WebsitePageTable from './WebsitePageTable'
import GetAllPage from './GetAllPage'
import GetAllTemplate from '../../templates/GetAllTemplate'
import { useDispatch } from 'react-redux'
import { clearAllUser } from '@/hooks/slices/user/userSlice'

const WebsitePageHome = () => {
     const dispatch = useDispatch()
     useEffect(() => {
         dispatch(clearAllUser())
      
     }, []);
  return (
    <>
    <WebsitePageTable/>
    <GetAllPage/>
    <GetAllTemplate/>
    </>
  )
}

export default WebsitePageHome