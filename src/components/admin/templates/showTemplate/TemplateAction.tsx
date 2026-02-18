import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2, Edit2 } from "lucide-react";
import { TemplateDocument } from '../TemplateType';

type Props = {
    data: TemplateDocument
    onEdit: (data: TemplateDocument) => void
    onPreview: (data: TemplateDocument) => void
    onPreviewBrand: (data: TemplateDocument) => void
    onDelete: (data: TemplateDocument) => void
}
const TemplateAction = ({ data, onEdit, onPreview, onPreviewBrand, onDelete }: Props) => {

    const handleEdit = (data: TemplateDocument) => {

        onEdit(data)

    };
    const handlePreview = (data: TemplateDocument) => {
        onPreview(data)
    };
    const handlePreviewBrand = (data: TemplateDocument) => {
        onPreviewBrand(data)
    };
    const handleDelete = async (data: TemplateDocument) => {
        onDelete(data)
    };
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="cursor-pointer border-none bg-transparent hover:bg-black/5 h-8 w-8 p-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    <BsThreeDotsVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel onClick={() => handleEdit(data)}>
                        <div className="flex items-center gap-2 cursor-pointer font-normal">
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handlePreview(data)}>
                        <div className="flex items-center  gap-2 cursor-pointer font-normal ">
                            <Eye className="h-4 w-4" />
                            Preview
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handlePreviewBrand(data)}>
                        <div className="flex items-center gap-2 font-normal">
                            <Download className="h-4 w-4" />
                            Brand Preview
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleDelete(data)}>
                        <div className="flex items-center  gap-2 font-normal">
                            <Trash2 className="h-4 w-4 text-red-600" />
                            Delete
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TemplateAction