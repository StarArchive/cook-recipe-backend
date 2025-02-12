import { ApiProperty } from "@nestjs/swagger";
import { Recipe } from "@prisma/client";

import { RecipeIngredientEntity } from "./recipe-ingredient.entity";
import { RecipeStepEntity } from "./recipe-step.entity";

export class RecipeEntity implements Recipe {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  published: boolean = false;

  @ApiProperty()
  ingredients: RecipeIngredientEntity[];

  @ApiProperty()
  steps: RecipeStepEntity[];

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
