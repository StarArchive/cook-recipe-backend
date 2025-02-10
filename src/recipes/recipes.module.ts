import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";

import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [PrismaModule],
})
export class RecipesModule {}
