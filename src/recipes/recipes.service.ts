import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  create(createRecipeDto: CreateRecipeDto) {
    // return this.prisma.recipe.create({ data: createRecipeDto });
  }

  findAll() {
    return this.prisma.recipe.findMany({ where: { published: true } });
  }

  findOne(id: number) {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    // return this.prisma.recipe.update({
    //   where: { id },
    //   data: updateRecipeDto,
    // });
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
