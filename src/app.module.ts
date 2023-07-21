import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { randomBytes } from 'crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { typeOrmAsyncConfig } from './config/typeorm-config';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [randomBytes(8).toString('hex')],
        }),
      )
      .forRoutes('*');
  }
}
