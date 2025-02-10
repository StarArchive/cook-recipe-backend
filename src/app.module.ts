import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RecipesModule } from "./recipes/recipes.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    PrismaModule,
    RecipesModule,
    IngredientsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
