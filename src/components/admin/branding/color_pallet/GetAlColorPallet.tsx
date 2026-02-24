"use client";

import { getAllColorPallets } from "@/hooks/slices/branding/colorPalletSlice/ColorPalletThunk";
import { setAllColorPallets } from "@/hooks/slices/branding/colorPalletSlice/ColorPalletSlice";
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { ColorPalletModal } from "./Color_Pallet_Modal";

const GetAlColorPallet = () => {
  const { colorPallets, isFetched } = useSelector(
    (state: RootState) => state.colorPallet,
  );

  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();
  // get All Global Color Pallet
  useEffect(() => {
    if (!isFetched) {
      dispatch(getAllColorPallets());
    }
  }, [isFetched]);

  // get color pallet based on website
  useEffect(() => {
    if (
      currentBusiness?.website?.branding &&
      currentBusiness.website?.branding?.colors &&
      colorPallets &&
      colorPallets.length > 0
    ) {
      const allColorPallet: ColorPalletModal[] = [
        ...currentBusiness.website.branding.colors,
        ...colorPallets,
      ];

      dispatch(setAllColorPallets(allColorPallet));
    }
  }, [currentBusiness, colorPallets]);

  return null;
};

export default GetAlColorPallet;
