"use client";
import { fetchFooters } from '@/hooks/slices/footer/FooterThunk';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type props = {
    html: string
}
const RenderHtml = ({ html }: props) => {

    const { currentHeader } = useSelector((state: RootState) => state.header);
    const { currentFooter } = useSelector((state: RootState) => state.footer);

    const dispatch = useDispatch<AppDispatch>();

    // fetch the current footer based on tenantId
    useEffect(() => {
        if (currentFooter == null &&
            currentHeader &&
            currentHeader.websiteId &&
                currentHeader.tenantId) {
            dispatch(fetchFooters({ tenantId: currentHeader.tenantId, websiteId: currentHeader.websiteId }));
        }
    }, [currentFooter, currentHeader]);

    return (
        <>
        <div>
            {/* Render header at the top if currentHeader exists */}
            {currentHeader && currentHeader.content && (
                <div
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: currentHeader.content }}
                />
            )}

            {/* Render main page content */}
            <div
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: html }}
            />  
        </div>
        {currentFooter && currentFooter.content && (
                <div
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: currentFooter.content }}
                />
            )}
        </>
    )
}

export default RenderHtml