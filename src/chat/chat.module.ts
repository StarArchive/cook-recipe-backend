import { PrismaModule } from "@/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  imports: [PrismaModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
