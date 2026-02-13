"use client"
import { useDispatch, useSelector } from 'react-redux';
import { TemplateDocument } from '../templates/TemplateType';
import React, { useEffect } from 'react'
import { AppDispatch, RootState } from '@/store/store';
import { setCurrentHeader } from '@/hooks/slices/header/HeaderSlice';
import AddHeader from './AddHeader';

type Props = {
    header: TemplateDocument
}
const HeaderEdit = ({ header }: Props) => {
    const { currentHeader, hasFetched } = useSelector((state: RootState) => state.header);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (header && currentHeader == null) {
            dispatch(setCurrentHeader(header))
        }
    }, [header, currentHeader]);



    return (
        <AddHeader header={currentHeader || undefined} isEdit={true} />
    )
}

export default HeaderEdit