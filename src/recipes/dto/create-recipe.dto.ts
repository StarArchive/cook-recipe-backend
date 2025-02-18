import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
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
  @ApiProperty()
  step: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
}

export class CreateRecipeIngredientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  quantity: string | null;
}

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  published: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  @ApiProperty()
  ingredients: CreateRecipeIngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeStepDto)
  @ApiProperty({ type: CreateRecipeStepDto, isArray: true })
  steps: CreateRecipeStepDto[];
}
