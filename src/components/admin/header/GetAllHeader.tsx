
"use client";
import { fetchHeaders } from '@/hooks/slices/header/HeaderThunk';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GetAllTemplate from '../templates/GetAllTemplate';
import { setHeaders } from '@/hooks/slices/header/HeaderSlice';

const GetAllHeader = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { hasFetched, allHeader } = useSelector((state: RootState) => state.header);
    const { allTemplate } = useSelector((state: RootState) => state.template);

    useEffect(() => {
        if (allHeader &&
            allTemplate &&
            allHeader.length === 0 &&
            allTemplate.length > 0) {


            // Log each template's category
            allTemplate.forEach((template, index) => {
                console.log(`Template ${index}:`, {
                    label: template.label,
                    category: template.category,
                    slug: template.slug
                })
            })

            const onlyHeader = allTemplate.filter((template) => {
                const isNavigation = template.category === "navigation"
                console.log(`Filtering ${template.label}: category="${template.category}", isNavigation=${isNavigation}`)
                return isNavigation
            })
            if (onlyHeader.length > 0) {
                dispatch(setHeaders(onlyHeader));
            }
        }
    }, [allHeader, allTemplate]);

    return (
        <GetAllTemplate />
    )
}

export default GetAllHeader