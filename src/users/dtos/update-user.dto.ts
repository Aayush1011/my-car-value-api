import {
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { Validate } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @MaxLength(16)
  @MinLength(5)
  @IsString()
  @IsOptional()
  password: string;
}
