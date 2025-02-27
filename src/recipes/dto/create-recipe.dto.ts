import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateRecipeStepDto {
  @IsInt()
  order: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  images?: string[];
}

export class CreateRecipeIngredientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  quantity: string | null;
}

export class CreateRecipeImageDto {
  @IsNotEmpty()
  @IsString()
  url: string;
}

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  published: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeStepDto)
  steps: CreateRecipeStepDto[];

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  images?: string[];
}
