import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { User as UserStruct } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Public } from "@/auth/public.decorator";
import { User } from "@/user.decorator";

import { AddRecipeToCollectionsDto } from "./dto/add-recipe-to-collections.dto";
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

  @Get("drafts")
  findDrafts(@User() user: UserStruct) {
    return this.recipesService.findDrafts(user);
  }

  @Public()
  @Get()
  @ApiQuery({ name: "userId", required: false, type: Number })
  @ApiQuery({ name: "categoryId", required: false, type: Number })
  findAll(
    @Query("userId") userId?: number,
    @Query("categoryId") categoryId?: number,
    @User() user?: UserStruct,
  ) {
    return this.recipesService.findAll(userId, categoryId, user);
  }

  @Public()
  @Get("search")
  @ApiQuery({ name: "query", required: true })
  search(@Query("query") query: string) {
    return this.recipesService.search(query);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.recipesService.findOne(id);
  }

  @Post(":id/addToCollections")
  addToCollection(
    @Param("id") recipeId: number,
    @Body() addRecipeToCollectionsDto: AddRecipeToCollectionsDto,
    @User() user: UserStruct,
  ) {
    return this.recipesService.addToCollections(
      user,
      recipeId,
      addRecipeToCollectionsDto.collectionIds,
    );
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.recipesService.remove(id);
  }
}
