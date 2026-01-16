"use client"
import { Button } from '@/components/ui/button';
import { fetchCurrentHeaders, fetchHeaders } from '@/hooks/slices/header/HeaderThunk';
import { AppDispatch, RootState } from '@/store/store';
import { Layout, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TemplateDocument } from '../templates/TemplateType';
import { setPageEdit } from '@/hooks/slices/pageEditSlice';

const ShowCurrentHeader = () => {
    const { currentHeader, hasFetched } = useSelector((state: RootState) => state.header);
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

        const handleBuilderEdit = async(header: TemplateDocument) => {
               dispatch(setPageEdit({
                page: header,
                type: 'header'
               }));
            
               //  router.push(`/${copied.slug}`);
               window.open(`/header?id=${header._id}&websiteId=${header.websiteId}`, "_blank", "noopener,noreferrer");
        };
    
        const handleDelete = () => {
            // Add your delete logic here
            console.log('Delete clicked');
        };
    
    return (
        <div>
            {!hasFetched && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading...</p>
                </div>
            )}
            {hasFetched && currentHeader && currentHeader._id && currentHeader._id.toString() && currentHeader.content ? (
                 <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Header with action buttons */}
                    <div className="flex items-center justify-between gap-2 p-2 border-b bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-700 flex-1 text-center">Website Header</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleBuilderEdit(currentHeader)}
                                title="Builder"
                            >
                                <Layout className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={handleDelete}
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div
                        key={currentHeader._id.toString()}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html:currentHeader?.content?.replace(/\\n/g, '')}}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No header link with this website</p>
                </div>
            )}

        </div>
    )
}

export default ShowCurrentHeader