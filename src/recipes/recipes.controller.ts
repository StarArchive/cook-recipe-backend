import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { User as UserStruct } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { User } from "@/user.decorator";

import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { RecipesService } from "./recipes.service";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @User() user: UserStruct) {
    return this.recipesService.create(createRecipeDto, user);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recipesService.remove(+id);
  }
}
