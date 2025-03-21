import { IsInt } from "class-validator";

export class StarRecipeDto {
  @IsInt()
  recipeId: number;
}
