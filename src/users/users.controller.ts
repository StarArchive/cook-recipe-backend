import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { AuthRequest } from "@/types";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async profile(@Req() request: AuthRequest) {
    console.log(request.user);
    return request.user.id;
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param("id") id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }
}
