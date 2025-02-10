import { ApiProperty } from "@nestjs/swagger";
import { RecipeStep } from "@prisma/client";

export class RecipeStepEntity implements RecipeStep {
  @ApiProperty()
  step: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  recipeId: number;
}
