import React, { useMemo, useState } from 'react';
import readInventory, { InventoryResponse } from './utils/read-inventory';
import { Card, CardContent } from "@/components/ui/card";
import { UploadTable } from '../inventory-upload/components/upload-table';
import { buildLocationTree, NestedLocation } from '../location-management/utils';

const sizeTableColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Region', accessor: 'region' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Numerical', accessor: 'is_numerical' },
    { header: 'Value', accessor: 'numerical_value' },
    { header: 'Last Updated', accessor: 'updated_at' },
];

const locationTableColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Level', accessor: 'level' },
    { header: 'Parent Location', accessor: 'parent_location' }
];

const InventoryUploadTab: React.FC = () => {

  // state to hold the box data
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);

  // handle nesting the location data for the table
  const nestedLocation: NestedLocation[] = useMemo(
    () => inventory ? Array.from(inventory.locations) : [],
    [inventory]
  );

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
        <>

        <p>Read through the locations and sizes being added, and make sure all the data is set correctly. 
          Some locations or sizes might be duplicated because of typos, you can merge them by clicking <code>⋯ &gt; Merge with...</code></p>

        {/* list all the new sizes, locations, boxes defined in the xlsx file */}
        <div>
          <Card>
            <CardContent>
              <h1>Locations</h1>
              <UploadTable data={nestedLocation}
                columns={locationTableColumns}
                onEdit={() => {}}
                onDelete={() => {}}
                nested={true} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h1>Sizes</h1>
              <UploadTable data={Array.from(inventory.contentTypes.sizes)}
                columns={sizeTableColumns}
                onEdit={() => {}}
                onDelete={() => {}}
                nested={false} />
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
        </>
      ) : "No inventory uploaded yet."}
    </div>
  );

}

export default InventoryUploadTab;