"use client";
import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux';

type props = {
    html: string
}
const RenderHtml = ({ html }: props) => {

    const { currentHeader } = useSelector((state: RootState) => state.header);
    return (
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
    )
}

export default RenderHtml