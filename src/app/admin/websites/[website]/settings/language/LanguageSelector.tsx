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
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  //   const [languages, setLanguages] = useState<Language[]>([]);


  return (
    <>
      <LanguageSelector
        formData={currentWebsite}
        handleInputChange={() => console.log("yes")}
      />
    </>
  );
};
