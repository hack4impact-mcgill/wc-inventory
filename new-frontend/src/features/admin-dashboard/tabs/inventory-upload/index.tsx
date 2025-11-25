import React, { useMemo, useState } from 'react';
import readInventory, { InventoryResponse } from './utils/read-inventory';
import { Card, CardContent } from "@/components/ui/card";
import { UploadTable } from '../inventory-upload/components/upload-table';
import { buildLocationTree, NestedLocation } from '../location-management/utils';
import { useSizes } from '../size-management/hooks/use-sizes';
import { useLocations } from '../location-management/hooks/use-locations';
import { useCategories } from '../category-management/hooks/use-categories';
import { useSaveBox } from '../../../add-box/hooks/useCreateBox';
import { boxApi } from '@/lib/api/boxes';

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

  const { createMutation: createSize } = useSizes();
  const { createMutation: createLocation } = useLocations();
  const { createMutation: createCategory } = useCategories();

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

    // upload the data
    inventoryData.contentTypes.sizes.forEach(async (size) => {
      await createSize.mutateAsync(size);
    });

    inventoryData.locations.forEach(async (location) => {
      await createLocation.mutateAsync(location);
    });

    inventoryData.contentTypes.types.forEach(async (type) => {
      await createCategory.mutateAsync({ name: type, level: 0 });
    });

    // create all the boxes in the database
    inventoryData.boxes.forEach(async (box) => {

      /*
      box_content_id: string;
    box_id: string;
    category_id: string;
    gender: "Male" | "Female" | "Unisex" | "Kids";
    quantity: number;
    size_id: string | null;
    */
      const items = Object.keys(box.contents).map(contentType => {
        const contentInfo = inventoryData.contentTypes.typeMap[contentType];
        return {
          box_content_id: "",
          box_id: box.id,
          category_id: contentInfo.type,
          gender: contentInfo.gender,
          size_id: contentInfo.size.size_id,
          quantity: box.contents[contentType]
        };
      });

      const saveBoxMutation = useSaveBox({
        items,
        boxCount: Number.parseInt(box.name.split(" ")[1]),
        location: { room: box.location, level: "", aisle: "", row: "" },
        onAddSuccess: () => {}
      });
      await saveBoxMutation.mutateAsync();
    });

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
                    {Object.keys(box.contents).map(contentType => <li>{inventory.contentTypes.typeMap[contentType].type} ({inventory.contentTypes.typeMap[contentType].size.name} {inventory.contentTypes.typeMap[contentType].size.gender} {inventory.contentTypes.typeMap[contentType].size.category}): {box.contents[contentType]} ({contentType})</li>)}
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