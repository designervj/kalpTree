import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterOptionsDropdown } from "./FilterOptionsDropdown";

export interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  blockView: "grid" | "list";
  setBlockView: (view: "grid" | "list") => void;
  showFilterOptions: boolean;
  setShowFilterOptions: (show: boolean) => void;
}

export function SearchAndFilterBar({
  searchTerm,
  setSearchTerm,
  blockView,
  setBlockView,
  showFilterOptions,
  setShowFilterOptions,
}: SearchAndFilterBarProps) {
  return (
    <div className="flex items-center mb-4 space-x-2">
      <div className="relative flex-1">
        <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
        <Input
          placeholder="Search blocks..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-1 1">
        <Button
          variant="secondary"
          size="icon"
          className="w-9 h-9 shaodow-md"
          onClick={() => setBlockView(blockView === "grid" ? "list" : "grid")}
        >
          {blockView === "grid" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          )}
        </Button>
        <div className="relative">
          <Button
          variant="secondary"
            size="icon"
            className="w-9 h-9 shaodow-md"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <Filter className="w-4 h-4" />
          </Button>
          {showFilterOptions && <FilterOptionsDropdown />}
        </div>
      </div>
    </div>
  );
}
