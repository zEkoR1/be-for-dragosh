import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as process from "process";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes - SET THIS FIRST
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('Auto-generated Swagger docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
          persistAuthorization: true,
      },
  });

  const configService = app.get(ConfigService);

  // Enable cookie parser middleware
  app.use(cookieParser());
  app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
  });

  // Enable global validation and transformation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
