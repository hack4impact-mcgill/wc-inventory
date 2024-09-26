import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Location } from "../entities/location.entity";
import { LocationResponseDTO } from "../dtos/location.dto";
import { plainToInstance } from "class-transformer";
import { validate as isValidUUID } from "uuid";
import { ValidateError } from "tsoa";
import { NotFoundError } from "../utils/errors.util";

export class LocationService {
  private locationRepository: Repository<Location>;

  constructor() {
    this.locationRepository = AppDataSource.getRepository(Location);
  }

  async getLocationById(id: string): Promise<LocationResponseDTO> {
    if (!isValidUUID(id)) {
      throw new ValidateError(
        {
          id: { message: "Invalid UUID", value: id }
        },
        "Invalid UUID format"
      );
    }
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundError("Location not found");
    }
    return this.mapToLocationResponseDTO(location);
  }

  mapToLocationResponseDTO(location: Location): LocationResponseDTO {
    return plainToInstance(LocationResponseDTO, location, {
      excludeExtraneousValues: true
    });
  }
}
