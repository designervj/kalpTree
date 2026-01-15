"use client"
import { fetchCurrentHeaders, fetchHeaders } from '@/hooks/slices/header/HeaderThunk';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const ShowCurrentHeader = () => {
    const { currentHeader } = useSelector((state: RootState) => state.header);
    const { currentWebsite } = useSelector((state: RootState) => state.websites);

    const dispatch = useDispatch<AppDispatch>();
    // fetch the current header based on tenantId
    useEffect(() => {
        if (currentHeader == null &&
            currentWebsite &&
            currentWebsite._id &&
            currentWebsite.tenantId) {
            dispatch(fetchCurrentHeaders({ tenantId: currentWebsite.tenantId, websiteId: currentWebsite._id }));
        }
    }, [currentHeader, currentWebsite]);
    return (
        <div>
            {currentHeader && currentHeader._id && currentHeader._id.toString() && currentHeader.content && (
                <div>
                    <div
                        key={currentHeader._id.toString()}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: currentHeader.content! }}
                        />
                    </div>
                </div>
            )}

        </div>
    )
}

export default ShowCurrentHeader