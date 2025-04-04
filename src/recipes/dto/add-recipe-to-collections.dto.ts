import { IsNumber } from "class-validator";

export class AddRecipeToCollectionsDto {
  @IsNumber({}, { each: true })
  collectionIds: number[];
}
