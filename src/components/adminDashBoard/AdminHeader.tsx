"use client"
import { RootState } from '@/store/store'
import React from 'react'
import { useSelector } from 'react-redux'

const AdminHeader = () => {
    const { user } = useSelector((state: RootState) => state.user)
    return (
        <>
            <div className="flex flex-col gap-1">
                <h2 className="text-[28px] font-semibold text-slate-900">
                    Welcome to {user?.role ? user.role :"User"} dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                    Everything you need to manage website, branding, products & marketing.
                </p>
            </div>

        </>
    )
}

export default AdminHeader