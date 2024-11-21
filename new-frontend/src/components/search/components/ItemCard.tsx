import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ItemCardProps {
    box: {
        name: string;
        box: string;
        size: string;
        category_name: string;
        gender: string;
        quantity: number;
    };
    categories: { value: string; label: string; icon: React.ComponentType }[];
    onBoxClick: (box: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ box, onBoxClick }) => {
    return (
        <Card key={box.name} className="cursor-pointer hover:bg-gray-50" onClick={() => onBoxClick(box.box)}>
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Box: {box.name}</p>
                        <p className="text-sm text-gray-500">Size: {box.size}</p>
                        <p className="text-sm text-gray-500">Gender: {box.gender}</p>
                        <p className="text-sm text-gray-500">Quantity: {box.quantity}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Category: {box.category_name}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ItemCard;