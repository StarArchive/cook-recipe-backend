import { Injectable, NotFoundException } from "@nestjs/common";
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
      const categories = await tx.category.findMany({
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
              data: createRecipeDto.ingredients.map((ingredient, index) => ({
                name: ingredient.name,
                quantity: ingredientQuantities.get(ingredient.name),
                order: index + 1,
                categoryId: categories.find(
                  (category) => category.name === ingredient.name,
                )?.id,
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
          images: createRecipeDto.images,
        },
      });

      return createdRecipe;
    });
  }

  findAll(userId?: number) {
    return this.prisma.recipe.findMany({
      where: {
        published: true,
        ...(Number.isInteger(userId) ? { authorId: userId } : {}),
      },
    });
  }

  findOne(id: number) {
    return this.prisma.recipe.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, roles: true } },
        ingredients: {
          orderBy: {
            order: "asc",
          },
          omit: {
            id: true,
            order: true,
          },
        },
        steps: true,
        images: true,
      },
    });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return this.prisma.$transaction(async (tx) => {
      const ingredientQuantities = new Map(
        updateRecipeDto.ingredients?.map((item) => [item.name, item.quantity]),
      );

      const categories = updateRecipeDto.ingredients
        ? await tx.category.findMany({
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
          })
        : null;

      const updatedRecipe = await tx.recipe.update({
        where: { id },
        data: {
          title: updateRecipeDto.title,
          description: updateRecipeDto.description,
          published: updateRecipeDto.published,
          ...(updateRecipeDto.ingredients && {
            ingredients: {
              deleteMany: {},
              createMany: {
                data: updateRecipeDto.ingredients.map((ingredient, index) => ({
                  name: ingredient.name,
                  quantity: ingredientQuantities.get(ingredient.name),
                  order: index + 1,
                  categoryId: categories?.find(
                    (category) => category.name === ingredient.name,
                  )?.id,
                })),
              },
            },
          }),
          ...(updateRecipeDto.steps && {
            steps: {
              deleteMany: {},
              createMany: {
                data: updateRecipeDto.steps,
              },
            },
          }),
          images: updateRecipeDto.images,
        },
        include: {
          ingredients: true,
          steps: true,
        },
      });

      return updatedRecipe;
    });
  }

  remove(id: number) {
    return this.prisma.recipe.delete({
      where: { id },
    });
  }

  async toggleStarred(id: number, user: User) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException("Recipe not found");
    }

    let starredCollection = await this.prisma.collection.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!starredCollection) {
      starredCollection = await this.prisma.collection.create({
        data: {
          name: "默认收藏夹",
          description: "自动创建的默认收藏夹",
          isPublic: false,
          userId: user.id,
        },
      });
    }

    const existingCollectionRecipe =
      await this.prisma.collectionRecipe.findUnique({
        where: {
          collectionId_recipeId: {
            collectionId: starredCollection.id,
            recipeId: id,
          },
        },
      });

    if (existingCollectionRecipe) {
      return this.prisma.collectionRecipe.delete({
        where: {
          id: existingCollectionRecipe.id,
        },
      });
    }

    const highestOrder = await this.prisma.collectionRecipe.findFirst({
      where: {
        collectionId: starredCollection.id,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const nextOrder = highestOrder ? highestOrder.order + 1 : 1;

    return this.prisma.collectionRecipe.create({
      data: {
        collectionId: starredCollection.id,
        recipeId: id,
        order: nextOrder,
      },
    });
  }

  async findStarred(id: number, user: User) {
    const starredCollection = await this.prisma.collection.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!starredCollection) {
      return { starred: false };
    }

    const starredRecipe = await this.prisma.collectionRecipe.findUnique({
      where: {
        collectionId_recipeId: {
          collectionId: starredCollection.id,
          recipeId: id,
        },
      },
    });

    return { starred: !!starredRecipe };
  }
}
