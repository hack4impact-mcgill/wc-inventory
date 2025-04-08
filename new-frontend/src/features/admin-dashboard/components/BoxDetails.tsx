import { Button } from "@/components/ui/button";
import ContentCard from "./ContentCard";
import { BoxItem } from "@/types/box";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const [showModal, setShowModal] = useState(false);
  const [dropdownValues, setDropdownValues] = useState<string[]>([]);

  const handleDropdownChange = (index: number, value: string) => {
    const updated = [...dropdownValues];
    updated[index] = value;

    // If this was the last dropdown and we haven't reached 4 yet, add a new one
    if (index === dropdownValues.length - 1 && dropdownValues.length < 4) {
      updated.push("");
    }

    setDropdownValues(updated);
  };

  const handleDeleteItemById = async (id: string) => {
    //
    if (!id) return;

    const { data, error } = await supabase
      .from("box_contents")
      .delete()
      .eq("box_content_id", id);

    if (error) {
      return error;
    }

    queryClient.invalidateQueries({ queryKey: ["box_contents_view"] });
  };

  useEffect(() => {
    if (isMultiSelect && editMode) {
      setEditMode(false);
    }
  }, [isMultiSelect, editMode]);

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
              <Button
                variant="link"
                className="text-blue-600"
                onClick={() => {
                  setShowModal(true);
                  setDropdownValues([""]); // start fresh
                }}
              >
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Box Contents</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {dropdownValues.map((val, idx) => (
              <Select
                key={idx}
                value={val}
                onValueChange={(value) => handleDropdownChange(idx, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select item ${idx + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tshirt">T-shirt</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="socks">Socks</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                </SelectContent>
              </Select>
            ))}
          </div>

          <DialogFooter className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            {dropdownValues.length === 4 &&
              dropdownValues.every((val) => val) && (
                <Button onClick={() => setShowModal(false)}>Done</Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoxDetails;
