import React from "react";
import {
  AlignCenter,
  Grid2X2,
  Grid3X3,
  Image as ImageIcon,
  Layout,
  Link as LinkIcon,
  MapPin,
  Star,
  Type,
  Video,
} from "lucide-react";

import { getBlockIcon } from "./blocks-manager";
import { BlockConfig } from "../../../../types/editor";

interface BlockListItemProps {
  block: BlockConfig;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleSelection: (blockId: string, event: React.MouseEvent) => void;
  onToggleFavorite: (blockId: string, event: React.MouseEvent) => void;
}

// Fallback icon map
const blockIcons = {
  section: <Layout className="w-5 h-5" />,
  text: <Type className="w-5 h-5" />,
  image: <ImageIcon className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  link: <LinkIcon className="w-5 h-5" />,
  map: <MapPin className="w-5 h-5" />,
  column1: <AlignCenter className="w-5 h-5" />,
  column2: <Grid2X2 className="w-5 h-5" />,
  column3: <Grid3X3 className="w-5 h-5" />,
};

const BlockListItem: React.FC<BlockListItemProps> = ({
  block,
  isSelected,
  isFavorite,
  onToggleSelection,
  onToggleFavorite,
}) => {
  const blockId = block?.id ?? "";

  const iconFromManager = blockId
    ? getBlockIcon(blockId as keyof typeof blockIcons)
    : null;

  const fallbackIcon =
    blockIcons[blockId as keyof typeof blockIcons] ?? (
      <Layout className="w-5 h-5" />
    );

  const icon = iconFromManager || fallbackIcon;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => onToggleSelection(blockId, e)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleSelection(
            blockId,
            e as unknown as React.MouseEvent<HTMLDivElement>
          );
        }
      }}
      className={[
        "group relative flex min-h-[112px] flex-col items-center justify-center rounded-xl border p-3 text-center cursor-pointer transition-all duration-200",
        "bg-white shadow-sm",
        "hover:-translate-y-[1px] hover:shadow-md",
        isSelected
          ? "border-blue-200 bg-blue-50/60 shadow-md ring-1 ring-blue-100"
          : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      {/* Favorite */}
      <button
        type="button"
        aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(blockId, e as unknown as React.MouseEvent);
        }}
        className={[
          "absolute right-2 top-2 rounded-md p-1 transition-all",
          isFavorite
            ? "opacity-100 bg-yellow-50"
            : "opacity-0 group-hover:opacity-100 hover:bg-slate-100",
        ].join(" ")}
      >
        <Star
          className={`h-3.5 w-3.5 ${
            isFavorite
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-400 hover:text-slate-600"
          }`}
        />
      </button>

      {/* Icon badge */}
      <div
        className={[
          "mb-3 flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
          isSelected
            ? "border-blue-200 bg-white text-blue-600"
            : "border-slate-200 bg-slate-50 text-slate-700 group-hover:bg-slate-100",
        ].join(" ")}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement, {
              // className: "w-5 h-5",
            })
          : icon}
      </div>

      {/* Label */}
      <div className="w-full px-1">
        <div className="line-clamp-2 text-[13px] font-semibold leading-4 text-slate-800">
          {block.label}
        </div>

        {block.category ? (
          <div className="mt-1 text-[10px] text-slate-500 line-clamp-1">
            {block.category}
          </div>
        ) : (
          <div className="mt-1 text-[10px] text-transparent">.</div>
        )}
      </div>
    </div>
  );
};

export default BlockListItem;