import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as YAML from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Novabook Tax Service')
    .setDescription('API documentation for the Novabook Tax Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const yamlString = YAML.stringify(document);
  fs.writeFileSync('./src/docs/openapi-spec.yaml', yamlString, 'utf8');

  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`Application is running at http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api`);
}
bootstrap();
