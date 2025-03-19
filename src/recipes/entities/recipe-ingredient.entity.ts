import { RecipeIngredient } from "@prisma/client";

export class RecipeIngredientEntity implements RecipeIngredient {
  constructor(partial: Partial<RecipeIngredientEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  order: number;
  name: string;
  recipeId: number;
  categoryId: number | null;
  quantity: string | null;
}
