import { FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { MediaItem } from "../MediaType";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
const MediaCard = ({
  item,
  onDelete,
  onRename,
  onOpenDetails,
}: {
  item: MediaItem;
  onDelete: () => void;
  onRename: () => void;
  onOpenDetails: () => void;
}) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <button
        type="button"
        onClick={onOpenDetails}
        className="block w-full text-left"
      >
        <div
          className="relative w-full"
          style={{
            paddingBottom: "72%",
            background:
              "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px",
          }}
        >
          {item.kind === "image" ? (
            <img
              src={item.src}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="text-gray-400" size={40} />
            </div>
          )}
        </div>
      </button>

      <div className="flex items-start justify-between gap-1 px-3 py-2.5">
        <button
          type="button"
          onClick={onOpenDetails}
          className="min-w-0 text-left flex-1"
        >
          <p className="text-sm font-semibold truncate text-slate-900 hover:text-violet-600">
            {item.name}
          </p>
          <p className="text-xs font-medium text-violet-600">{item.ext}</p>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0 mt-0.5"
              aria-label="More"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onOpenDetails();
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Attachment details
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onRename();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default MediaCard;
