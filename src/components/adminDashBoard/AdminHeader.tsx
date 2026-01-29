"use client"
import { setUser } from '@/hooks/slices/user/userSlice'
import { IUser } from '@/models/user'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type props={
    sessionUser:IUser
}
const AdminHeader = ({sessionUser}:props) => {
    const { user } = useSelector((state: RootState) => state.user)
 
      const dispatch = useDispatch<AppDispatch>();
    useEffect(()=>{
        if(sessionUser &&user==null){
            dispatch(setUser(sessionUser))
        }
    },[sessionUser,dispatch,user])
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