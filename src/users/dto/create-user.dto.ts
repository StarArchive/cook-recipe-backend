import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  bio: string | null;

  @IsOptional()
  @IsString()
  avatar: string | null;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  profile?: CreateUserProfileDto;
}
