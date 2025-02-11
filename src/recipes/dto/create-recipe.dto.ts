import { ApiProperty, OmitType } from "@nestjs/swagger";
import { RecipeIngredient } from "@prisma/client";

import { RecipeStepEntity } from "../entities/recipe-step.entity";

export class CreateRecipeStepDto extends OmitType(RecipeStepEntity, [
  "recipeId",
]) {}

export class CreateRecipeDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, default: false })
  published?: boolean = false;

  @ApiProperty()
  ingredients: RecipeIngredient[];

  @ApiProperty({ type: CreateRecipeStepDto, isArray: true })
  steps: CreateRecipeStepDto[];
}
