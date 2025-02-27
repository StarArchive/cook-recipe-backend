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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from "@nestjs/swagger";
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
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    schema: {
      type: "object",
      properties: {
        fieldname: { type: "string", example: "file" },
        originalname: { type: "string", example: "recipe-cover.jpg" },
        encoding: { type: "string", example: "7bit" },
        mimetype: { type: "string", example: "image/jpeg" },
        destination: { type: "string", example: "uploads/" },
        filename: { type: "string", example: "1234567890-recipe-cover.jpg" },
        path: {
          type: "string",
          example: "/uploads/1234567890-recipe-cover.jpg",
        },
        size: { type: "number", example: 123456 },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file", { storage }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
