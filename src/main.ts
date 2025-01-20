import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Novabook Tax Service')
    .setDescription('API documentation for the Novabook Tax Service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const docsDir = path.resolve(__dirname.includes('dist') ? path.join(__dirname, '../../src/docs') : path.join(__dirname, 'docs'));

  const yamlFilePath = path.join(docsDir, 'openapi-spec.yaml');
  fs.writeFileSync(yamlFilePath, YAML.stringify(document), 'utf8');

  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Application running at http://localhost:${PORT}`);
  console.log(`📘 API docs available at http://localhost:${PORT}/api`);
}

bootstrap();
