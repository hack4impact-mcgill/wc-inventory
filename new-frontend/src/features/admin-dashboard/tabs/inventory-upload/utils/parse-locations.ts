import type { Location } from "@/types/location";

export default function parseLocations(locationStrings: string[]) {

  const locations = new Set<Location>();
  const processedLocationNames = new Set<string>();

  locations.add({
    name: "Main Warehouse",
    description: "Central storage facility",
    level: 0,
    location_id: "0",
    parent_id: null
  });

  // read through each location string
  for (const loc of locationStrings) {

    // skip empty locations
    if (!loc) continue;

    // skip if this location has already been processed
    if (processedLocationNames.has(loc)) continue;
    processedLocationNames.add(loc);

    // special case for A#{A,B}# locations
    if (loc.length == 4 && loc.startsWith("A")) {

      if (!processedLocationNames.has("Aisle " + loc.charAt(1))) {
        processedLocationNames.add("Aisle " + loc.charAt(1))
        locations.add({
          name: "Aisle " + loc.charAt(1),
          description: null,
          level: 1,
          location_id: "A" + loc.charAt(1),
          parent_id: "0"
        });
      }

      locations.add({
        name: "Shelf " + loc.charAt(2) + loc.charAt(3),
        description: null,
        level: 2,
        location_id: loc,
        parent_id: "A" + loc.charAt(1)
      });

    } else {
      locations.add({
        name: loc,
        description: null,
        level: null,
        location_id: "1",
        parent_id: null
      });
    }
  }

  return locations;

}