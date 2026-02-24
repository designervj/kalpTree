import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

const RootFileControl = () => {
  // pas with website current
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  return (
    <pre className="text-xs leading-relaxed p-4 rounded-lg border bg-muted/20 overflow-x-auto whitespace-pre max-h-[920px]">
      <code className="whitespace-pre">
        {currentBusiness?.website?.globalStyle}
      </code>
    </pre>
  );
};

export default RootFileControl;
