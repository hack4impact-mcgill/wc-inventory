export class LocationDTO {
  locationId: string;
  name: string;
  description?: string;
  level: number;
  parentId?: string;
}

export class LocationResponseDTO extends LocationDTO {
  parentLocation?: LocationDTO;
}
