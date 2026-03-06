import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import GetAllTemplate from '../templates/GetAllTemplate';
import { setFooters } from '@/hooks/slices/footer/FooterSlice';
import ShowAllFooter from './ShowAllFooter';

const FooterHome = () => {


    const dispatch = useDispatch<AppDispatch>();
    const { hasFetched, allHeader } = useSelector((state: RootState) => state.header);
    const { allTemplate } = useSelector((state: RootState) => state.template);
    const { allFooter } = useSelector((state: RootState) => state.footer);
    // get all footer
    useEffect(() => {
        if (allFooter &&
            allTemplate &&
            allFooter.length === 0 &&
            allTemplate.length > 0) {


            // Log each template's category
            allTemplate.forEach((template, index) => {
                console.log(`Template ${index}:`, {
                    label: template.label,
                    category: template.category,
                    slug: template.slug
                })
            })

            const onlyFooter = allTemplate.filter((template) => {
                const isFooter = template.category === "footer"
                console.log(`Filtering ${template.label}: category="${template.category}", isFooter=${isFooter}`)
                return isFooter
            })
            if (onlyFooter.length > 0) {
                dispatch(setFooters(onlyFooter));
            }
        }
    }, [allFooter, allTemplate]);
    return (
        <>
            <GetAllTemplate />
            <ShowAllFooter />
        </>
    )
}

export default FooterHome