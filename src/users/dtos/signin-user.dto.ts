import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(16)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  password: string;
}
