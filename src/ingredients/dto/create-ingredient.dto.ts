import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  name: string;
}
