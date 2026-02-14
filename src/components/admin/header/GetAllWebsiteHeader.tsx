import { fetchWebsiteCurrentHeaders } from '@/hooks/slices/header/HeaderThunk';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetAllWebsiteHeader = () => {
       const { currentHeader, hasFetched } = useSelector((state: RootState) => state.header);
    const { currentWebsite } = useSelector((state: RootState) => state.websites);
   
    const dispatch = useDispatch<AppDispatch>();
    // fetch the current header based on tenantId
    useEffect(() => {
        if (currentHeader == null &&
            currentWebsite &&
            currentWebsite._id &&
            currentWebsite.tenantId) {
            dispatch(fetchWebsiteCurrentHeaders({ tenantId: currentWebsite.tenantId, websiteId: currentWebsite._id }));
        }
    }, [currentHeader, currentWebsite]);
  return (
   null
  )
}

export default GetAllWebsiteHeader