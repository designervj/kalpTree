import { fetchWebsiteCurrentHeaders } from '@/hooks/slices/header/HeaderThunk';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetAllWebsiteHeader = () => {
       const { currentHeader, hasFetched } = useSelector((state: RootState) => state.header);
    const { currentBusiness } = useSelector((state: RootState) => state.business);
    
   
    const dispatch = useDispatch<AppDispatch>();
    // fetch the current header based on tenantId
    useEffect(() => {
        if (currentHeader == null &&
            currentBusiness &&
            currentBusiness._id &&
            currentBusiness.tenantId) {
            dispatch(fetchWebsiteCurrentHeaders({ tenantId: currentBusiness.tenantId}));
        }
    }, [currentHeader, currentBusiness]);
  return (
   null
  )
}

export default GetAllWebsiteHeader