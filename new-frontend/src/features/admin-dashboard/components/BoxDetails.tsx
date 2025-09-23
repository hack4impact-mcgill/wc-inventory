import { Button } from "@/components/ui/button";
import ContentCard from "./ContentCard";
import { BoxItem } from "@/types/box";

interface BoxDetailsProps {
  boxName: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  contents: BoxItem[];
  isMultiSelect?: boolean;
}

const BoxDetails = ({
  boxName,
  location,
  createdAt,
  updatedAt,
  contents,
  isMultiSelect = false,
}: BoxDetailsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6 border rounded-lg">
      {!isMultiSelect ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Box {boxName}</h2>
          </div>
          <p className="text-gray-600 mb-2">Location: {location}</p>
          <p className="text-gray-600 mb-4">
            Created on: {formatDate(createdAt)}
            <br />
            Updated on: {formatDate(updatedAt)}
          </p>
        </>
      ) : (
        <h2 className="text-xl font-semibold mb-4">Contents selected</h2>
      )}

      <h3 className="font-medium mb-3">Contents:</h3>
      <div className="space-y-3">
        {contents.map((item, idx) => (
          <ContentCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BoxDetails;
