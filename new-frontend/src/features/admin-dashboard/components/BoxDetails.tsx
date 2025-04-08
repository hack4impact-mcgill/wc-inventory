import { Button } from "@/components/ui/button";
import ContentCard from "./ContentCard";
import { BoxItem } from "@/types/box";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleDeleteItemById = async (id: string) => {
    //
    if (!id) return;

    const { data, error } = await supabase
      .from("box_contents")
      .delete()
      .eq("box_content_id", id);

    if (error) {
    }

    queryClient.invalidateQueries({ queryKey: ["box_contents_view"] });
  };

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
            {!editMode ? (
              <Button variant="link" className="text-blue-600">
                Log
              </Button>
            ) : (
              <Button variant="link" className="text-blue-600">
                +
              </Button>
            )}
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

      <div className="flex justify-between items-center">
        <h3 className="font-medium mb-3">Contents:</h3>
        {!isMultiSelect && (
          <Button
            variant="link"
            className="text-blue-600 mb-3"
            onClick={() => setEditMode((prevEditMode) => !prevEditMode)}
          >
            {!editMode ? "Edit" : "Done"}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {contents.map((item, idx) => (
          <ContentCard
            key={idx}
            item={item}
            editMode={editMode}
            handleDelete={handleDeleteItemById}
          />
        ))}
      </div>
    </div>
  );
};

export default BoxDetails;
