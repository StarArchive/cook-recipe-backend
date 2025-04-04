import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Role, User as UserStruct } from "@prisma/client";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Roles } from "@/auth/roles.decorator";
import { RolesGuard } from "@/auth/roles.guard";
import { User } from "@/user.decorator";

import { Public } from "@/auth/public.decorator";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
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

  @Post("me/changePassword")
  async updatePassword(
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
    @User() user: UserStruct,
  ) {
    return new UserEntity(
      await this.usersService.updatePassword(
        user,
        changeUserPasswordDto.oldPassword,
        changeUserPasswordDto.newPassword,
      ),
    );
  }

  @Public()
  @Get(":id")
  async findOne(@Param("id") id: number) {
    const found = await this.usersService.findOne(id);
    if (!found) throw new NotFoundException("User not found");

    return new UserEntity(found);
  }

  @Public()
  @Get(":id/profile")
  async findUserProfile(@Param("id") id: number) {
    return this.usersService.findUserProfile(id);
  }

  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
