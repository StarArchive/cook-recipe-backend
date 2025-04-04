import { Injectable, NotFoundException } from "@nestjs/common";
import { CollectionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createCollectionDto: CreateCollectionDto, userId: number) {
    const { name, description, recipeIds = [], isPublic } = createCollectionDto;

    return this.prisma.collection.create({
      data: {
        name,
        description,
        type: CollectionType.MANUAL,
        user: {
          connect: { id: userId },
        },
        isPublic,
        recipes: {
          connect: recipeIds.map((id) => ({ id })),
        },
      },
      include: {
        recipes: true,
      },
    });
  }

  async findAllByRecipeId(recipeId: number, userId: number) {
    return this.prisma.collection.findMany({
      where: {
        recipes: {
          some: {
            recipeId,
          },
        },
        userId,
      },
      omit: {
        userId: true,
      },
    });
  }

  async findAll(userId?: number, loggedUserId?: number) {
    if (!userId && !loggedUserId) {
      throw new NotFoundException("No user ID provided");
    }
    const filterPrivate = userId && userId !== loggedUserId;

    return this.prisma.collection.findMany({
      where: {
        userId: userId || loggedUserId,
        isPublic: filterPrivate ? true : undefined,
      },
      omit: {
        userId: true,
      },
    });
  }

  async findOne(id: number) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        recipes: {
          orderBy: {
            order: "asc",
          },
          omit: {
            order: true,
            collectionId: true,
            recipeId: true,
          },
          include: {
            recipe: true,
          },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return {
      ...collection,
      recipes: collection.recipes.map(({ recipe }) => ({ ...recipe })),
    };
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    const { name, description, recipeIds } = updateCollectionDto;

    await this.findOne(id);

    const updateData: {
      name?: string;
      description?: string;
      recipes?: {
        disconnect?: { id: number }[];
        connect: {
          id: number;
        }[];
      };
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (recipeIds?.length) {
      const existingCollection = await this.prisma.collection.findUnique({
        where: { id },
        include: { recipes: true },
      });

      updateData.recipes = {
        disconnect: existingCollection?.recipes.map((recipe) => ({
          id: recipe.id,
        })),
        connect: recipeIds.map((recipeId) => ({ id: recipeId })),
      };
    }

    return this.prisma.collection.update({
      where: { id },
      data: updateData,
      include: {
        recipes: true,
        user: true,
      },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.collection.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }
      throw error;
    }
  }
}
