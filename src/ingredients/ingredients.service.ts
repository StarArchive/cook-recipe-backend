import { Injectable } from "@nestjs/common";
import { Ingredient } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return this.prisma.ingredient.upsert({
      update: createIngredientDto,
      create: createIngredientDto,
      where: createIngredientDto,
    });
  }

  async createMany(
    createIngredientDto: CreateIngredientDto[],
  ): Promise<Ingredient[]> {
    return this.prisma.$transaction(async (tx) => {
      await tx.ingredient.createMany({
        data: createIngredientDto,
        skipDuplicates: true,
      });

      const createdIngredients = await tx.ingredient.findMany({
        where: {
          OR: createIngredientDto.map((dto) => ({
            ...dto,
          })),
        },
      });

      return createdIngredients;
    });
  }

  async findAll() {
    return this.prisma.ingredient.findMany();
  }

  async findOne(id: number) {
    return this.prisma.ingredient.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return this.prisma.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });
  }

  async remove(id: number) {
    return this.prisma.ingredient.delete({
      where: { id },
    });
  }
}
