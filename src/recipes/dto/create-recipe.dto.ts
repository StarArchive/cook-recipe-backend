import { ApiProperty, OmitType } from "@nestjs/swagger";
import { RecipeIngredient, RecipeStep } from "@prisma/client";

import { RecipeStepEntity } from "../entities/recipe-step.entity";

export class CreateRecipeDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: false })
  published?: boolean = false;

  @ApiProperty()
  ingredients: RecipeIngredient[];

  @ApiProperty({ type: [OmitType(RecipeStepEntity, ["recipeId"])] })
  steps: Omit<RecipeStep, "recipeId">[];
}
