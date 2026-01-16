"use client"
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFooterById } from '@/hooks/slices/footer/FooterThunk';
import EditButton from '../(frontend)/(clientpages)/EditButton';
import { getAllWebsites, getCurrentWebsites } from '@/hooks/slices/websites/WebsiteThunk';
import { Website } from '@/components/admin/AppShell';
import { fetchCurrentHeaders, fetchHeaders } from '@/hooks/slices/header/HeaderThunk';


const HeaderContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const websiteId = searchParams.get("websiteId");
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user)
    const { page, updatePage, type } = useSelector((state: RootState) => state.pageEdit)
    const { currentWebsite } = useSelector((state: RootState) => state.websites)

    useEffect(() => {
        if (id && page == null) {
            dispatch(fetchCurrentHeaders({ id }))
        }
    }, [id, page, updatePage, type, dispatch])

    useEffect(() => {
        if (websiteId && currentWebsite == null) {
            dispatch(getCurrentWebsites({ id: websiteId }))
        }
    }, [websiteId, currentWebsite, updatePage, type, dispatch])


    return (
        <>
        <h2>Hello</h2>
            {page && (
                <>
                    <EditButton
                        pageData={page}
                        currentWebsite={currentWebsite as Website}
                        user={user as any}
                    />
                    {page.content && (
                        <div
                            key={page._id?.toString()}
                            className="p-4"
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: page.content.replace(/\\n/g, '') || ''
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default HeaderContent
