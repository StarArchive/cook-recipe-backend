import { RecipeStep } from "@prisma/client";

export class RecipeStepEntity implements RecipeStep {
  order: number;
  content: string;
  images: string[];
  recipeId: number;
}
