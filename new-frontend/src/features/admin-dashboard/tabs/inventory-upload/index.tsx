import React, { useState } from 'react';
import readInventory, { InventoryResponse } from './read-inventory';
import { Card, CardContent } from "@/components/ui/card";
import { LocationTable } from "../location-management/components/location-table";
import { SizeTable } from "../size-management/components/size-table";

const InventoryUploadTab: React.FC = () => {

  // state to hold the box data
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    
    // check if there was a file
    const file = event.target.files?.[0];
    if (!file) return;

    // read the file as an array buffer
    const arrayBuffer = await file.arrayBuffer();

    // parse the inventory data
    const inventoryData = readInventory(arrayBuffer);

    setInventory(inventoryData);

    console.log('Parsed data:', inventoryData);

  }


  return (
    <div>
      <label id="upload-label">Upload your .xlsx file here:
        <input type="file" accept=".xlsx" onInput={handleFileUpload} />
      </label>

      {/* list all the boxes */}
      {inventory ? (
        <div>
          <Card>
            <CardContent>
              <h1>Locations</h1>
              <LocationTable
                locations={Array.from(inventory.locations)}
                onEdit={() => {}} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h1>Sizes</h1>
              <SizeTable sizes={Array.from(inventory.contentTypes.sizes)}
                onEdit={() => {}} />
            </CardContent>
          </Card>

          <h1>Box Contents</h1>
          <div className="box-list">
            
            {inventory.boxes.map((box) => {
              return (
                <div>
                  <p>Box {box.id} [{box.location}]</p>
                  <ul>
                    {Object.keys(box.contents).map(contentType => <li>{contentType}: {box.contents[contentType]}</li>)}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      ) : "No inventory uploaded yet."}
    </div>
  );

}

export default InventoryUploadTab;