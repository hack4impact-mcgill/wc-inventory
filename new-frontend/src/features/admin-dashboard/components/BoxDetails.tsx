import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ContentCard from "./ContentCard";
import { BoxItem } from "@/types/box";

interface BoxDetailsProps {
  boxId?: string;
  boxName: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  contents: BoxItem[];
  isMultiSelect?: boolean;
}

const BoxDetails = ({
  boxId,
  boxName,
  location,
  createdAt,
  updatedAt,
  contents,
  isMultiSelect = false,
}: BoxDetailsProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleEdit = () => {
    // Redirect to the create page with the box ID and name as query parameters
    navigate(`/create?boxId=${boxId}&boxName=${boxName}`);
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

      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Contents:</h3>
        {!isMultiSelect && (
          <Button 
            variant="link" 
            className="text-blue-600"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {contents.map((item, idx) => (
          <ContentCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BoxDetails;