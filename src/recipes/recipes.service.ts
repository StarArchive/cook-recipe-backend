import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto, user: User) {
    const ingredientQuantities = new Map(
      createRecipeDto.ingredients.map((item) => [item.name, item.quantity]),
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.ingredient.createMany({
        data: createRecipeDto.ingredients.map((ingredient) => ({
          name: ingredient.name,
        })),
        skipDuplicates: true,
      });

      const ingredients = await tx.ingredient.findMany({
        where: {
          name: {
            in: createRecipeDto.ingredients.map(
              (ingredient) => ingredient.name,
            ),
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const createdRecipe = await tx.recipe.create({
        data: {
          title: createRecipeDto.title,
          description: createRecipeDto.description,
          published: createRecipeDto.published,
          ingredients: {
            createMany: {
              data: ingredients.map((ingredient) => ({
                ingredientId: ingredient.id,
                quantity: ingredientQuantities.get(ingredient.name),
              })),
            },
          },
          steps: {
            createMany: {
              data: createRecipeDto.steps,
            },
          },
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return createdRecipe;
    });
  }

  findAll() {
    return this.prisma.recipe.findMany({ where: { published: true } });
  }

  findOne(id: number) {
    return this.prisma.recipe.findUnique({ where: { id } });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.prisma.$transaction(async (tx) => {
      const ingredientQuantities = new Map(
        updateRecipeDto.ingredients?.map((item) => [item.name, item.quantity]),
      );

      if (updateRecipeDto.ingredients) {
        await tx.ingredient.createMany({
          data: updateRecipeDto.ingredients.map((ingredient) => ({
            name: ingredient.name,
          })),
          skipDuplicates: true,
        });

        const ingredients = await tx.ingredient.findMany({
          where: {
            name: {
              in: updateRecipeDto.ingredients.map(
                (ingredient) => ingredient.name,
              ),
            },
          },
          select: {
            id: true,
            name: true,
          },
        });

        await tx.recipeIngredient.deleteMany({
          where: {
            recipeId: id,
          },
        });

        await tx.recipeIngredient.createMany({
          data: ingredients.map((ingredient) => ({
            recipeId: id,
            ingredientId: ingredient.id,
            quantity: ingredientQuantities.get(ingredient.name),
          })),
        });
      }

      const updatedRecipe = await tx.recipe.update({
        where: { id },
        data: {
          title: updateRecipeDto.title,
          description: updateRecipeDto.description,
          published: updateRecipeDto.published,
          ...(updateRecipeDto.steps && {
            steps: {
              deleteMany: {},
              createMany: {
                data: updateRecipeDto.steps,
              },
            },
          }),
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          steps: true,
        },
      });

      return updatedRecipe;
    });
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
