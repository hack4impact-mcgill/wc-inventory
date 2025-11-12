import { useQuery } from "@tanstack/react-query";
import { boxApi } from "@/lib/api/boxes";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BoxStatus } from "@/types/enums";


interface BoxItemWithId {
  id: string;
  type: string;
  gender: "Men" | "Women" | "Kids" | "Unisex";
  size: string;
  quantity: number;
}

interface BoxViewWithNewBoxItem {
  id: string;
  location: string;
  name: string;
  status: BoxStatus;
  contents: BoxItemWithId[];
  createdAt: string;
  updatedAt: string;
}

const ViewContents = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const boxIds = state?.boxIds || [];

  // Use React Query to fetch boxes data
  const {
    data: boxes = [],
    isLoading: isLoadingBoxes,
    isError: isBoxesError,
    error: boxesError,
  } = useQuery({
    queryKey: ["boxes"],
    queryFn: async () => boxApi.getBoxes(),
  });

  const filteredBoxes = boxes.filter((box) => boxIds.includes(box.id)) as BoxViewWithNewBoxItem[];

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      month: "numeric", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
    }
  );

  // Handle loading and error states
  if (isLoadingBoxes) {
    return (
      <div className="p-6">
        Loading inventory data...
      </div>
    );
  }
  if (isBoxesError) {
    return (
      <div className="p-6 text-red-500">
        Error loading inventory: {boxesError?.message}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center bg-white px-4 overflow-hidden">
      
      <div className="w-full max-w-screen-md mb-6">
        <div className="flex-[1] basis-0 w-full max-w-screen-md flex flex-col justify-center items-start mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-wide text-center mb-8">
            Content View
          </h1>
          <button 
            className="p-2 rounded-md border-2 border-gray-900 bg-gray-300 hover:bg-gray-400 mb-3 duration-300 ease-in-out"
            onClick={() => navigate("/lookup", { state })}
          >
            <ArrowLeft size={40} />
          </button>
      </div>
        <h2 className="text-xl font-bold text-gray-800">
          Box Quickview
        </h2>
      </div>

      <div className="flex-1 w-full max-w-screen-md overflow-y-auto p-2 space-y-6 border-gray-400 border rounded-lg">
        {filteredBoxes.length === 0 && (
          <p className="text-gray-500 text-lg text-center py-6">
            No boxes selected
          </p>
        )}
        {filteredBoxes.map((box) => (
          <Card key={box.id} className="w-full max-w-screen-md border-2 border-gray-900 bg-gray-50 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                {box.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <p>
                Location: {box.location === null ? "—" : box.location}
              </p>
              <p>
                Created on: {formatDate(box.createdAt)}         
              </p>
              <p>
                Updated on: {formatDate(box.updatedAt)}         
              </p>
              <div className="pt-4">
                <p className="font-semibold mb-3 text-black">
                  Contents:
                </p>
                { box.contents.map((content) => (
                  <Card key={content.id} className="flex justify-between items-center px-4 py-3 mb-2 border border-gray-300">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👖</span>
                      <div>
                        <p className="font-medium">
                          {content.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {content.gender} • Size: {content.size}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      Qty: {content.quantity}
                    </p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );

};

export default ViewContents;
