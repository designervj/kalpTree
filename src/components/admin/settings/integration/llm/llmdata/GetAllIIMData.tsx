import { fetchLLMSettings } from "@/hooks/slices/setting/llmSetting/LLMSettingThunk";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllIIMData = () => {
  const { isLLMSettingLoading, hasFetched } = useSelector(
    (state: RootState) => state.llmSetting,
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && user?.tenantId) {
      dispatch(
        fetchLLMSettings({
          tenantId:
            user.role === "superadmin"
              ? user?.tenantId
              : "6965e74f0552bf15baa45962",
        }),
      );
    }
  }, [hasFetched, isLLMSettingLoading, user, dispatch, currentBusiness]);

  return null;
};

export default GetAllIIMData;
