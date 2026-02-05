"use client";

import type React from "react";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { BlocksModel, BlocksByCategory } from "@/types/block/Blocks";
import { filterBlocks, getCategories, groupBlocksByCategory } from "./blocksManagerUtils";
import { EmptyBlocksMessage } from "./EmptyBlocksMessage";
import { SearchAndFilterBar } from "./SearchAndFilterBar";
import { CategoryTabs } from "./CategoryTabs";
import { BlockGridItem } from "./BlockGridItem";
import { SelectedBlocksFooter } from "./SelectedBlocksFooter";
import BlockListItem from "./BlockListItem";
import { BlockConfig } from "../../../../types/editor";

// Helper function to get icon for any block id
export const getBlockIcon = (blockId: keyof typeof blockIcons) => {
  return blockIcons[blockId] || <Layout className="w-4 h-4" />;
};
// Types
interface BlocksManagerProps {
  blocks: BlockConfig[];
  onAddBlock: (blockContent: BlockConfig) => void;
  recentBlocks?: string[];
  onRecentBlocksChange?: (blocks: string[]) => void;
  favorites?: string[];
  onFavoritesChange?: (blocks: string[]) => void;
}

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

export function BlocksManager({
  blocks,
  onAddBlock,
  recentBlocks = [],
  onRecentBlocksChange,
  favorites = [],
  onFavoritesChange,
}: BlocksManagerProps) {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentBlocksList, setRecentBlocksList] =
    useState<string[]>(recentBlocks);
  const [favoritesList, setFavoritesList] = useState<string[]>(favorites);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [blockView, setBlockView] = useState<"grid" | "list">("grid");
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  // Process blocks data
  const blocksByCategory = groupBlocksByCategory(blocks);
  const categories = getCategories(blocksByCategory as BlocksByCategory);
  const filteredBlocks = filterBlocks(
    blocks,
    searchTerm,
    activeCategory,
    favoritesList,
    recentBlocksList
  );

  // Handle adding a block
  const handleAddBlock = useCallback(
    (blockId: string) => {
      // Find the block by ID
      const block = blocks.find((block) => block.id === blockId);

      if (block) {
        try {
          // updateRecentBlocks(blockId);
          // addBlockContent(block);
        } catch (error) {
          console.error("Error adding block:", error);
        }
      }
    },
    [blocks, onAddBlock, recentBlocksList, onRecentBlocksChange]
  );

  // Update recent blocks list
  const updateRecentBlocks = useCallback(
    (blockId: string) => {
      const updatedRecentBlocks = [
        blockId,
        ...recentBlocksList.filter((id) => id !== blockId),
      ].slice(0, 10); // Keep only the 10 most recent

      setRecentBlocksList(updatedRecentBlocks);
      if (onRecentBlocksChange) {
        onRecentBlocksChange(updatedRecentBlocks);
      }
    },
    [recentBlocksList, onRecentBlocksChange]
  );

  // Add block content to canvas
  const addBlockContent = useCallback(
    (block: BlockConfig) => {
if (block.content) {
  onAddBlock(block);
} else {
  onAddBlock({
    ...block,
    content: `<div class="p-4 bg-gray-100 border border-gray-300 rounded">
      <h3 class="text-lg font-medium">${block.label}</h3>
      <p class="text-gray-600">This is a placeholder for ${block.label}</p>
    </div>`
  });
}
    },
    [onAddBlock]
  );

  // Toggle block selection
  const toggleBlockSelection = useCallback(
    (blockId: string, event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent default click behavior

      setSelectedBlocks((prev) => {
        if (prev.includes(blockId)) {
          return prev.filter((id) => id !== blockId);
        } else {
          return [...prev, blockId];
        }
      });
    },
    []
  );

  // Handle adding all selected blocks
  const handleAddSelectedBlocks = useCallback(() => {
    // Add each selected block to the canvas
    selectedBlocks.forEach((blockId) => {
      const block = blocks.find((block) => block.id === blockId);
      if (block) {
        updateRecentBlocks(blockId);
        addBlockContent(block);
      }
    });

    // Clear selections and close the modal
    setSelectedBlocks([]);
    setOpen(false);
  }, [blocks, selectedBlocks, updateRecentBlocks, addBlockContent]);

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (blockId: string, event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent block from being added

      let updatedFavorites;
      if (favoritesList.includes(blockId)) {
        updatedFavorites = favoritesList.filter((id) => id !== blockId);
      } else {
        updatedFavorites = [...favoritesList, blockId];
      }

      setFavoritesList(updatedFavorites);
      if (onFavoritesChange) {
        onFavoritesChange(updatedFavorites);
      }
    },
    [favoritesList, onFavoritesChange]
  );

  // Render grid view
  const renderGridView = useCallback(
    () => (
      <div className="grid grid-cols-2 gap-3 p-1 md:grid-cols-3">
        {filteredBlocks.length > 0 ? (
          filteredBlocks.map((block) => {
            const b = block as BlockConfig;
            return (
              <BlockGridItem
                key={b.id}
                block={b}
                isSelected={selectedBlocks.includes(b.id)}
                isFavorite={favoritesList.includes(b.id)}
                onToggleSelection={toggleBlockSelection}
                onToggleFavorite={toggleFavorite}
              />
            );
          })
          
        ) : (
          <EmptyBlocksMessage />
        )}
      </div>
    ),
    [
      filteredBlocks,
      selectedBlocks,
      favoritesList,
      toggleBlockSelection,
      toggleFavorite,
    ]
  );

  // Render list view
  const renderListView = useCallback(
    () => (
      <div className="space-y-1.5 p-1">
  {filteredBlocks.length > 0 ? (
  filteredBlocks.map((block) => {
    const b = block as BlockConfig;
    return (
      <BlockListItem
        key={b.id}
        block={b}
        isSelected={selectedBlocks.includes(b.id)}
        isFavorite={favoritesList.includes(b.id)}
        onToggleSelection={toggleBlockSelection}
        onToggleFavorite={toggleFavorite}
      />
    );
  })
) : (
  <EmptyBlocksMessage />
)}
      </div>
    ),
    [
      filteredBlocks,
      selectedBlocks,
      favoritesList,
      toggleBlockSelection,
      toggleFavorite,
    ]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Layout className="w-3.5 h-3.5 mr-1.5" />
          Blocks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Blocks Library</DialogTitle>
          <DialogDescription>
            Drag and drop blocks to build your page. Click on a block to add it
            to the canvas.
          </DialogDescription>
        </DialogHeader>

        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          blockView={blockView}
          setBlockView={setBlockView}
          showFilterOptions={showFilterOptions}
          setShowFilterOptions={setShowFilterOptions}
        />

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <ScrollArea className="flex-1 pr-4 h-[400px] overflow-y-auto">
          {blockView === "grid" ? renderGridView() : renderListView()}
        </ScrollArea>

        {selectedBlocks.length > 0 && (
          <SelectedBlocksFooter
            selectedCount={selectedBlocks.length}
            onAddSelectedBlocks={handleAddSelectedBlocks}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}




// // Component for search bar and filter options
// function SearchAndFilterBar({
//   searchTerm,
//   setSearchTerm,
//   blockView,
//   setBlockView,
//   showFilterOptions,
//   setShowFilterOptions,
// }: {
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   blockView: "grid" | "list";
//   setBlockView: (view: "grid" | "list") => void;
//   showFilterOptions: boolean;
//   setShowFilterOptions: (show: boolean) => void;
// }) {
//   return (
//     <div className="flex items-center mb-4 space-x-2">
//       <div className="relative flex-1">
//         <Search className="absolute w-4 h-4 -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
//         <Input
//           placeholder="Search blocks..."
//           className="pl-8"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* View toggle and filter buttons */}
//       <div className="flex items-center space-x-1">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="w-8 h-8"
//           onClick={() => setBlockView(blockView === "grid" ? "list" : "grid")}
//         >
//           {blockView === "grid" ? (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <line x1="3" y1="6" x2="21" y2="6" />
//               <line x1="3" y1="12" x2="21" y2="12" />
//               <line x1="3" y1="18" x2="21" y2="18" />
//             </svg>
//           ) : (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <rect x="3" y="3" width="7" height="7" />
//               <rect x="14" y="3" width="7" height="7" />
//               <rect x="3" y="14" width="7" height="7" />
//               <rect x="14" y="14" width="7" height="7" />
//             </svg>
//           )}
//         </Button>

//         <div className="relative">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-8 h-8"
//             onClick={() => setShowFilterOptions(!showFilterOptions)}
//           >
//             <Filter className="w-4 h-4" />
//           </Button>

//           {showFilterOptions && <FilterOptionsDropdown />}
//         </div>
//       </div>
//     </div>
//   );
// }

// Component for filter options dropdown
// function FilterOptionsDropdown() {
//   return (
//     <div className="absolute right-0 z-10 w-48 p-2 mt-1 border rounded-md shadow-md bg-popover text-popover-foreground">
//       <div className="mb-2 text-xs font-medium">Sort By</div>
//       <div className="space-y-1">
//         <div className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-muted">
//           <input type="radio" id="sort-name" name="sort" className="mr-2" />
//           <label htmlFor="sort-name" className="text-xs cursor-pointer">
//             Name
//           </label>
//         </div>
//         <div className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-muted">
//           <input type="radio" id="sort-category" name="sort" className="mr-2" />
//           <label htmlFor="sort-category" className="text-xs cursor-pointer">
//             Category
//           </label>
//         </div>
//         <div className="flex items-center px-2 py-1 rounded-sm cursor-pointer hover:bg-muted">
//           <input
//             type="radio"
//             id="sort-recent"
//             name="sort"
//             className="mr-2"
//             defaultChecked
//           />
//           <label htmlFor="sort-recent" className="text-xs cursor-pointer">
//             Recently Used
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Component for category tabs
// function CategoryTabs({
//   categories,
//   activeCategory,
//   setActiveCategory,
// }: {
//   categories: string[];
//   activeCategory: string;
//   setActiveCategory: (category: string) => void;
// }) {
//   return (
//     <Tabs
//       defaultValue="all"
//       value={activeCategory}
//       onValueChange={setActiveCategory}
//     >
//       <div className="mb-4 overflow-x-auto">
//         <TabsList className="inline-flex w-auto p-1 h-9 bg-muted/50">
//           {categories.map((category) => (
//             <TabsTrigger
//               key={category}
//               value={category}
//               className="px-3 py-1.5 text-xs whitespace-nowrap flex items-center gap-1"
//             >
//               {category === "all" ? (
//                 <>
//                   <Layout className="w-3 h-3" />
//                   <span>All Blocks</span>
//                 </>
//               ) : category === "favorites" ? (
//                 <>
//                   <Star className="w-3 h-3" />
//                   <span>Favorites</span>
//                 </>
//               ) : category === "recent" ? (
//                 <>
//                   <Clock className="w-3 h-3" />
//                   <span>Recent</span>
//                 </>
//               ) : (
//                 <span className="capitalize">{category}</span>
//               )}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//       </div>
//     </Tabs>
//   );
// }

// Component for grid view item
// function BlockGridItem({
//   block,
//   isSelected,
//   isFavorite,
//   onToggleSelection,
//   onToggleFavorite,
// }: {
//   block: any;
//   isSelected: boolean;
//   isFavorite: boolean;
//   onToggleSelection: (blockId: string, event: React.MouseEvent) => void;
//   onToggleFavorite: (blockId: string, event: React.MouseEvent) => void;
// }) {
//   return (
//     <Card
//       className={`cursor-pointer transition-colors relative group ${
//         isSelected ? "border-2 border-primary" : "hover:border-primary"
//       }`}
//       onClick={(e) => onToggleSelection(block.id, e)}
//     >
//       <CardContent className="flex flex-col items-center justify-center p-3 text-center">
//         <div className="absolute z-10 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-6 h-6 hover:bg-muted"
//             onClick={(e) => onToggleFavorite(block.id, e)}
//           >
//             <Star
//               className={`h-3.5 w-3.5 ${
//                 isFavorite
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "text-muted-foreground"
//               }`}
//             />
//           </Button>
//         </div>
//         <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-muted">
//           {getBlockIcon(block.id)}
//         </div>
//         <span className="text-sm font-medium">{block.label}</span>
//         <span className="mt-1 text-xs text-muted-foreground">
//           {block.category || "Basic"}
//         </span>

//         {/* Premium badge */}
//         {block.premium && (
//           <Badge
//             variant="outline"
//             className="mt-2 text-white border-0 bg-gradient-to-r from-amber-500 to-amber-300"
//           >
//             Premium
//           </Badge>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



// // Component for selected blocks footer
// function SelectedBlocksFooter({
//   selectedCount,
//   onAddSelectedBlocks,
// }: {
//   selectedCount: number;
//   onAddSelectedBlocks: () => void;
// }) {
//   return (
//     <div className="sticky bottom-0 p-3 mt-4 border-t bg-background">
//       <div className="flex items-center justify-between">
//         <span className="text-xs text-muted-foreground">
//           {selectedCount} block(s) selected
//         </span>
//         <Button size="sm" onClick={onAddSelectedBlocks}>
//           Add Selected Blocks
//         </Button>
//       </div>
//     </div>
//   );
// }
