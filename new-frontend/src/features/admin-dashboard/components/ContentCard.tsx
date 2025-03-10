import { BoxItem } from "@/types/box";

interface ContentCardProps {
  item: BoxItem;
}

const ContentCard = ({ item }: ContentCardProps) => {
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-3">
        {item.type === 'T-shirt' ? (
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
      </div>
    </div>
  );
};

export default ContentCard;
