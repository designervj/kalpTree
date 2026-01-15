"use client"
import { AppDispatch, RootState } from '@/store/store';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createHeader } from '@/hooks/slices/header/HeaderThunk';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TemplateDocument } from '../templates/TemplateType';
import ShowCurrentHeader from './ShowCurrentHeader';

const ShowHeader = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { hasFetched, allHeader, currentHeader } = useSelector((state: RootState) => state.header);
    const { currentWebsite } = useSelector((state: RootState) => state.websites);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState<TemplateDocument | null>(null);

    const handleOpenModal = () => {

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedHeader(null);
    };

    const handleSaveHeader = async (header: TemplateDocument) => {

        if (!currentWebsite?._id || !currentWebsite?.tenantId) {
            toast.error('Please select a website first');
            return;
        }

        if (!header._id || !header.content) {
            toast.error('Invalid header data');
            return;
        }

        setSavingId(header._id.toString());
        const data = {
            slug: header.slug,
            tenantId: currentWebsite.tenantId,
            websiteId: currentWebsite._id,
            content: header.content
        }
        console.log("data---->", data)

        try {
            const result = await dispatch(createHeader(data));

            if (createHeader.fulfilled.match(result)) {
                toast.success('Header saved successfully!');
                handleCloseModal();
            } else {
                toast.error('Failed to save header');
            }
        } catch (error) {
            toast.error('An error occurred while saving');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="space-y-6">

            <ShowCurrentHeader />
            <button onClick={() => handleOpenModal()}>Show all Headers</button>

            {/* Modal */}
            {isModalOpen && allHeader && allHeader.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Header Templates</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                            {allHeader.map((header) => (
                                <div key={header._id?.toString()} className="border rounded-lg p-4 space-y-4">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: header.content! }}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => handleSaveHeader(header)}
                                            disabled={savingId === header._id!.toString()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {savingId === header._id!.toString() ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Saving...
                                                </span>
                                            ) : (
                                                'Save Header'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
                            <Button
                                onClick={handleCloseModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShowHeader