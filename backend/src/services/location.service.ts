import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { Location } from "../entities/location.entity";
import { LocationResponseDTO } from "../dtos/location.dto";
import { plainToInstance } from "class-transformer";
import { CustomValidationError, NotFoundError } from "../utils/errors.util";

export class LocationService {
    private locationRepository: Repository<Location>;

    constructor() {
        this.locationRepository = AppDataSource.getRepository(Location);
    }

    async getLocationById(id: number): Promise<LocationResponseDTO> { // Changed to int
        if (isNaN(id)) {
            throw new CustomValidationError("Invalid ID format");
        }

        const location = await this.locationRepository.findOne({
            where: { location_id: id }, // Use location_id as the identifier (int)
            relations: ["parentLocation"],
        });

        if (!location) {
            throw new NotFoundError("Location not found");
        }

        return this.mapToLocationResponseDTO(location);
    }

    mapToLocationResponseDTO(location: Location): LocationResponseDTO {
        return plainToInstance(LocationResponseDTO, location, {
            excludeExtraneousValues: true,
        });
    }
}