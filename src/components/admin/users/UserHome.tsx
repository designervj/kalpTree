"use client";
import React from 'react'

import ShowAllUser from './ShowAllUser';
import GetAllUsers from './GetAllUsers';
import GetDashBoardDetails from '../GetDashboardDetails';
import GetAllBusiness from '../business/GetAllBusiness';
import GetAllWebsites from '../website/GetAllWebsites';
import GetAllAgency from '../agency/GetAllAgency';

const UserHome = () => {
  return (
   <>
  <GetAllUsers/>
   <ShowAllUser/>

   <GetAllAgency />
      <GetAllBusiness />
      <GetAllWebsites />
 
   </>
  )
}

export default UserHome