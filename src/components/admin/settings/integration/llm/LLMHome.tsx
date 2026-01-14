"use client";

import React from 'react';
import LLMtable from './llmdata/LLMtable';
import GetAllIIMData from './llmdata/GetAllIIMData';

const LLMHome = () => {
  return (<>
    <div className="space-y-6">
      <LLMtable />
    </div>
   < GetAllIIMData/>
    </>
  );
};

export default LLMHome;