import { PrismaModule } from "@/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [PrismaModule],
})
export class CategoriesModule {}
