import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Public } from "@/auth/public.decorator";
import { User } from "@/user.decorator";
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
import { ApiBearerAuth } from "@nestjs/swagger";
import { User as UserStruct } from "@prisma/client";
import { CollectionsService } from "./collections.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("collections")
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(
    @Body() createCollectionDto: CreateCollectionDto,
    @User() user: UserStruct,
  ) {
    return this.collectionsService.create(createCollectionDto, user.id);
  }

  @Public()
  @Get()
  findAll(@Query("userId") userId?: number, @User() loggedUser?: UserStruct) {
    return this.collectionsService.findAll(userId, loggedUser?.id);
  }

  @Get("recipes/:recipeId")
  findAllByRecipeId(
    @Param("recipeId") recipeId: string,
    @User() user: UserStruct,
  ) {
    return this.collectionsService.findAllByRecipeId(+recipeId, user.id);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.collectionsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(+id, updateCollectionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.collectionsService.remove(+id);
  }
}
