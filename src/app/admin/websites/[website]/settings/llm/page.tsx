"use client";

import LLMHome from '@/components/admin/settingsI/integration/llm/LLMHome';

export default function LLMIntegrationPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">LLM Integration</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Language Model integrations
        </p>
      </div>
      <LLMHome />
    </div>
  );
}
