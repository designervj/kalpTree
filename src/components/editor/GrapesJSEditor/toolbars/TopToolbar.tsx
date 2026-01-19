"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Code,
  Download,
  Eye,
  PanelRight,
  Redo,
  Save,
  Trash2,
  Undo,
} from "lucide-react";



import { BlocksManager } from "../../blocks-manager/blocks-manager";
import { CodeEditor } from "../../code-editor/code-editor";
import { TemplateManager } from "../../template-manager/template-manager";

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
};

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
}) => {



      //console.log("editorJs---",editorJs)
  return (
    <div className="flex items-center justify-between h-12 px-3 border-b border-slate-800 bg-slate-900">
      <Link href="/" className="mr-4 text-xl font-bold text-white">
        KalpTreeNxt Web Builder
      </Link>

      <div className="flex items-center space-x-1.5">
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
          <TooltipTrigger asChild >
            <TemplateManager
              onSelectTemplate={onSelectTemplate}
              onSaveTemplate={onSaveTemplate}
              currentContent={editorHtml || editor?.getHtml?.()}
         
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
              variant={isPreviewMode ? "default" : "ghost"}
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
              size="icon"
              className="w-20"
              onClick={onSave}
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Save</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showSidebar ? "default" : "ghost"}
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
      </div>
    </div>
  );
};

export default TopToolbar;
