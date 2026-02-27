'use client';

import TemplateTopBar from '@/components/admin/templates/showTemplate/TemplateTopBar'
import React, { useState } from 'react'
import { TemplateDocument } from '@/components/admin/templates/TemplateType'
import ShowTemplate from '@/components/admin/templates/showTemplate/ShowTemplate';
import TemplateHome from '@/components/admin/templates/TemplateHome';

const Page = () => {
    const [selectedTemplates, setSelectedTemplates] = useState<TemplateDocument[]>([])

    return (
        <div>
            {/* <TemplateTopBar selectedTemplate={setSelectedTemplates} /> */}
            <TemplateHome />
        </div>
    )
}

export default Page