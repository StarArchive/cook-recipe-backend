import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "@node-rs/bcrypt";

import { env } from "@/config";
import { PrismaService } from "@/prisma/prisma.service";

import { AuthEntity } from "./entities/auth.entity";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthEntity> {
    const hashedPassword = await bcrypt.hash(
      password,
      env.USER_PASSWORD_HASH_ROUNDS,
    );

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
