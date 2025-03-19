import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { storage } from "@/storage.config";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("upload")
export class UploadController {
  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    schema: {
      type: "object",
      properties: {
        fieldname: { type: "string", example: "file" },
        originalname: { type: "string", example: "recipe-cover.jpg" },
        encoding: { type: "string", example: "7bit" },
        mimetype: { type: "string", example: "image/jpeg" },
        destination: { type: "string", example: "uploads/" },
        filename: { type: "string", example: "1234567890-recipe-cover.jpg" },
        path: {
          type: "string",
          example: "/uploads/1234567890-recipe-cover.jpg",
        },
        size: { type: "number", example: 123456 },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file", { storage }))
  upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }
}
