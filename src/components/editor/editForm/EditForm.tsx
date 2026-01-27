"use client"
import React, { useEffect, useState } from 'react'
import { EditSection } from '../sectionEdit/EditSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type EditFormProps = {
    componentHtml: string;
}
const EditForm = ({ componentHtml }: EditFormProps) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log("componentHtml", componentHtml)
        if (componentHtml !== null) {
            console.log("componentHtml", componentHtml)
            setOpen(true)
        }else{
            setOpen(false)
        }
    }, [componentHtml])
    console.log("open", open)
    return (<>
   <EditSection open={open} setOpen={setOpen}
   componentHtml={componentHtml}/>
    </>)
}

export default EditForm