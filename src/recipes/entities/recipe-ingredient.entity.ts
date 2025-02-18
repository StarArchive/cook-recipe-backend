import { RecipeIngredient } from "@prisma/client";

export class RecipeIngredientEntity implements RecipeIngredient {
  recipeId: number;

  ingredientId: number;

  quantity: string | null;
}
