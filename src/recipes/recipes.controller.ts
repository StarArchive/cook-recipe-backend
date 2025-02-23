import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth } from "@nestjs/swagger";
import { User as UserStruct } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Public } from "@/auth/public.decorator";
import { storage } from "@/storage.config";
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

  @Public()
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.recipesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.recipesService.remove(id);
  }

  @Post("cover/upload")
  @UseInterceptors(FileInterceptor("file", { storage }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
