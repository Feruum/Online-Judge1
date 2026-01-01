import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log('🚀 Online Judge Backend running on: http://localhost:3000');
}

bootstrap();