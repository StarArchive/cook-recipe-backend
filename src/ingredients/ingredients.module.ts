import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";

import { IngredientsController } from "./ingredients.controller";
import { IngredientsService } from "./ingredients.service";

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [PrismaModule],
})
export class IngredientsModule {}
