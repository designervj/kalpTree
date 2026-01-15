"use client";

import React from "react";
import {
  Brain,
  Save,
  Sparkles,
  Settings,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

export default function Page() {
  return (
    <div className="min-h-screen ">
      {/* PAGE TITLE */}
      <div className="mb-8">
        {/* <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Brain className="text-purple-600" />
          AI Settings
        </h1> */}
        <BreadCrumbPage/>
        <p className="text-gray-500 mt-1">
          Configure AI behavior and features
        </p>
      </div>

      {/* SETTINGS CARD */}
      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6 max-w-3xl">
        {/* AI ENABLE */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">Enable AI</h3>
            <p className="text-sm text-gray-500">
              Turn AI features on or off
            </p>
          </div>
          <input type="checkbox" className="h-5 w-5" />
        </div>

        {/* MODEL SELECT */}
        <div>
          <label className="block font-medium mb-2">
            AI Model
          </label>
          <select className="w-full border rounded-lg px-3 py-2">
            <option>GPT-4</option>
            <option>GPT-3.5</option>
            <option>Custom Model</option>
          </select>
        </div>

        {/* TEMPERATURE */}
        <div>
          <label className="block font-medium mb-2">
            Creativity Level
          </label>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Low = Accurate, High = Creative
          </p>
        </div>

        {/* MAX TOKENS */}
        <div>
          <label className="block font-medium mb-2">
            Max Response Length
          </label>
          <input
            type="number"
            placeholder="e.g. 500"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* AI FEATURES */}
        <div>
          <h3 className="font-medium text-lg mb-3">
            AI Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Auto Content Generation",
              "SEO Optimization",
              "Smart Suggestions",
              "Grammar Correction",
            ].map((feature) => (
              <label
                key={feature}
                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input type="checkbox" />
                <Sparkles className="text-purple-500" size={18} />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SYSTEM PROMPT */}
        <div>
          <label className="block font-medium mb-2">
            System Instruction
          </label>
          <textarea
            rows={4}
            placeholder="Define how AI should behave..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
