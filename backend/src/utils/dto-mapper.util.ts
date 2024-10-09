import { plainToInstance, ClassConstructor } from 'class-transformer';

export function mapToDTO<T, V>(dto: ClassConstructor<T>, obj: V): T {
    return plainToInstance(dto, obj, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
    });
}

export function mapToDTOArray<T, V>(dto: ClassConstructor<T>, objArray: V[]): T[] {
    return objArray.map(obj => mapToDTO(dto, obj));
}