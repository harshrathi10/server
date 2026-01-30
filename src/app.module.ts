import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CaptchaModule } from './captcha/captcha.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CaptchaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
