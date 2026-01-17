"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

interface AiChatProps {
  componentHtml: string;
  onResponse?: (response: string) => void;
}

const AiChat: React.FC<AiChatProps> = ({ componentHtml, onResponse }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {currentLLMSetting}= useSelector((state:RootState)=>state.llmSetting)
   const dispatch= useDispatch<AppDispatch>()
  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // TODO: Implement AI chat functionality
      console.log('Sending prompt:', prompt);
      console.log('Component HTML:', componentHtml);
      
      // Simulate API call
   const response = await fetch("/api/admin/llm/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelType: currentLLMSetting.name,
          model:currentLLMSetting.model,
          apiKey:currentLLMSetting.secreteKey,
          prompt:prompt,
          componentHtml: componentHtml,
        }),
      });

      const data = await response.json();
      
      // Pass the response to parent component
      if (onResponse && data) {
        onResponse(JSON.stringify(data, null, 2));
      }
      
      // Clear prompt after sending
      setPrompt('');
    } catch (error) {
      console.error('Error processing prompt:', error);
      if (onResponse) {
        onResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Textarea for AI prompt */}
      <div className="flex-1 flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Ask AI to modify this component
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Make the text blue and add a shadow, Change the layout to flex..."
          className="flex-1 min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isProcessing}
        />
      </div>

      {/* Send Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          disabled={!prompt.trim() || isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10"
        >
          <Send className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default AiChat;