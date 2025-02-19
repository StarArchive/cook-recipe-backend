import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  if (process.env.NODE_ENV === "development") {
    const config = new DocumentBuilder()
      .setTitle("Cook recipe backend")
      .setDescription("Cook recipe backend API portal")
      .setVersion("v1")
      .addBearerAuth()
      .build();

    const documentFactory = () => {
      const document = SwaggerModule.createDocument(app, config);

      for (const path of Object.values(document.paths)) {
        for (const method of Object.values(path)) {
          if (
            Array.isArray(method.security) &&
            method.security.includes("public")
          ) {
            method.security = [];
          }
        }
      }

      return document;
    };
    SwaggerModule.setup("api", app, documentFactory);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: process.env.NODE_ENV === "development",
    }),
  );

  app.enableCors();
  await app.listen(port);
}
bootstrap();
