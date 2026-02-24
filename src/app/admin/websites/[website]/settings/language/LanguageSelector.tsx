"use client";

import { LanguageSelector } from "@/components/admin/users/languageSupport";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useSelector } from "react-redux";

interface Language {
  default: boolean;
  name: string;
}

export const LanguageSelectComponent = () => {
  const { allBusiness, businessWebsite, currentBusiness } = useSelector(
    (state: RootState) => state.business,
  );

  return (
    <>
      <LanguageSelector
        formData={currentBusiness?.website}
        handleInputChange={() => console.log("yes")}
      />
    </>
  );
};
