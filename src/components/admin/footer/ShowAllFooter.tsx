import { Button } from '@/components/ui/button';
import { AppDispatch, RootState } from '@/store/store';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TemplateDocument } from '../templates/TemplateType';
import { toast } from 'sonner';
import { createFooter } from '@/hooks/slices/footer/FooterThunk';
import GetWebsiteFooter from './GetWebsiteFooter';

const ShowAllFooter = () => {
       const dispatch = useDispatch<AppDispatch>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { allFooter } = useSelector((state: RootState) => state.footer);
     const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const [savingId, setSavingId] = useState<string | null>(null);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

     const handleSaveFooter = async (footer: TemplateDocument) => {
    if (!currentWebsite?._id || !currentWebsite?.tenantId) {
            toast.error('Please select a website first');
            return;
        }
          if (!footer._id || !footer.content) {
                    toast.error('Invalid footer data');
                    return;
                }
        
                setSavingId(footer._id.toString());
                const data = {
                    ...footer,
                    tenantId: currentWebsite.tenantId,
                    websiteId: currentWebsite._id,
                
                }
                 try {
                     const result = await dispatch(createFooter(data));
                
                            if (createFooter.fulfilled.match(result)) {
                                toast.success('Footer saved successfully!');
                                handleCloseModal();
                            } else {
                                toast.error('Failed to save footer');
                            }
                        } catch (error) {
                            toast.error('An error occurred while saving');
                        } finally {
                            setSavingId(null);
                        }
     }
  return (
   <>
   <GetWebsiteFooter/>
   
    <Button onClick={() => handleOpenModal()}>Show all Footer</Button>

            {/* Modal */}
            {isModalOpen && allFooter && allFooter.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Footer Templates</h2>
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
                            {allFooter.map((footer) => {
                                const fixedContent = footer?.content?.replace(/\\n/g, '');
                                return( 
                                <div key={footer._id?.toString()} className="border rounded-lg p-4 space-y-4">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: fixedContent! }}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => handleSaveFooter(footer)}
                                            disabled={savingId === footer._id!.toString()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {savingId === footer._id!.toString() ? (
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
                                                'Save Footer'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            )}
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
   </>
  )
}

export default ShowAllFooter