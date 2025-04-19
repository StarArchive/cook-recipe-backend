import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum MessageRole {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export class RecipeChatMessageDto {
  @IsEnum(MessageRole)
  role: MessageRole;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class RecipeChatResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
