import { Recipe } from "@prisma/client";

import { RecipeIngredientEntity } from "./recipe-ingredient.entity";
import { RecipeStepEntity } from "./recipe-step.entity";

export class RecipeEntity implements Recipe {
  id: number;
  title: string;
  description: string | null;
  published: boolean = false;
  ingredients: RecipeIngredientEntity[];
  steps: RecipeStepEntity[];
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}
