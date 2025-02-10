import { ApiProperty } from "@nestjs/swagger";
import { RecipeIngredient } from "@prisma/client";

export class RecipeIngredientEntity implements RecipeIngredient {
  @ApiProperty()
  recipeId: number;

  @ApiProperty()
  ingredientId: string;

  @ApiProperty()
  quantity: string | null;
}
