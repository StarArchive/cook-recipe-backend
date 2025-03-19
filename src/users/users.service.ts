import { Injectable } from "@nestjs/common";
import bcrypt from "@node-rs/bcrypt";

import { env } from "@/config";
import { PrismaService } from "@/prisma/prisma.service";

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

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        env.USER_PASSWORD_HASH_ROUNDS,
      );
    }

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
}
