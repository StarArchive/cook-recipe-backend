import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
