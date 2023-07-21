import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';
import { Validate } from 'class-validator';
import { CustomEmailValidator } from '../../validators/custom-email.validator';

export class SignUpUserDto {
  @Validate(CustomEmailValidator)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(16)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  password: string;
}
