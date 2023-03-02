import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './users/users.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = configure(await NestFactory.create(UsersModule));

  const config = new DocumentBuilder()
    .setTitle('User Management')
    .setDescription('Provides basic API for user management.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const appPort = configService.getOrThrow<number>('APPLICATION_PORT');
  await app.listen(appPort);
}
bootstrap();

export function configure(app: INestApplication): INestApplication {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  return app;
}
