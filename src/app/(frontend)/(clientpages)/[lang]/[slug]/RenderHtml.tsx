"use client";
import { Website } from '@/components/admin/AppShell';
import { TemplateDocument } from '@/components/admin/templates/TemplateType';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

type props = {
    html: string
    currentWebsite: Website | null
    headerData: TemplateDocument | null
    footerData: TemplateDocument | null
}
const RenderHtml = ({ html, currentWebsite, footerData, headerData }: props) => {
    localStorage.setItem("current_website", JSON.stringify(currentWebsite));
    localStorage.setItem("current_header", JSON.stringify(headerData));
    localStorage.setItem("current_footer", JSON.stringify(footerData));
    console.log("current_website", currentWebsite);
    console.log("current_header", headerData);
    console.log("html", html);

    return (
        <div >
            {/* Render header at the top if headerData exists */}
            {headerData && headerData.content && (
            
                    <div
                        suppressHydrationWarning
                        dangerouslySetInnerHTML={{ __html: headerData.content.replace(/\\n/g, '') || '' }}
                    />
             
            )}

            {/* Render main page content */}
            <main>
                <div
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </main>

            {/* Render footer at the bottom if footerData exists */}
            {footerData && footerData.content && (
             
                    <div
                        suppressHydrationWarning
                        dangerouslySetInnerHTML={{ __html: footerData.content.replace(/\\n/g, '') || '' }}
                    />
           
            )}
        </div>
    )
}

export default RenderHtml