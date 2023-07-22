import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class AddReportDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  })
  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  model: string;

  @Max(new Date().getUTCFullYear())
  @Min(1930)
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  year: number;

  @Max(100000)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsLongitude()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsLatitude()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @Max(1000000)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
