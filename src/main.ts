import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function createApp() {
  if (process.env.NODE_ENV === 'dev') {
    return await NestFactory.create(AppModule);
  }
  return await NestFactory.create(AppModule, {logger: false});
}

async function bootstrap() {
  const app = await createApp()
  
  await app.listen(3000);
}

bootstrap();
