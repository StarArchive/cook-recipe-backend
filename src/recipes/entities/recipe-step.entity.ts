import { RecipeStep } from "@prisma/client";

export class RecipeStepEntity implements RecipeStep {
  step: number;
  content: string;
  recipeId: number;
}
