import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as express from 'express'
import { join } from 'path'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const options: CorsOptions = {
    origin: '*', // Permitir requisições de todos os origens
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    preflightContinue: false,
    optionsSuccessStatus: 200,
    allowedHeaders: '*', // Permitir todos os cabeçalhos
  }

  app.enableCors(options)

  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')))
  await app.listen(3131)
}
bootstrap()
