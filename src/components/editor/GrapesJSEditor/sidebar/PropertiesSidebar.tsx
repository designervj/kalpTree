"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";



import { Box, MousePointer, Palette } from "lucide-react";
import { InteractivityEditor } from "../../interactivity/interactivity-editor";
import { StyleEditor } from "../../style-editor/style-editor";
import { AttributesEditor } from "../../attributes-editor/attributes-editor";

type PropertiesSidebarProps = {
  showSidebar: boolean;
  selectedElement: any;
  styles: any;
  onStyleChange: (property: string, value: string) => void;
  onAttributeChange: (name: string, value: any) => void;
  onInteractivityChange: (config: any) => void;
};

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  showSidebar,
  selectedElement,
  styles,
  onStyleChange,
  onAttributeChange,
  onInteractivityChange,
}) => {
  if (!showSidebar) return null;

  const renderEmptySelectionMessage = (icon: "Box" | "MousePointer", type: string) => {
    const Icon = icon === "MousePointer" ? MousePointer : Box;

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
        <Icon className="w-10 h-10 mb-3 opacity-50" />
        <h3 className="mb-2 text-sm font-medium">No Element Selected</h3>
        <p className="text-xs">
          Select an element on the canvas to edit its {type}
        </p>
      </div>
    );
  };

  const renderStyleTab = () => {
    if (!selectedElement) {
      return renderEmptySelectionMessage("Box", "properties");
    }
    return <StyleEditor styles={styles} onStyleChange={onStyleChange} />;
  };

  const renderAttributesTab = () => {
    if (!selectedElement) {
      return renderEmptySelectionMessage("Box", "attributes");
    }
    return (
      <AttributesEditor
        selectedElement={selectedElement}
        onAttributeChange={onAttributeChange}
      />
    );
  };

  const renderInteractivityTab = () => {
    if (!selectedElement) {
      return renderEmptySelectionMessage("MousePointer", "interactivity");
    }
    return (
      <InteractivityEditor
        selectedElement={selectedElement}
        onInteractivityChange={onInteractivityChange}
      />
    );
  };

  return (
    <div className="w-[25%] border-l border-slate-800 flex flex-col h-full transition-all duration-300 ease-in-out">
      <Tabs defaultValue="style" className="flex flex-col h-full">
        <TabsList className="grid w-full h-10 grid-cols-3 border-b rounded-none bg-slate-900 border-slate-800 text-white">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="style" className="text-xs font-medium text-white">
                <Palette className="w-4 h-4" />
                <span className="sr-only">Style</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Style</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger value="attributes" className="text-xs font-medium text-white">
                <Box className="w-4 h-4" />
                <span className="sr-only">Attributes</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Attributes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger
                value="interactivity"
                className="text-xs font-medium text-white"
              >
                <MousePointer className="w-4 h-4" />
                <span className="sr-only">Interactivity</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Interactivity</TooltipContent>
          </Tooltip>
        </TabsList>

        <TabsContent value="style" className="flex-1 p-3 overflow-y-auto">
          {renderStyleTab()}
        </TabsContent>

        <TabsContent value="attributes" className="flex-1 p-3 overflow-y-auto">
          {renderAttributesTab()}
        </TabsContent>

        <TabsContent
          value="interactivity"
          className="flex-1 p-3 overflow-y-auto"
        >
          {renderInteractivityTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertiesSidebar;
