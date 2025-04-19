import { env } from "@/config";
import { PrismaService } from "@/prisma/prisma.service";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { OpenAI } from "openai";
import { CreateChatDto } from "./dto/create-chat.dto";
import {
  MessageRole,
  RecipeChatMessageDto,
} from "./dto/recipe-chat-message.dto";

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaService) {
    if (!env.OPENAI_API_KEY) {
      this.logger.warn(
        "OPENAI_API_KEY is not set. LLM chat features will not work.",
      );
    }
    this.openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async chatAboutRecipe(createChatDto: CreateChatDto) {
    try {
      const { messages, recipeId } = createChatDto;

      const sanitizedMessages = messages.filter(
        (message) => message.role !== MessageRole.SYSTEM,
      );

      if (sanitizedMessages.length !== messages.length) {
        throw new BadRequestException(
          "System messages are not allowed in user input",
        );
      }

      const recipe = await this.getRecipeDetails(recipeId);
      const recipeContext = this.formatRecipeContext(recipe);

      const systemMessage: RecipeChatMessageDto = {
        role: MessageRole.SYSTEM,
        content: `您是一位专业的烹饪助手，能够提供有关食谱的信息。
                 请保持友好、简洁，专注于烹饪建议。
                 以下是您可以参考的食谱信息：\n${recipeContext}`,
      };

      const apiMessages = [systemMessage, ...sanitizedMessages].map(
        (message) => ({
          role: message.role,
          content: message.content,
        }),
      );

      const response = await this.openai.chat.completions.create({
        model: "deepseek-chat",
        messages: apiMessages,
        max_tokens: 500,
      });

      return {
        message:
          response.choices[0]?.message?.content ||
          "我目前无法生成回应，请稍后再试。",
      };
    } catch (error) {
      this.logger.error(`Error in chat service: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getRecipeDetails(recipeId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: {
          orderBy: { order: "asc" },
          select: {
            name: true,
            quantity: true,
          },
        },
        steps: {
          orderBy: { order: "asc" },
          select: {
            order: true,
            content: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }

    return recipe;
  }

  private formatRecipeContext(recipe: any): string {
    let context = `食谱: ${recipe.title}\n`;

    if (recipe.description) {
      context += `描述: ${recipe.description}\n\n`;
    }

    context += "原料:\n";
    recipe.ingredients.forEach((ingredient: any) => {
      context += `- ${ingredient.name}${ingredient.quantity ? ": " + ingredient.quantity : ""}\n`;
    });

    context += "\n步骤:\n";
    recipe.steps.forEach((step: any) => {
      context += `${step.order}. ${step.content}\n`;
    });

    return context;
  }
}
