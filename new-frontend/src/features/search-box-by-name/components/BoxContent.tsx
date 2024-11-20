import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES } from "../mock-data";
import { BoxContent } from '@/types/box';

interface BoxContentProps {
  item: BoxContent;
}


const BoxContentComponent = ({ item }: BoxContentProps ) => {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {item.icon ? <item.icon className="h-6 w-6 text-gray-600" /> : <div className="h-6 w-6 bg-gray-200" />}
          <div className="flex flex-col">
            <div className="font-medium">
              {CATEGORIES[item.category_id]}
              {item.gender !== 'U' && ` (${item.gender})`}
            </div>
            <div className="text-sm text-gray-500">
              Size: {item.size}
            </div>
            <div className="text-sm text-gray-500">
              ID: {item.box_content_id}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">Qty: {item.quantity}</div>
        </div>
      </CardContent>
    </Card>
  );
};



export default BoxContentComponent;