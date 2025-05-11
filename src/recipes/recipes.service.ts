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
          categories: {
            connect: createRecipeDto.categoryIds?.map((id) => ({
              id,
            })),
          },
        },
      });

      return createdRecipe;
    });
  }

  findAll(userId?: number, categoryId?: number) {
    return this.prisma.recipe.findMany({
      where: {
        published: true,
        ...(Number.isInteger(userId) ? { authorId: userId } : {}),
        ...(Number.isInteger(categoryId)
          ? {
              OR: [
                {
                  ingredients: {
                    some: {
                      categoryId,
                    },
                  },
                },
                {
                  categories: {
                    some: {
                      id: categoryId,
                    },
                  },
                },
              ],
            }
          : {}),
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
        author: {
          select: { id: true, name: true, roles: true, profile: true },
        },
        ingredients: {
          orderBy: {
            order: "asc",
          },
          omit: {
            id: true,
            order: true,
          },
        },
        published: true,
        steps: true,
        images: true,
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
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
          ...(updateRecipeDto.categoryIds && {
            categories: {
              set: updateRecipeDto.categoryIds.map((id) => ({
                id,
              })),
            },
          }),
        },
        include: {
          ingredients: true,
          steps: true,
          categories: true,
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

  async search(query: string) {
    return this.prisma.recipe.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        published: true,
      },
    });
  }

  async findDrafts(user: User) {
    return this.prisma.recipe.findMany({
      where: {
        authorId: user.id,
        published: false,
      },
    });
  }

  async addToCollections(
    user: User,
    recipeId: number,
    collectionIds: number[],
  ) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException("Recipe not found");
    }

    const collectionsByRecipeId = await this.prisma.collection.findMany({
      where: {
        recipes: {
          some: {
            recipeId,
          },
        },
        userId: user.id,
      },
      omit: {
        userId: true,
      },
    });

    const addedCollectionIds = collectionIds.filter(
      (collectionId) =>
        !collectionsByRecipeId.some(
          (collection) => collection.id === collectionId,
        ),
    );
    const deletedCollectionIds = collectionsByRecipeId.filter(
      (collection) => !collectionIds.includes(collection.id),
    );

    if (deletedCollectionIds.length > 0) {
      await this.prisma.collectionRecipe.deleteMany({
        where: {
          recipeId,
          collectionId: {
            in: deletedCollectionIds.map((collection) => collection.id),
          },
        },
      });
    }

    if (addedCollectionIds.length > 0) {
      for (const collectionId of addedCollectionIds) {
        const lastRecipe = await this.prisma.collectionRecipe.findFirst({
          where: {
            recipeId,
            collectionId,
          },
          orderBy: {
            order: "desc",
          },
        });

        await this.prisma.collectionRecipe.create({
          data: {
            recipeId,
            collectionId,
            order: lastRecipe ? lastRecipe.order + 1 : 1,
          },
        });
      }
    }

    return this.prisma.collection.findMany({
      where: {
        recipes: {
          some: {
            recipeId,
          },
        },
        userId: user.id,
      },
      omit: {
        userId: true,
      },
    });
  }
}
