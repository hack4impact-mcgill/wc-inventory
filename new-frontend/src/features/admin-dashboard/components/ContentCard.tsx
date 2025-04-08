import { BoxItem } from "@/types/box";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ContentCardProps {
  item: BoxItem;
  editMode: boolean;
  handleDelete: (id: string) => void;
}

const ContentCard = ({ item, editMode, handleDelete }: ContentCardProps) => {
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-3">
        {item.type === "T-shirt" ? (
          <div className="w-8 h-8">👕</div>
        ) : (
          <div className="w-8 h-8">👖</div>
        )}
        <div className="flex-1">
          <p className="font-medium">{item.type}</p>
          <p className="text-sm text-gray-600">
            {item.gender} • Size: {item.size}
          </p>
        </div>
        <div className="text-right">
          <p>Qty: {item.quantity}</p>
        </div>
        <div>
          {editMode && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-800"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
