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

  @IsOptional()
  @IsString()
  nickname: string | null;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  profile?: CreateUserProfileDto;
}
