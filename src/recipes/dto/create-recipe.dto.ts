import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateRecipeStepDto {
  @IsNumber()
  @ApiProperty()
  step: number;

  @IsString()
  @ApiProperty()
  content: string;
}

export class CreateRecipeIngredientDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  quantity: string | null;
}

export class CreateRecipeDto {
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
