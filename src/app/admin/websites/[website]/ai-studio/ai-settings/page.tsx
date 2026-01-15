"use client";

import React, { useState } from "react";
import { Brain, Save, ToggleLeft, ToggleRight } from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [contentGen, setContentGen] = useState(false);

  return (
    <div className="min-h-screen ">
      {/* PAGE TITLE */}
      <div className="mb-8">
        {/* <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Brain className="text-blue-600" />
          AI Settings
        </h1> */}
        <BreadCrumbPage/>
        <p className="text-gray-500 mt-1">
          Manage AI features and behavior for your platform
        </p>
      </div>

      {/* SETTINGS CARD */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6 max-w-3xl">
        
        {/* AI ENABLE */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Enable AI System</h3>
            <p className="text-sm text-gray-500">
              Turn AI features on or off globally
            </p>
          </div>
          <button onClick={() => setAiEnabled(!aiEnabled)}>
            {aiEnabled ? (
              <ToggleRight size={34} className="text-blue-600" />
            ) : (
              <ToggleLeft size={34} className="text-gray-400" />
            )}
          </button>
        </div>

        <hr />

        {/* AUTO SUGGEST */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">AI Auto Suggestions</h3>
            <p className="text-sm text-gray-500">
              Suggest titles, descriptions & keywords
            </p>
          </div>
          <button onClick={() => setAutoSuggest(!autoSuggest)}>
            {autoSuggest ? (
              <ToggleRight size={34} className="text-blue-600" />
            ) : (
              <ToggleLeft size={34} className="text-gray-400" />
            )}
          </button>
        </div>

        <hr />

        {/* CONTENT GENERATION */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">AI Content Generation</h3>
            <p className="text-sm text-gray-500">
              Automatically generate posts & content
            </p>
          </div>
          <button onClick={() => setContentGen(!contentGen)}>
            {contentGen ? (
              <ToggleRight size={34} className="text-blue-600" />
            ) : (
              <ToggleLeft size={34} className="text-gray-400" />
            )}
          </button>
        </div>

        <hr />

        {/* MODEL SETTINGS */}
        <div>
          <h3 className="font-medium mb-2">AI Model</h3>
          <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>GPT-4 (Recommended)</option>
            <option>GPT-3.5</option>
            <option>Custom Model</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
