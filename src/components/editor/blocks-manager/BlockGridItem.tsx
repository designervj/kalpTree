import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlignCenter,
  Clock,
  Filter,
  Grid2X2,
  Grid3X3,
  Image,
  Layout,
  LinkIcon,
  MapPin,
  Search,
  Star,
  Type,
  Video,
} from "lucide-react";
import React from "react";

import { BlocksModel } from "@/types/block/Blocks";
import { BlockConfig } from "../../../../types/editor";


// Block icons mapping
const blockIcons = {
  section: <Layout className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
  image: <Image className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  link: <LinkIcon className="w-4 h-4" />,
  map: <MapPin className="w-4 h-4" />,
  column1: <AlignCenter className="w-4 h-4" />,
  column2: <Grid2X2 className="w-4 h-4" />,
  column3: <Grid3X3 className="w-4 h-4" />,
};
// Helper function to get icon for any block id
export const getBlockIcon = (blockId: keyof typeof blockIcons) => {
  return blockIcons[blockId] || <Layout className="w-4 h-4" />;
};
export interface BlockGridItemProps {
  block: BlockConfig;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleSelection: (blockId: string, event: React.MouseEvent) => void;
  onToggleFavorite: (blockId: string, event: React.MouseEvent) => void;
  editor: any;
}

export function BlockGridItem({
  block,
  isSelected,
  isFavorite,
  onToggleSelection,
  onToggleFavorite,
  editor,
}: BlockGridItemProps) {
  const blockId = block?.id ?? "";

  const handleDragStart = (e: React.DragEvent) => {
    console.log("bleditorockId", editor)
    if (!editor) return;

    const blockManager = editor.Blocks || editor.BlockManager;
    console.log("blockManager", blockManager)
    const blockModel = blockManager?.get(blockId);
    console.log("blockModel", blockModel)
    if (blockModel) {
      // 1. Set as the current dragging block in GrapesJS
      if (typeof (editor as any).setDragBlock === "function") {
        (editor as any).setDragBlock(blockModel);
      } else if (typeof blockManager?.setDragBlock === "function") {
        blockManager.setDragBlock(blockModel);
      }

      // 2. Start the drag command (common in v0.17+)
      const commands = editor.Commands;
      const hasBlockDrag = commands && typeof commands.has === "function" && commands.has("block:drag");

      if (hasBlockDrag) {
        try {
          editor.runCommand("block:drag", {
            block: blockModel,
            event: e.nativeEvent,
          });
        } catch (err) {
          // Fallback
          editor.trigger("block:drag:start", blockModel, e.nativeEvent);
        }
      } else {
        editor.trigger("block:drag:start", blockModel, e.nativeEvent);
      }
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (!editor) return;
    const blockManager = editor.Blocks || editor.BlockManager;
    const blockId = block?.id ?? "";
    const blockModel = blockManager?.get(blockId);

    // Clean up drag state
    try {
      if (editor.stopCommand) editor.stopCommand("block:drag");
    } catch (err) {
      // Ignore
    }
    if (editor.trigger) editor.trigger("block:drag:stop", blockModel, e.nativeEvent);

    if (blockModel) {
      let content = blockModel.get("content");

      if (content) {
        // Defensive check for getDropPosition
        if (editor.Canvas && typeof editor.Canvas.getDropPosition === "function") {
          try {
            const position = editor.Canvas.getDropPosition(e.nativeEvent);
            const { target, index } = position;

            // Add the component at the drop position
            editor.addComponents(content, {
              at: index,
              target: target || editor.getWrapper(),
            });

            console.log("Block added at position:", position);
          } catch (err) {
            console.error("Error using getDropPosition, falling back:", err);
            editor.addComponents(content);
          }
        } else {
          // Fallback: Add to canvas via standard method
          console.warn("editor.Canvas.getDropPosition not found, using fallback");
          editor.addComponents(content);
        }
      }
    }

    if (typeof (editor as any).setDragBlock === "function") {
      (editor as any).setDragBlock(null);
    }
  };



  const handleBlockClick = () => {
    console.log("handleBlockClick", block)
  };
  console.log("all block", block)
  return (
    <Card
      className={`cursor-pointer transition-colors relative group ${isSelected ? "border-2 border-primary" : "hover:border-primary"
        }`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleBlockClick}
    // onClick={(e) => onToggleSelection(block.id ?? "", e)}
    >
      <CardContent className="flex flex-col items-center justify-center p-3 text-center">
        <div className="absolute z-10 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-muted"
          // onClick={(e) => onToggleFavorite(block.id ?? "", e)}
          >
            <Star
              className={`h-3.5 w-3.5 ${isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
                }`}
            />
          </Button>
        </div>
        <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-muted">
          {block.id && getBlockIcon(block.id as keyof typeof blockIcons)}
        </div>
        <span className="text-sm font-medium">{block.label}</span>
        <span className="mt-1 text-xs text-muted-foreground">
          {block.category || "Basic"}
        </span>

      </CardContent>
    </Card>
  );
}

