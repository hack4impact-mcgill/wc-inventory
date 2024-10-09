// location.seeder.ts
import { AppDataSource } from "../database";
import { Location } from "../../entities/location.entity";

export async function seedLocations() {
    const locationRepository = AppDataSource.getRepository(Location);

    // Create root locations
    const rootLocation1 = locationRepository.create({
        name: "Warehouse A",
        description: "Main warehouse for electronics",
    });

    const rootLocation2 = locationRepository.create({
        name: "Warehouse B",
        description: "Main warehouse for furniture",
    });

    // Save root locations to the database
    await locationRepository.save(rootLocation1);
    await locationRepository.save(rootLocation2);

    // Create sub-locations for rootLocation1
    const subLocation1 = locationRepository.create({
        name: "Warehouse A - Section 1",
        description: "Section 1 of Warehouse A",
        parentLocation: rootLocation1,
    });

    const subLocation2 = locationRepository.create({
        name: "Warehouse A - Section 2",
        description: "Section 2 of Warehouse A",
        parentLocation: rootLocation1,
    });

    // Create sub-locations for rootLocation2
    const subLocation3 = locationRepository.create({
        name: "Warehouse B - Section 1",
        description: "Section 1 of Warehouse B",
        parentLocation: rootLocation2,
    });

    const subLocation4 = locationRepository.create({
        name: "Warehouse B - Section 2",
        description: "Section 2 of Warehouse B",
        parentLocation: rootLocation2,
    });

    // Save all sub-locations to the database
    await locationRepository.save(subLocation1);
    await locationRepository.save(subLocation2);
    await locationRepository.save(subLocation3);
    await locationRepository.save(subLocation4);
}