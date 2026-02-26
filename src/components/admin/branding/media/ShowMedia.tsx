"use client"
import React from 'react'
import {
    Upload,
    FolderPlus,
    FileText,
    Trash2,
    Type,
    Folder,
    ChevronRight,
    MoreVertical,
    Pencil,
    X,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Download,
    ExternalLink,
    Shield,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import CreateFolder from './CreateFolder';
import FolderTabs from './mediaFolder/FolderTabs';

const ShowMedia = () => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = React.useState(false);

    return (
        <>
            <div
                className="min-h-screen flex flex-col relative px-3 pt-0"
            //   onDragEnter={onDragEnter}
            //   onDragOver={onDragOver}
            //   onDragLeave={onDragLeave}
            //   onDrop={onDrop}
            >
                {isDragging && (
                    <div className="fixed inset-0 z-[9999] bg-blue-900/85">
                        <div className="absolute inset-1 border-2 border-dashed border-white/70 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center px-6">
                            <div className="text-center">
                                <div className="mx-auto mb-4 h-20 w-20 rounded-2xl border-2 border-white/80 bg-white/10 backdrop-blur-sm grid place-items-center">
                                    <Upload className="h-9 w-9 text-white" />
                                </div>
                                <h2 className="text-white text-4xl md:text-5xl font-semibold tracking-tight">
                                    Drop files to upload
                                </h2>
                                <p className="mt-3 text-white/80 text-sm md:text-base">
                                    Files will be added to the current folder
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-5 flex items-center justify-between px-0 pt-5 pb-2 border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">Media Library </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Manage images, documents and files
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setIsCreateFolderOpen(true)}
                        >
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Create Folder
                        </Button>

                        {/* <Button type="button" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Files
                        </Button> */}

                        {/* <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx"
            onChange={(e) => handleFiles(e.target.files)}
          /> */}
          
                    </div>

                </div>


                <div className="bg-white rounded-xl shadow-sm p-6 mb-5"      >
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                        <p className="text-gray-500 mb-4">
                            Drag & drop images here
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                            PNG, JPG up to 10MB
                        </p>

                        <Button
                            //  onClick={openPicker}
                            // variant="outline"
                            className="cursor-pointer"
                        >
                            Browse Files
                        </Button>
                    </div>
                </div>


                <div className="bg-gray-50 rounded-xl max-w-6xl mx-auto space-y-8 w-full">
                    <FolderTabs />
                </div>
            </div>
            {/* create folder modal */}
            <CreateFolder
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}

            />
        </>
    )
}

export default ShowMedia