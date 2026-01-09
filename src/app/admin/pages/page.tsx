"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const router= useRouter()

    useEffect(() => {
        router.push("/admin/website/pages")
    }, [])
  return (
  null
  )
}

export default page