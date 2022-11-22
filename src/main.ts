import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Swagger Io
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Api para utilizar Nest JS y MySQL')
    .setDescription(
      'Este proyecto tiene como finalidad la prueba de las peticiones http',
    )
    .setVersion('1.0')
    .addTag('users')
    .addTag('posts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
