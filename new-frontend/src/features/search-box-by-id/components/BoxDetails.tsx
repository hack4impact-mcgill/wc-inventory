import { Box } from "@/types/box"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CATEGORIES } from "../mock-data";

interface BoxDetailsProps {
  selectedBox: Box;
}


function BoxDetails({ selectedBox }: BoxDetailsProps) {
  return (
      <Card>
      <CardHeader>
        <CardTitle className="text-lg">Box Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-medium">Box ID:</span>{" "}
          {selectedBox.box_id}
        </div>
        <div>
          <span className="font-medium">Name:</span> {selectedBox.name}
        </div>
        <div>
          <span className="font-medium">Description:</span> {selectedBox.description}
        </div>
        <div>
          <span className="font-medium">Location ID:</span> {selectedBox.location_id}
        </div>
        <div>
          <span className="font-medium">Movement:</span> {selectedBox.movement}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Contents:</h4>
          <div className="grid gap-2">
            {selectedBox.contents.map((item) => (
              <Card key={item.box_content_id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.icon && <item.icon className="h-6 w-6 text-gray-600" />}
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
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BoxDetails