import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import { RedisStore } from 'connect-redis'
import { ValidationPipe } from '@nestjs/common'
import { ms, type StringValue } from './shared/utils/ms.util'
import { parseBoolean } from './shared/utils/parse-boolean.util'
import { RedisService } from './core/redis/redis.service'

import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'

function normalizeOrigin(origin: string) {
  try {
    return new URL(origin).origin
  } catch {
    return origin.replace(/\/$/, '')
  }
}

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, { rawBody: true })

  const config = app.get(ConfigService)
  const redis = app.get(RedisService)
  const isSessionSecure = parseBoolean(config.getOrThrow<string>('SESSION_SECURE'))

  if (isSessionSecure) {
    app.getHttpAdapter().getInstance().set('trust proxy', 1)
  }

  const allowedOrigins = config
    .getOrThrow<string>('ALLOWED_ORIGIN')
    .split(',')
    .map(origin => normalizeOrigin(origin.trim()))
    .filter(Boolean)

  const allowedOriginSet = new Set([
    ...allowedOrigins,
    'https://streamhosting.ru',
    'https://www.streamhosting.ru'
  ])

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOriginSet.has(normalizeOrigin(origin))) {
        callback(null, true)
        return
      }

      callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204
  })

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
  app.use(config.getOrThrow<string>('GRAPHQL_PREFIX'), graphqlUploadExpress())
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  const sessionDomain = config.get<string>('SESSION_DOMAIN')
  const cookieOptions: session.CookieOptions = {
    // Temporarily do not force a cookie domain for localhost-based development.
    ...(sessionDomain && sessionDomain !== 'localhost'
      ? { domain: sessionDomain }
      : {}),
    maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
    httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
    secure: isSessionSecure,
    sameSite: 'lax'
  }

  app.use(session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    proxy: isSessionSecure,
    cookie: cookieOptions,
    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow<string>('SESSION_FOLDER')
    })
  }))

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap();
