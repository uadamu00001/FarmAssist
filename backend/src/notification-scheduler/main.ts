import { NestFactory } from '@nestjs/core';
import { NotificationSchedulerModule } from './notification-scheduler.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationSchedulerModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.NOTIFICATION_PORT ? Number(process.env.NOTIFICATION_PORT) : 4501;
  await app.listen(port);
  console.log(`Notification scheduler listening on ${port}`);
}

bootstrap();
