import { Ingredient } from "@prisma/client";

export class IngredientEntity implements Ingredient {
  id: number;

  name: string;
}
