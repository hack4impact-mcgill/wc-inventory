import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Location } from '@/types/location';
import SearchInput from './components/search-input';
import TreeItem from './components/tree-item';

interface TreeSelectProps {
    items: ReadonlyArray<Location>;
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    disabled?: boolean;
    className?: string;
}

const TreeSelect = ({
    items,
    selectedId,
    onSelect,
    disabled = false,
    className,
}: TreeSelectProps): JSX.Element => {
    const [expanded, setExpanded] = React.useState<number[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredItems = React.useMemo(() => {
        if (!searchTerm) return items;
        const search = searchTerm.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.description?.toLowerCase().includes(search)
        );
    }, [items, searchTerm]);

    const handleToggle = (id: number) => {
        setExpanded(prev => {
            const isExpanded = prev.includes(id);
            return isExpanded
                ? prev.filter(x => x !== id)
                : [...prev, id];
        });
    };

    return (
        <Card className={cn("p-2", className)}>
            <div className="space-y-4">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                <div className="space-y-1">
                    <Button
                        type="button"
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-normal hover:bg-transparent",
                            !selectedId && "bg-neutral-200",
                            selectedId !== null && "hover:bg-neutral-50"
                        )}
                        onClick={() => onSelect(null)}
                    >
                        No Parent
                    </Button>
                    <div className="max-h-[200px] overflow-y-auto">
                        {filteredItems
                            .filter(item => item.parent_id === null)
                            .map(item => (
                                <TreeItem
                                    key={item.location_id}
                                    item={item}
                                    items={items}
                                    level={0}
                                    selectedId={selectedId}
                                    expanded={expanded}
                                    onToggle={handleToggle}
                                    onSelect={onSelect}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TreeSelect;