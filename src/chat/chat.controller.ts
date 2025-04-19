import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { RecipeChatResponseDto } from "./dto/recipe-chat-message.dto";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("recipe")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Chat with LLM about recipe information" })
  @ApiResponse({
    status: 200,
    description: "Returns the LLM response to the chat query",
    type: RecipeChatResponseDto,
  })
  chatAboutRecipe(
    @Body() createChatDto: CreateChatDto,
  ): Promise<RecipeChatResponseDto> {
    return this.chatService.chatAboutRecipe(createChatDto);
  }
}
