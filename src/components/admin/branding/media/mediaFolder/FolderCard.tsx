"use client"
import { Folder, MoreVertical, Trash2, Type } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const FolderCard = ({
  name,
  onOpen,
  onRename,
  onDelete,
}: {
  name: string;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
}) => {
  return (
    <div
      onClick={onOpen}
      className="flex items-center gap-2 border border-gray-200 p-3 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition group"
    >
      <Folder size={20} className="text-slate-500 shrink-0" />
      <span className="text-sm font-medium text-slate-800 truncate flex-1">
        {name}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer opacity-0 group-hover:opacity-100 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Folder actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onRename();
            }}
          >
            <Type className="mr-2 h-4 w-4" />
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
  );
}

export default FolderCard