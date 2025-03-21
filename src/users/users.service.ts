import { Injectable, UnauthorizedException } from "@nestjs/common";
import bcrypt from "@node-rs/bcrypt";

import { env } from "@/config";
import { PrismaService } from "@/prisma/prisma.service";

import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findUserProfile(id: number) {
    return this.prisma.profile.findUnique({
      where: { userId: id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { profile, ...userData } = updateUserDto;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(profile && {
          profile: {
            upsert: {
              create: profile,
              update: profile,
            },
          },
        }),
      },
      omit: {
        password: true,
      },
      include: {
        profile: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(user: User, oldPassword: string, newPassword: string) {
    const { id } = user;

    if (!(await bcrypt.verify(oldPassword, user.password)))
      throw new UnauthorizedException("Old password is incorrect");

    return this.prisma.user.update({
      where: { id },
      data: {
        password: await bcrypt.hash(newPassword, env.USER_PASSWORD_HASH_ROUNDS),
      },
    });
  }

  async findUserStarred(userId: number, currentUser: User) {
    const showPrivate = currentUser.id === userId;

    const starredCollection = await this.prisma.collection.findFirst({
      where: {
        userId,
        isPublic: showPrivate ? undefined : true,
      },
    });

    if (!starredCollection) {
      return { recipes: [] };
    }

    const starredRecipes = await this.prisma.collectionRecipe.findMany({
      where: {
        collectionId: starredCollection.id,
      },
      include: {
        recipe: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return {
      collection: starredCollection,
      recipes: starredRecipes.map(
        (collectionRecipe) => collectionRecipe.recipe,
      ),
    };
  }
}
