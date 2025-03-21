import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const { name, description, userId, recipeIds = [] } = createCollectionDto;

    return this.prisma.collection.create({
      data: {
        name,
        description,
        user: {
          connect: { id: userId },
        },
        recipes: {
          connect: recipeIds.map((id) => ({ id })),
        },
      },
      include: {
        recipes: true,
      },
    });
  }

  async findAll(userId?: number) {
    return this.prisma.collection.findMany({
      where: Number.isInteger(userId) ? { userId } : undefined,
      include: {
        recipes: true,
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        recipes: true,
        user: true,
      },
    });

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return collection;
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
