import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000).finally(() => {
    console.log(
      `Server runnign on port: ${process.env.PORT ?? 3000}. Happy coding 😝`,
    );
  });
}
bootstrap();
