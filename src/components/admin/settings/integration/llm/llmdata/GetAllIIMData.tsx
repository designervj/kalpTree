
import { fetchLLMSettings } from '@/hooks/slices/setting/llmSetting/LLMSettingThunk';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetAllIIMData = () => {
  const { isLLMSettingLoading, hasFetched } = useSelector(
    (state: RootState) => state.llmSetting
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && 
        user?.tenantId) {
        
      dispatch(fetchLLMSettings({tenantId:user?.tenantId}));
    }
  }, [hasFetched, isLLMSettingLoading, user,dispatch,currentWebsite]);

  return null;
}

export default GetAllIIMData