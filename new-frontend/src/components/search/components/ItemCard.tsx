import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ItemCardProps {
    item: {
        box_content_id: number;
        box: string;
        size: string;
        categories: string;
        gender: string;
        quantity: number;
    };
    categories: { value: string; label: string; icon: React.ComponentType }[];
    onBoxClick: (box: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, categories, onBoxClick }) => {
    return (
        <Card key={item.box_content_id} className="cursor-pointer hover:bg-gray-50" onClick={() => onBoxClick(item.box)}>
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Box: {item.box}</p>
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                        <p className="text-sm text-gray-500">Gender: {item.gender}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Category: {categories.find((cat) => cat.value === item.categories)?.label}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ItemCard;