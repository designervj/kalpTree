"use client";

import React from 'react';
import { Folder } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function IntegrationsPage() {
  const router = useRouter();

  const integrations = [
    { id: 1, name: 'Data storage', icon: Folder, path: '/admin/settings/integrations/data-storage' },
    { id: 2, name: 'LLM Integration', icon: Folder, path: '/admin/settings/integrations/llm' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card 
              key={integration.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(integration.path)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Icon className="h-12 w-12 mb-3 text-primary" />
                <h3 className="text-lg font-medium text-center">{integration.name}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
