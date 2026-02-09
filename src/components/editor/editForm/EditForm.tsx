"use client"
import React, { useEffect, useState } from 'react'
import { EditSection } from '../sectionEdit/EditSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type EditFormProps = {
    componentHtml: string;
    onSave?: (html: string) => void;
}
const EditForm = ({ componentHtml, onSave }: EditFormProps) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log("componentHtml", componentHtml)
        if (componentHtml !== null) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [componentHtml])
    console.log("open", open)
    return (<>
        <EditSection
            open={open}
            setOpen={setOpen}
            componentHtml={componentHtml}
            onSaveHtml={onSave}
        />
    </>)
}

export default EditForm