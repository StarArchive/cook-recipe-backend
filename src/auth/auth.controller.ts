import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthEntity } from "./entities/auth.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post("register")
  @ApiOkResponse({ type: AuthEntity })
  register(@Body() { email, password, name }: RegisterDto) {
    return this.authService.register(email, password, name);
  }
}
