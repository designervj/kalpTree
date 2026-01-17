"use client"
import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFooterById } from '@/hooks/slices/footer/FooterThunk';
import EditButton from '../(frontend)/(clientpages)/EditButton';
import { getAllWebsites, getCurrentWebsites } from '@/hooks/slices/websites/WebsiteThunk';
import { Website } from '@/components/admin/AppShell';
import { fetchCurrentHeaders, } from '@/hooks/slices/header/HeaderThunk';
import { clearPageEdit } from '@/hooks/slices/pageEditSlice';


const HeaderContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const websiteId = searchParams.get("websiteId");
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user)
    const { page, updatePage, type } = useSelector((state: RootState) => state.pageEdit)
    const { currentWebsite } = useSelector((state: RootState) => state.websites)

    useEffect(() => {
        // Only fetch header if page is null OR if type is not 'footer'
        if (id && (page == null || type !== 'header')) {
            dispatch(fetchCurrentHeaders({ id }))
        }
    }, [id, page, type, dispatch])

    const currentPage = useMemo(() => {
        return page
    }, [page])

    useEffect(() => {
        if (websiteId && currentWebsite == null) {
            dispatch(getCurrentWebsites({ id: websiteId }))
        }
    }, [websiteId, currentWebsite, dispatch])




    return (
        <>

            {currentPage && (
                <>
                    <EditButton
                        pageData={currentPage}
                        currentWebsite={currentWebsite as Website}
                        user={user as any}
                        type="header"
                    />
                    {currentPage.content && (
                        <div
                            key={currentPage._id?.toString()}
                            className="p-4"
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: currentPage.content.replace(/\\n/g, '') || ''
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
