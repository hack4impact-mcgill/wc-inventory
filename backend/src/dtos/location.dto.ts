import { Expose } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class LocationResponseDTO {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;
}
