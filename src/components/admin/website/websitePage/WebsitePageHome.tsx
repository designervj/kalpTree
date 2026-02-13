"use client"
import React from 'react'
import WebsitePageTable from './WebsitePageTable'
import GetAllPage from './GetAllPage'
import GetAllTemplate from '../../templates/GetAllTemplate'

const WebsitePageHome = () => {
  return (
    <>
    <WebsitePageTable/>
    <GetAllPage/>
    <GetAllTemplate/>
    </>
  )
}

export default WebsitePageHome