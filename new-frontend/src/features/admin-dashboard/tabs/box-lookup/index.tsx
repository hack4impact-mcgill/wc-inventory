import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import SearchFilters from "@/features/admin-dashboard/components/SearchFilters";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { supabase } from "@/lib/supabaseClient";
import { BoxItem, BoxView } from "@/types/box";
// Add import for barcode generation
import JsBarcode from 'jsbarcode';

// Define filter state interface
interface FilterState {
  searchTerm: string;
  category: string;
  size: string;
  gender: string;
}

const BoxLookup: React.FC = () => {
  const [selectedBoxIds, setSelectedBoxIds] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<FilterState>({
    searchTerm: "",
    category: "all",
    size: "all",
    gender: "all"
  });

  // Use React Query to fetch data
  const { data: boxes = [], isLoading, isError, error } = useQuery<BoxView[]>({
    queryKey: ['boxes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('box_view').select('*');

      if (error) {
        throw new Error(error.message);
      }

      return data as BoxView[];
    }
  });

  // Filter boxes based on search term and filters - memoized for performance
  const filteredBoxes = React.useMemo(() => {
    return boxes.filter(box => {
      // Filter by search term (box name)
      if (filters.searchTerm && !box.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // If box has no contents, only apply name filter
      if (!box.contents || box.contents.length === 0) {
        return true;
      }

      // Filter by contents
      if (filters.category !== 'all' || filters.size !== 'all' || filters.gender !== 'all') {
        return box.contents.some(item => {
          // Filter by category (item type)
          if (filters.category !== 'all') {
            const categoryMapping: Record<string, string> = {
              'tshirts': 'T-shirt',
              'pants': 'Pants'
            };
            if (item.type !== categoryMapping[filters.category]) {
              return false;
            }
          }

          // Filter by size
          if (filters.size !== 'all' && item.size !== filters.size.toUpperCase()) {
            return false;
          }

          // Filter by gender
          if (filters.gender !== 'all') {
            const genderMapping: Record<string, string> = {
              'male': 'Men',
              'female': 'Women',
              'kids': 'Kids',
              'unisex': 'Unisex'
            };
            if (item.gender !== genderMapping[filters.gender]) {
              return false;
            }
          }

          return true;
        });
      }

      return true;
    });
  }, [boxes, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle box selection logic
  const handleBoxSelect = (boxId: string) => {
    setSelectedBoxIds(prev => {
      const isSelected = prev.includes(boxId);
      return isSelected
        ? prev.filter(id => id !== boxId)
        : [...prev, boxId];
    });
  };

  const handleSelectAll = () => {
    setSelectedBoxIds(
      selectedBoxIds.length === filteredBoxes.length
        ? []
        : filteredBoxes.map(box => box.id)
    );
  };

  // Generate combined content view for multiple selected boxes
  const getSelectedBoxesContent = () => {
    if (selectedBoxIds.length === 0) return null;

    const selectedBoxes = boxes.filter(box => selectedBoxIds.includes(box.id));

    if (selectedBoxIds.length === 1) {
      // Single box view
      const box = selectedBoxes[0];
      return (
        <BoxDetails
          boxName={box.name}
          location={box.location || ""}
          createdAt={box.createdAt || ""}
          updatedAt={box.updatedAt || ""}
          contents={box.contents}
        />
      );
    } else {
      // Multiple boxes view - sum up contents
      const combinedContents: Record<string, BoxItem> = {};

      selectedBoxes.forEach(box => {
        box.contents?.forEach(item => {
          const key = `${item.type}-${item.gender}-${item.size}`;
          if (!combinedContents[key]) {
            combinedContents[key] = { ...item, quantity: 0 };
          }
          combinedContents[key].quantity += item.quantity;
        });
      });

      return (
        <BoxDetails
          boxName={`${selectedBoxes.length} boxes selected`}
          location=""
          createdAt=""
          updatedAt=""
          contents={Object.values(combinedContents)}
          isMultiSelect={true}
        />
      );
    }
  };

  // Function to handle printing box label with contents and barcode
  const handlePrintLabel = () => {
    if (selectedBoxIds.length === 0) return;
    
    const selectedBoxes = boxes.filter(box => selectedBoxIds.includes(box.id));
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print labels');
      return;
    }
    
    // Start building the HTML content for printing
    printWindow.document.write(`
      <html>
        <head>
          <title>Box Labels</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              margin: 0; 
              padding: 0;
            }
            .box-label { 
              border: 1px solid #e5e7eb; 
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              padding: 16px; 
              max-width: 480px; 
              margin: 20px auto;
              background-color: white; 
              page-break-after: always;
            }
            .box-header { 
              display: flex; 
              justify-content: space-between; 
              border-bottom: 1px solid #f3f4f6; 
              padding-bottom: 12px; 
              margin-bottom: 12px; 
            }
            .box-name { 
              font-size: 20px; 
              font-weight: 600; 
              color: #111827;
            }
            .location { 
              display: flex;
              align-items: center;
              color: #4b5563; 
              font-size: 14px;
            }
            .location-icon {
              margin-right: 4px;
              color: #6b7280;
            }
            .timestamp { 
              font-size: 12px; 
              color: #6b7280; 
              margin: 8px 0 16px;
              display: flex;
              gap: 12px;
            }
            .timestamp-item {
              display: flex;
              align-items: center;
            }
            .timestamp-icon {
              margin-right: 4px;
            }
            .contents {
              margin-top: 16px;
            }
            .contents-header {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 8px;
              color: #111827;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 14px;
            }
            th { 
              padding: 8px; 
              text-align: left; 
              color: #6b7280;
              font-weight: 500;
              border-bottom: 1px solid #e5e7eb; 
            }
            td { 
              padding: 8px; 
              text-align: left; 
              border-bottom: 1px solid #f3f4f6; 
            }
            .barcode-container { 
              text-align: center; 
              margin-top: 24px; 
              padding-top: 16px; 
              border-top: 1px solid #f3f4f6; 
            }
            .barcode-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 8px;
            }
            .icon {
              display: inline-block;
              width: 16px;
              height: 16px;
              vertical-align: -3px;
            }
            /* Last item should not have a page break after */
            .box-label:last-child {
              page-break-after: avoid;
            }
            @media print {
              @page {
                margin: 0;
                size: auto;
              }
              body { 
                margin: 0; 
                padding: 0; 
              }
              .box-label { 
                box-shadow: none; 
                border: 1px solid #e5e7eb;
                margin: 0 auto;
                width: 100%;
                max-width: 480px;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
    `);
    
    // For each selected box, create a label
    selectedBoxes.forEach((box, index) => {
      printWindow.document.write(`
        <div class="box-label">
          <div class="box-header">
            <div class="box-name">${box.name}</div>
            <div class="location">
              <span class="location-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              ${box.location || "No location"}
            </div>
          </div>
          <div class="timestamp">
            <div class="timestamp-item">
              <span class="timestamp-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              Created: ${new Date(box.createdAt || Date.now()).toLocaleDateString()}
            </div>
            ${box.updatedAt ? `
            <div class="timestamp-item">
              <span class="timestamp-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              Updated: ${new Date(box.updatedAt).toLocaleDateString()}
            </div>` : ''}
          </div>
          <div class="contents">
            <div class="contents-header">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Contents
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th>Gender</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
      `);
      
      // Add contents table rows
      if (box.contents && box.contents.length > 0) {
        box.contents.forEach(item => {
          printWindow.document.write(`
            <tr>
              <td>${item.type}</td>
              <td>${item.size}</td>
              <td>${item.gender}</td>
              <td>${item.quantity}</td>
            </tr>
          `);
        });
      } else {
        printWindow.document.write(`
          <tr>
            <td colspan="4" style="text-align: center;">No items</td>
          </tr>
        `);
      }
      
      printWindow.document.write(`
              </tbody>
            </table>
          </div>
          <div class="barcode-container">
            <div class="barcode-label">Box ID: ${box.id}</div>
            <svg id="barcode-${index}"></svg>
          </div>
        </div>
      `);
    });
    
    printWindow.document.write(`
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          // Generate barcodes once the page is loaded
          window.onload = function() {
    `);
    
    // Add JS to generate barcodes for each box
    selectedBoxes.forEach((box, index) => {
      printWindow.document.write(`
        try {
          JsBarcode("#barcode-${index}", "${box.id}", {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: false
          });
        } catch (e) {
          console.error("Error generating barcode for box ${box.id}:", e);
        }
      `);
    });
    
    printWindow.document.write(`
            // Ensure all content is loaded before printing
            // Use a longer timeout to make sure all barcodes render correctly
            setTimeout(function() {
              window.print();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Action buttons for selected boxes
  const actionButtons = (
    <div className="flex gap-4">
      <Button variant="outline" onClick={handlePrintLabel} disabled={selectedBoxIds.length === 0}>Print label</Button>
      <Button variant="outline">Move</Button>
      <Button variant="outline">Donate</Button>
    </div>
  );

  // Handle loading and error states
  if (isLoading) return <div className="p-6">Loading inventory data...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading inventory: {error?.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <SearchFilters
            onSearch={(value) => handleFilterChange('searchTerm', value)}
            onCategoryChange={(value) => handleFilterChange('category', value)}
            onSizeChange={(value) => handleFilterChange('size', value)}
            onGenderChange={(value) => handleFilterChange('gender', value)}
            actionButtons={actionButtons}
          />

          <Card className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBoxIds.length === filteredBoxes.length && filteredBoxes.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all boxes"
                    />
                  </TableHead>
                  <TableHead>Box name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoxes.length > 0 ? (
                  filteredBoxes.map((box) => (
                    <TableRow key={box.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleBoxSelect(box.id)}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBoxIds.includes(box.id)}
                          onCheckedChange={() => handleBoxSelect(box.id)}
                          aria-label={`Select box ${box.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {box.name}
                      </TableCell>
                      <TableCell>{box.location || "—"}</TableCell>
                      <TableCell>
                        Qty: {box.contents?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No boxes found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right panel for box details */}
        <div className="w-full md:w-96">
          {getSelectedBoxesContent()}
        </div>
      </div>
    </div>
  );
};

export default BoxLookup;
