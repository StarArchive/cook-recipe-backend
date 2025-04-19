import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { RecipeChatMessageDto } from "./recipe-chat-message.dto";

export class CreateChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeChatMessageDto)
  messages: RecipeChatMessageDto[];

  @IsNumber()
  @IsNotEmpty()
  recipeId: number;
}
