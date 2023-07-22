import { OmitType } from '@nestjs/swagger';
import { AddReportDto } from './add-report.dto';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto extends OmitType(AddReportDto, ['price'] as const) {
  @Max(new Date().getUTCFullYear())
  @Min(1930)
  @IsNumber({ maxDecimalPlaces: 0 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  year: number;

  @Max(100000)
  @Min(0)
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  mileage: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  longitude: number;

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  latitude: number;
}
