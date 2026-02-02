"use client";
import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux';


const UserPage = () => {
    const {currentUser} = useSelector((state: RootState) => state.user)
    console.log(currentUser);
  return (
    <div>
   
    </div>
  )
}

export default UserPage