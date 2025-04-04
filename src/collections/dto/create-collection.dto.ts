import { CollectionType } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateCollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isPublic: boolean = false;

  @IsString()
  type: CollectionType = CollectionType.MANUAL;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recipeIds?: number[];
}
