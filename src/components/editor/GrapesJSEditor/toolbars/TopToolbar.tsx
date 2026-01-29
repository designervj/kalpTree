"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  Code,
  Download,
  Eye,
  Moon,
  PanelRight,
  Redo,
  Save,
  Sun,
  Trash2,
  Undo,
} from "lucide-react";

import { BlocksManager } from "../../blocks-manager/blocks-manager";
import { CodeEditor } from "../../code-editor/code-editor";
import { TemplateManager } from "../../template-manager/template-manager";
import { EditSection } from "../../sectionEdit/EditSection";
import HeaderEditForm from "../../sectionEdit/HeaderEditForm";

type TopToolbarProps = {
  editor: any;
  blocks: any[];
  actions: any;
  editorHtml: string;
  editorCss: string;
  editorJs: string;
  isPreviewMode: boolean;
  showSidebar: boolean;
  recentBlocks: string[];
  favoriteBlocks: string[];
  onImportCode: () => void;
  onClearCanvas: () => void;
  onTogglePreview: () => void;
  onToggleSidebar: () => void;
  onRecentBlocksChange: (blocks: string[]) => void;
  onFavoriteBlocksChange: (blocks: string[]) => void;
  onUpdateHtml: (html: string) => void;
  onUpdateCss: (css: string) => void;
  onUpdateJs: (js: string) => void;
  onSelectTemplate: (content: string, append?: boolean) => void;
  onSaveTemplate: (name: string, content: string) => void;
  onSave: () => void;
  setOpen: (open: boolean) => void;
  open: boolean;
};

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("kt_theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
  return prefersDark ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement; // <html>
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  window.localStorage.setItem("kt_theme", mode);
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  editor,
  blocks,
  actions,
  editorHtml,
  editorCss,
  editorJs,
  isPreviewMode,
  showSidebar,
  recentBlocks,
  favoriteBlocks,
  onImportCode,
  onClearCanvas,
  onTogglePreview,
  onToggleSidebar,
  onRecentBlocksChange,
  onFavoriteBlocksChange,
  onUpdateHtml,
  onUpdateCss,
  onUpdateJs,
  onSelectTemplate,
  onSaveTemplate,
  onSave,
  setOpen,
  open
}) => {
  const [theme, setTheme] = React.useState<ThemeMode>("dark");

  React.useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center justify-between h-12 px-3 border-b bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showSidebar ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 ml-1.5"
                onClick={onToggleSidebar}
              >
                <PanelRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {showSidebar ? "Hide Properties Panel" : "Show Properties Panel"}
            </TooltipContent>
          </Tooltip>

          <Link
            href="/"
            className="mr-4 text-base md:text-lg font-semibold tracking-tight"
          >
            KalpTreeNxt Web Builder
          </Link>
        </div>


    

        <div className="flex items-center space-x-1.5">

          {/* <Button className="text-black border-none bg-transprant  shadow-none h-8 px-4 text-[14px]" variant="outline">
            Edit
          </Button> */}

          
            <Tooltip>
            <TooltipTrigger asChild>
             

              <EditSection/>
            </TooltipTrigger>
            <TooltipContent side="bottom">Form</TooltipContent>
          </Tooltip>

            <Tooltip>
            <TooltipTrigger asChild>
             

              <HeaderEditForm />

            </TooltipTrigger>
            <TooltipContent side="bottom">Header Edit Form</TooltipContent>
          </Tooltip>

          
          {/* THEME TOGGLE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>


          

          <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <Tooltip>
            <TooltipTrigger asChild>
              <BlocksManager
                blocks={blocks}
                onAddBlock={(content) => actions.addComponent(content)}
                recentBlocks={recentBlocks}
                onRecentBlocksChange={onRecentBlocksChange}
                favorites={favoriteBlocks}
                onFavoritesChange={onFavoriteBlocksChange}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">Blocks</TooltipContent>
          </Tooltip>

             

          <Tooltip>
            <TooltipTrigger asChild>
              <TemplateManager
                onSelectTemplate={onSelectTemplate}
                onSaveTemplate={onSaveTemplate}
                currentContent={editorHtml || editor?.getHtml?.()}
                setOpen={setOpen}
                open={open}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">Templates</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <CodeEditor
                html={editorHtml}
                css={editorCss}
                js={editorJs}
                onUpdateHtml={onUpdateHtml}
                onUpdateCss={onUpdateCss}
                onUpdateJs={onUpdateJs}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">Edit Code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={onImportCode}
              >
                <Code className="w-3.5 h-3.5 mr-1.5" />
                Import HTML
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Import HTML</TooltipContent>
          </Tooltip>

          <div className="mx-1 hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={actions.undo}
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={actions.redo}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Redo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={onClearCanvas}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Reset Canvas</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isPreviewMode ? "secondary" : "ghost"}
                size="icon"
                className="w-8 h-8"
                onClick={onTogglePreview}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Preview</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={actions.downloadHtml}
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export HTML</TooltipContent>
          </Tooltip>


            

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={onSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Save</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopToolbar;
