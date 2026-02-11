import { RootState, AppDispatch } from '@/store/store'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TemplateForm from '../showTemplate/TemplateFrom'
import { useParams } from 'next/navigation'
import { fetchTemplateById } from '@/hooks/slices/templates/TemplateThunk'

const EditTemplate = () => {
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { currentTemplate } = useSelector((state: RootState) => state.template)

    useEffect(() => {
        if (id && (!currentTemplate || (currentTemplate._id !== id && currentTemplate.id !== id))) {
            dispatch(fetchTemplateById(id as string))
        }
    }, [id, currentTemplate, dispatch])

    if (!currentTemplate && id) {
        return <div className="p-8 text-center text-muted-foreground">Loading template...</div>
    }

    return (
        <TemplateForm initialData={currentTemplate} isEdit={true} />
    )
}

export default EditTemplate