import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { env } from "@/config";
import { PrismaModule } from "@/prisma/prisma.module";
import { UsersModule } from "@/users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN,
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
