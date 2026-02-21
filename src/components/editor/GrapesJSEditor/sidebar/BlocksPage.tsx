import React, { useCallback, useState } from 'react'
import { filterBlocks } from '../../blocks-manager/blocksManagerUtils';
import { EmptyBlocksMessage } from '../../blocks-manager/EmptyBlocksMessage';
import { BlockConfig } from '../../../../../types/editor';
import BlockListItem from '../../blocks-manager/BlockListItem';

type BlocksPageProps = {
    blocks: any[];
    recentBlock: string[],
    favoriteBlock: string[],
    onFavoritesChange?: (blocks: string[]) => void;
}
const BlocksPage = ({ blocks, recentBlock, favoriteBlock, onFavoritesChange }: BlocksPageProps) => {
    const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [favoritesList, setFavoritesList] = useState<string[]>(favoriteBlock||[]);

    const [recentBlocksList, setRecentBlocksList] =
        useState<string[]>(recentBlock); const filteredBlocks = filterBlocks(
            blocks,
            searchTerm,
            activeCategory,
            favoritesList,
            recentBlocksList
        );

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

    return (

        <div className='grid grid-cols-2 gap-2 mt-3'>
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
    )
}

export default BlocksPage


