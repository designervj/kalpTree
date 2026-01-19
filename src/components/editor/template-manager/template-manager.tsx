"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { Download, FileText, Save, Search, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  componentCategories,
  componentTemplates,
} from "../../../../utils/component-library";

interface TemplateManagerProps {
  onSelectTemplate: (content: string, append?: boolean) => void;
  onSaveTemplate: (name: string, content: string) => void;
  currentContent?: string;
}

export function TemplateManager({
  onSelectTemplate,
  onSaveTemplate,
  currentContent,
}: TemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [templateName, setTemplateName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const filteredTemplates = componentTemplates.filter((template) => {
    const matchesSearch = template.label
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = [];
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof componentTemplates>);

  const handleSaveTemplate = () => {
    if (templateName && currentContent) {
      onSaveTemplate(templateName, currentContent);
      setTemplateName("");
      setSaveDialogOpen(false);
    }
  };

  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplates((prev) => {
      if (prev.includes(templateId)) return prev.filter((id) => id !== templateId);
      return [...prev, templateId];
    });
  };

  const handleAddSelectedTemplates = () => {
    const templates = componentTemplates.filter((template) =>
      selectedTemplates.includes(template.id)
    );

    templates.forEach((template) => {
      onSelectTemplate(template.content, true);
    });

    setSelectedTemplates([]);
    setOpen(false);
  };

  const handleTemplateDoubleClick = (template: any) => {
    onSelectTemplate(template.content, true);
    setOpen(false);
  };

  return (
    <>
      {/* Smooth scrollbar styling (Radix ScrollArea viewport + fallback) */}
      <style jsx global>{`
        /* If you're using shadcn/radix ScrollArea */
        .tm-scroll [data-radix-scroll-area-viewport] {
          scrollbar-width: thin;
          scrollbar-color: rgba(15, 23, 42, 0.28) transparent;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar {
          width: 10px;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
          background: transparent;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
          background-color: rgba(15, 23, 42, 0.22);
          border-radius: 999px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
          background-color: rgba(15, 23, 42, 0.32);
        }

        /* Fallback if native scroll appears */
        .tm-native-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(15, 23, 42, 0.28) transparent;
        }
        .tm-native-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .tm-native-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .tm-native-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(15, 23, 42, 0.22);
          border-radius: 999px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .tm-native-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(15, 23, 42, 0.32);
        }
      `}</style>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-white hover:text-primary hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Templates
          </Button>
        </DialogTrigger>  

        {/* IMPORTANT: fixed height + internal scroll only (no ugly outer scrollbar) */}
        <DialogContent className="sm:max-w-[700px] w-[95vw] h-[80vh] flex flex-col overflow-hidden bg-white border border-gray-200 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Template Library</DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
              <Input
                placeholder="Search templates..."
                className="pl-9 h-9 text-sm bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogContent className="bg-white border border-gray-200 rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">
                    Save as Template
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="template-name"
                      className="text-xs font-medium text-gray-700"
                    >
                      Template Name
                    </label>
                    <Input
                      id="template-name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="Enter template name"
                      className="h-9 text-sm bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-sm border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => setSaveDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="h-9 text-sm" onClick={handleSaveTemplate}>
                      Save Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* REMOVE overflow-y-auto here (this was causing ugly native scrollbar) */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="grid w-full grid-cols-2 h-10 bg-gray-100 rounded-xl">
              <TabsTrigger value="browse" className="text-sm">
                Browse Templates
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-sm">
                My Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="browse"
              className={cn(
                "flex-1 flex flex-col min-h-0 pt-3",
                activeTab !== "browse" && "hidden"
              )}
            >
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-sm rounded-xl",
                    selectedCategory !== "all" &&
                      "border-gray-200 text-gray-800 hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>

                {componentCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 text-sm rounded-xl",
                      selectedCategory !== category.id &&
                        "border-gray-200 text-gray-800 hover:bg-gray-50"
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Templates (only this area scrolls, and scrollbar looks clean) */}
              <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white overflow-hidden">
                <ScrollArea className="h-full tm-scroll">
                  <div className="tm-native-scroll space-y-6 px-3 py-3">
                    {Object.entries(groupedTemplates).map(([category, templates]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold mb-3 text-gray-900 sticky top-0 bg-white py-2 z-10">
                          {componentCategories.find((c) => c.id === category)?.label ||
                            category}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {templates.map((template) => (
                            <Card
                              key={template.id}
                              className={cn(
                                "cursor-pointer transition-all bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl",
                                selectedTemplates.includes(template.id) &&
                                  "border-2 border-blue-600"
                              )}
                              onClick={() => handleTemplateSelection(template.id)}
                              onDoubleClick={() => handleTemplateDoubleClick(template)}
                            >
                              <CardContent className="p-2">
                                <div className="aspect-video bg-gray-100 rounded-lg mb-2 overflow-hidden border border-gray-200">
                                  <img
                                    src={
                                      template.thumbnail ||
                                      "/placeholder.svg?height=100&width=200"
                                    }
                                    alt={template.label}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h4 className="font-medium text-xs text-gray-900 truncate">
                                  {template.label}
                                </h4>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {selectedTemplates.length > 0 && (
                <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {selectedTemplates.length} template(s) selected
                    </span>
                    <Button size="sm" className="h-9 text-sm" onClick={handleAddSelectedTemplates}>
                      Add Selected Templates
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="saved"
              className={cn(
                "flex-1 flex flex-col min-h-0 pt-3",
                activeTab !== "saved" && "hidden"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  My Saved Templates
                </h3>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => toast("Feature Under Development!")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => toast("Feature Under Development!")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div>
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">
                    No saved templates yet
                  </h4>
                  <p className="text-sm mb-4 text-gray-600">
                    Save your current design as a template to reuse it later
                  </p>
                  <Button
                    size="sm"
                    className="h-9 text-sm"
                    onClick={() => toast("Feature Under Development!")}
                    // onClick={() => setSaveDialogOpen(true)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Current Design
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
