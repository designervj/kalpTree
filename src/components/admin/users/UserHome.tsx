"use client";
import React from 'react'

import ShowAllUser from './ShowAllUser';
import GetAllUsers from './GetAllUsers';

const UserHome = () => {
  return (
   <>
  <GetAllUsers/>
   <ShowAllUser/>
   </>
  )
}

export default UserHome