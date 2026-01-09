
"use client"
import { fetchAllTemplates } from '@/hooks/slices/templates/TemplateThunk'
import { AppDispatch, RootState } from '@/store/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllTemplate = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { allTemplate ,hasFetched} = useSelector((state: RootState) => state.template)
  
    useEffect(() => {
        if(!hasFetched)
        dispatch(fetchAllTemplates())
    }, [dispatch,hasFetched])
  
    return (
  null
  )
}

export default GetAllTemplate