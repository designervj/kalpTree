"use client"

import { getBusinessUser } from '@/hooks/slices/user/UserThunk';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetBusinessUsers = () => {
  const { user, hasFetchedAllUsers, alluser } = useSelector(
    (state: RootState) => state.user
  );

  const {currentBusiness} = useSelector(
    (state: RootState) => state.business
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user  &&
      !hasFetchedAllUsers &&
      alluser.length == 0 &&
      currentBusiness &&
      currentBusiness._id
    ) {
      dispatch(getBusinessUser(currentBusiness._id.toString()));
    }
  }, [user, alluser,currentBusiness]);

  return null;
};

export default GetBusinessUsers