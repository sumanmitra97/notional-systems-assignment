import {
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @Length(5, 255)
  @IsAscii()
  password: string;

  @IsNotEmpty()
  @IsAscii()
  @Length(2, 50)
  name: string;
}
