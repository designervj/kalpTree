"use client";
import React, { useEffect } from 'react'
import { Website } from '../admin/AppShell';
import { WebsitePageModel } from '../admin/website/websitePage/WebsitePageType';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setCurrentWebsite } from '@/hooks/slices/websites/WebsiteSlice';
import { setAllWebsitePages } from '@/hooks/slices/website/websitePageSlice';
import GrapesJSEditor from '../editor';
import { setPageEdit } from '@/hooks/slices/pageEditSlice';
import { fetchHeaders } from '@/hooks/slices/header/HeaderThunk';
import { fetchFooters } from '@/hooks/slices/footer/FooterThunk';
import GetGlobalStyle from '../admin/settings/global-styles/GetGlobalStyle';


type WebsiteBuilderProps = {
    pages: WebsitePageModel[];
    website: Website;
    search?: { slug: string };
}
const WebsiteBuilder = ({ pages, website, search }: WebsiteBuilderProps) => {

    const { currentWebsite: currentWebsiteData } = useSelector((state: RootState) => state.websites);
    const { websitePages } = useSelector((state: RootState) => state.websitePage);
    const { currentHeader } = useSelector((state: RootState) => state.header);
    const { currentFooter } = useSelector((state: RootState) => state.footer);
    // update current website
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (currentWebsiteData == null && website) {
            dispatch(setCurrentWebsite(website))
        }
    }, [website, currentWebsiteData, dispatch])


    // add pages to redux
    useEffect(() => {
        if (websitePages.length == 0 && pages.length > 0) {
            dispatch(setAllWebsitePages(pages))
            const getpage = pages.find((page) => page.slug == search?.slug)
            if (getpage) {
                dispatch(setPageEdit({
                    page: getpage,
                    type: "page"
                }))
            } else {
                dispatch(setPageEdit({
                    page: pages[0],
                    type: "page"
                }))
            }
        }
    }, [websitePages, dispatch])

    // get Header 
    useEffect(() => {
        if (currentWebsiteData && currentHeader == null) {
            dispatch(fetchHeaders({ websiteId: currentWebsiteData._id }))
        }
    }, [currentWebsiteData, currentHeader, dispatch])


    // get  footer
    useEffect(() => {
        if (currentWebsiteData && currentFooter == null) {

            dispatch(fetchFooters({ websiteId: currentWebsiteData._id }))
        }
    }, [currentWebsiteData, currentFooter, dispatch])

    return (
        <>
            <GetGlobalStyle />
            <GrapesJSEditor />
        </>
    )
}

export default WebsiteBuilder