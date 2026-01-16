"use client"
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFooterById } from '@/hooks/slices/footer/FooterThunk';

const FooterContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const dispatch = useDispatch<AppDispatch>();
    console.log(id)
    const { page, updatePage, type } = useSelector((state: RootState) => state.pageEdit)

    useEffect(() => {
        if (id && page == null) {
            dispatch(fetchFooterById({ id }))
        }
    }, [id, page, updatePage, type, dispatch])

    return (
        <>
            {page && page.content && (
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
    )
}

export default FooterContent
