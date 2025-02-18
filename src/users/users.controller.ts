import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Role, User as UserStruct } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Roles } from "@/auth/roles.decorator";
import { RolesGuard } from "@/auth/roles.guard";
import { User } from "@/user.decorator";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async findMe(@User() user: UserStruct) {
    return new UserEntity(user);
  }

  @Patch("me")
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserStruct,
  ) {
    return new UserEntity(
      await this.usersService.update(user.id, updateUserDto),
    );
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Get(":id")
  async findOne(@Param("id") id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }
}
