import { Box } from "@/types/box"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import BoxContent from "./BoxContent";

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
          <span className="font-medium">Location ID:</span> {selectedBox.location_id}
        </div>

        {/* <div className="space-y-2">
          <h4 className="font-medium">Content:</h4>
          <div className="grid gap-2">
            {selectedBox.content.map((item) => 
            
              <BoxContent key={item.box_content_id} item={item} />
            )}
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

export default BoxDetails