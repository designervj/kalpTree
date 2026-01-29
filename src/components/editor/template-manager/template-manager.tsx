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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  Code,
  Download,
  FileText,
  Plus,
  Save,
  Search,
  Sparkles,
  Upload,
  X,
  Check,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
// import {
//   componentCategories,
//   componentTemplates,
// } from "../../../../utils/component-library";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";

interface TemplateManagerProps {
  onSelectTemplate: (content: string, append?: boolean) => void;
  onSaveTemplate: (name: string, content: string) => void;
  currentContent?: string;
  setOpen: (open: boolean) => void;
  open: boolean;
}

interface CategoryBasedTemplate {
  id: string;
  label: string;
  content: string;
}
export function TemplateManager({
  onSelectTemplate,
  onSaveTemplate,
  currentContent,
  setOpen,
  open,
}: TemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [templateName, setTemplateName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"browse" | "saved">("browse");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const { allTemplate } = useSelector((state: RootState) => state.template);

  const categorybasedTemplate = useMemo(() => {
    if (!allTemplate) return [];

    // Create a Set to store unique category names
    const uniqueCategories = new Set<string>();

    allTemplate.forEach((template) => {
      if (template.category) {
        uniqueCategories.add(template.category);
      }
    });

    return Array.from(uniqueCategories);
  }, [allTemplate]);

  
  const filteredTemplates = useMemo(() => {
    return allTemplate.filter((template: TemplateDocument) => {
      if (!template.category)
        return false
      const matchesSearch = template?.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory,allTemplate]);

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
    const templates = allTemplate.filter((template) =>
      selectedTemplates.includes(template?.templateId??"")
    );

    templates.forEach((template) => onSelectTemplate(template?.content??"", true));

    setSelectedTemplates([]);
    setOpen(false);
  };

  const handleTemplateDoubleClick = (template: any) => {
    onSelectTemplate(template.content, true);
    setOpen(false);
  };

  const currentCategoryLabel =
    selectedCategory === "all"
      ? "All"
      : allTemplate.find((c) => c.id === selectedCategory)?.label ||
      selectedCategory;

  return (
    <>
      {/* Clean light scrollbar styling (like screenshot) */}
      <style jsx global>{`
        .tm-scroll [data-radix-scroll-area-viewport] {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.35) transparent;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar {
          width: 10px;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar-track {
          background: transparent;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.28);
          border-radius: 999px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .tm-scroll [data-radix-scroll-area-viewport]::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.4);
        }
      `}</style>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setOpen(true)}
          >
            <Code className="w-3.5 h-3.5 mr-1.5" />
            Templates
          </Button>
        </DialogTrigger>

        {/* Screenshot-like modal: wide, two-pane, internal scrolling only */}
        <DialogContent className="p-0 sm:max-w-[1180px] w-[96vw] h-[86vh] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
          {/* Header (title + subtitle + close) */}
          <div className="px-7 pt-6 pb-4 border-b border-slate-200">
            <DialogHeader className="space-y-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <DialogTitle className="text-[28px] leading-8 font-semibold text-slate-900">
                    Add page
                  </DialogTitle>
                  <p className="mt-1 text-sm text-slate-600">
                    Choose any page and customize it by changing the text, images and more.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </DialogHeader>
          </div>

          {/* Body */}
          <div className="flex h-[calc(86vh-96px)] min-h-0">
            {/* LEFT LIST (like screenshot) */}
            <div className="w-[320px] shrink-0 border-r border-slate-200 bg-white">
              <div className="p-5 pb-3">
                {/* Top action (Generate page) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("browse");
                    setSelectedCategory("all");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    activeTab === "browse"
                      ? "text-violet-600 bg-violet-50"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate page
                </button>

                <div className="mt-3 border-t border-slate-200" />

                {/* New empty page */}
                <button
                  type="button"
                  onClick={() => toast("New empty page (hook it to your logic)")}
                  className="mt-3 w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  New empty page
                </button>

                {/* Search (subtle, like builder UIs) */}
                <div className="mt-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-500"
                  />
                </div>
              </div>

              {/* List (scroll) */}
              <ScrollArea className="h-[calc(100vh-410px)] tm-scroll">
                <div className="px-3 pb-5">
                  {/* Browse/Saved toggle (as list items) */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("browse")}
                      className={cn(
                        "w-full text-left rounded-xl px-3 py-2 text-sm transition",
                        activeTab === "browse"
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      Templates
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("saved")}
                      className={cn(
                        "mt-1 w-full text-left rounded-xl px-3 py-2 text-sm transition",
                        activeTab === "saved"
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      My templates
                    </button>
                  </div>

                  <div className="my-3 border-t border-slate-200" />

                  <div className="px-3 pb-2 text-xs font-semibold text-slate-500">
                    Categories
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={cn(
                      "w-full text-left rounded-xl px-3 py-2 text-sm transition",
                      selectedCategory === "all"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    All
                  </button>

                  {categorybasedTemplate && categorybasedTemplate.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "mt-1 w-full text-left rounded-xl px-3 py-2 text-sm transition",
                        selectedCategory === category
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* RIGHT PREVIEW (like screenshot) */}
            <div className="flex-1 min-w-0 bg-slate-50">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full">
                {/* Browse */}
                <TabsContent value="browse" className="m-0 h-full">
                  <div className="h-full flex flex-col min-h-0">
                    {/* Top bar */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">
                          {currentCategoryLabel}
                        </div>
                        <div className="text-xs text-slate-500">
                          {filteredTemplates.length} layout(s)
                        </div>
                      </div>

                      {selectedTemplates.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-slate-600">
                            {selectedTemplates.length} selected
                          </div>
                          <Button
                            size="sm"
                            className="h-9 rounded-xl"
                            onClick={handleAddSelectedTemplates}
                          >
                            Add selected
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          Double-click a layout to add
                        </div>
                      )}
                    </div>

                    {/* Preview grid (scroll) */}
                    <ScrollArea className="flex-1 min-h-0 tm-scroll">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {filteredTemplates && filteredTemplates.map((template:TemplateDocument) => {
                            const isSelected = selectedTemplates.includes(template?.templateId??"");
                            return (
                              <Card
                                key={template.id}
                                className={cn(
                                  "group cursor-pointer rounded-2xl border bg-white transition",
                                  "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                                  isSelected && "ring-2 ring-violet-500 border-violet-300"
                                )}
                                onClick={() => handleTemplateSelection(template?.templateId??"")}
                                onDoubleClick={() => handleTemplateDoubleClick(template)}
                              >
                                <CardContent className="p-4">
                                  <div className="relative">
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                      <img
                                        src={
                                          template.thumbnail ||
                                          "/placeholder.svg?height=420&width=720"
                                        }
                                        alt={template.label}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>

                                    {/* Selection badge (top-left) */}
                                    {isSelected && (
                                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                                        <Check className="h-3.5 w-3.5" />
                                        Selected
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-slate-900 truncate">
                                        {template.label}
                                      </div>
                                      {/* <div className="text-xs text-slate-500 truncate">
                                        {componentCategories.find((c) => c.id === template.category)
                                          ?.label || template.category}
                                      </div> */}
                                    </div>

                                    {/* <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectTemplate(template?.content??"", true);
                                        setOpen(false);
                                      }}
                                    >
                                      Add
                                    </Button> */}
                                  </div> 
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        {filteredTemplates.length === 0 && (
                          <div className="mt-10 text-center text-slate-500">
                            No layouts found for your search.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                {/* Saved */}
                <TabsContent value="saved" className="m-0 h-full">
                  <div className="h-full flex flex-col min-h-0">
                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
                      <div className="text-sm font-semibold text-slate-900">
                        My Templates
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                          onClick={() => toast("Feature Under Development!")}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Import
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                          onClick={() => toast("Feature Under Development!")}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>

                        <Button
                          size="sm"
                          className="h-9 rounded-xl"
                          onClick={() => setSaveDialogOpen(true)}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save current
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-10">
                      <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                        <div className="text-sm font-semibold text-slate-900">
                          No saved templates yet
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          Save your current design as a template to reuse it later.
                        </div>
                        <Button
                          className="mt-5 h-10 rounded-xl"
                          onClick={() => setSaveDialogOpen(true)}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Current Design
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Save dialog (unchanged logic, restyled slightly) */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogContent className="bg-white border border-slate-200 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Save as Template</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label
                    htmlFor="template-name"
                    className="text-xs font-medium text-slate-700"
                  >
                    Template Name
                  </label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    className="h-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-violet-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                    onClick={() => setSaveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="h-10 rounded-xl" onClick={handleSaveTemplate}>
                    Save Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </>
  );
}
