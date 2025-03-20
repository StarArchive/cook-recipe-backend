import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
