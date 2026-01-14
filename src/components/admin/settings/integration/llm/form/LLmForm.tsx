"use client";

import React, { useState } from "react";
import { LLMModel, GPTModels } from "../type/LLMModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface LLMFormProps {
  initialData?: LLMModel;
  onSubmit: (data: LLMModel) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const LLmForm: React.FC<LLMFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LLMModel>({
    name: initialData?.name || "",
    secreteKey: initialData?.secreteKey || "",
    isActive: initialData?.isActive ?? true,
    model: initialData?.model || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LLMModel, string>>>({});
  const { user } = useSelector((state: RootState) => state.user);
  const currentWebsite = useSelector((state: RootState) => state.websites.currentWebsite);
  // Test API Key states
  const [testPrompt, setTestPrompt] = useState("");
  const [testResult, setTestResult] = useState("");
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");

  const LLMModelType = ["ChatGPT", "Gemini"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LLMModel]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
    }));
    // Clear error when user selects
    if (errors.name) {
      setErrors((prev) => ({
        ...prev,
        name: undefined,
      }));
    }
  };

  const handleModelChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      model: value,
    }));
    // Clear error when user selects
    if (errors.model) {
      setErrors((prev) => ({
        ...prev,
        model: undefined,
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LLMModel, string>> = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!formData.secreteKey || formData.secreteKey.trim() === "") {
      newErrors.secreteKey = "Secret Key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    if (!currentWebsite?._id) {
      setErrors((prev) => ({
        ...prev,
        name: "No website selected",
      }));
      return;
    }
    
    const data = {
      ...formData, 
      tenantId: user?.tenantId,
      websiteId: currentWebsite._id
    };
    
    await onSubmit(data);
  };

  const handleTestAPI = async () => {
    if (!formData.name || !formData.secreteKey) {
      setTestStatus("error");
      setTestResult("Please fill in Model Type and API Key before testing.");
      return;
    }

    if (!testPrompt.trim()) {
      setTestStatus("error");
      setTestResult("Please enter a test prompt.");
      return;
    }

    setIsTestLoading(true);
    setTestStatus("idle");
    setTestResult("");

    try {
      const response = await fetch("/api/admin/llm/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelType: formData.model,
          apiKey: formData.secreteKey,
          prompt: testPrompt,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestStatus("success");
        setTestResult(data.result || "API test successful!");
      } else {
        setTestStatus("error");
        setTestResult(data.error || "API test failed. Please check your credentials.");
      }
    } catch (error) {
      setTestStatus("error");
      setTestResult("Network error. Please try again.");
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData?._id ? "Edit LLM Model" : "Add LLM Model"}</CardTitle>
        <CardDescription>
          Configure your Language Model settings
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Model Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.name}
              onValueChange={handleSelectChange}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.name ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a model type" />
              </SelectTrigger>
              <SelectContent>
                {LLMModelType.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="secreteKey">
              Secret Key / API Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="secreteKey"
              name="secreteKey"
              type="password"
              placeholder="Enter your API key"
              value={formData.secreteKey}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.secreteKey ? "border-red-500" : ""}
            />
            {errors.secreteKey && (
              <p className="text-sm text-red-500">{errors.secreteKey}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your API key will be stored securely and never shared
            </p>
          </div>

          {/* GPT Model Selection - Only show when ChatGPT is selected */}
          {formData.name === "ChatGPT" && (
            <div className="space-y-2">
              <Label htmlFor="model">
                GPT Model <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.model}
                onValueChange={handleModelChange}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.model ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a GPT model" />
                </SelectTrigger>
                <SelectContent>
                  {GPTModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Select the specific GPT model version to use
              </p>
            </div>
          )}

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Enable or disable this LLM model
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive ?? true}
              onCheckedChange={handleSwitchChange}
              disabled={isLoading}
            />
          </div>

          {/* Test API Key Section */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium mb-2">Test API Key</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Test your API key by sending a prompt to verify it's working correctly.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testPrompt">Test Prompt</Label>
              <Textarea
                id="testPrompt"
                placeholder="Enter your test instruction here... (e.g., 'Write a haiku about coding')"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                disabled={isTestLoading}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleTestAPI}
              disabled={isTestLoading || !formData.name || !formData.secreteKey}
              className="w-full"
            >
              {isTestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing API...
                </>
              ) : (
                "Test API Key"
              )}
            </Button>

            {/* Test Result Section */}
            {(testStatus !== "idle" || testResult) && (
              <div className={`p-4 rounded-md border ${
                testStatus === "success" 
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                  : testStatus === "error"
                  ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                  : "bg-muted"
              }`}>
                <div className="flex items-start gap-2">
                  {testStatus === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  {testStatus === "error" && (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h5 className={`text-sm font-medium mb-1 ${
                      testStatus === "success" 
                        ? "text-green-900 dark:text-green-100" 
                        : testStatus === "error"
                        ? "text-red-900 dark:text-red-100"
                        : ""
                    }`}>
                      {testStatus === "success" ? "Success" : testStatus === "error" ? "Error" : "Result"}
                    </h5>
                    <p className={`text-sm whitespace-pre-wrap ${
                      testStatus === "success" 
                        ? "text-green-800 dark:text-green-200" 
                        : testStatus === "error"
                        ? "text-red-800 dark:text-red-200"
                        : "text-muted-foreground"
                    }`}>
                      {testResult}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData?._id ? "Update" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LLmForm;