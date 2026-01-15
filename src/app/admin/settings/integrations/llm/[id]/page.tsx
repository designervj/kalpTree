"use client";

import LLmForm from '@/components/admin/settings/integration/llm/form/LLmForm';
import { fetchLLMSettingById } from '@/hooks/slices/setting/llmSetting/LLMSettingThunk';
import { AppDispatch } from '@/store/store';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Page = () => {
    // const dispatch = useDispatch<AppDispatch>();

    // useEffect(() => {
    //     if (params.id) {
    //         dispatch(fetchLLMSettingById({ id: params.id }));
    //     }
    // }, [params.id, dispatch]);

    return (
        <LLmForm />
    );
};

export default Page;