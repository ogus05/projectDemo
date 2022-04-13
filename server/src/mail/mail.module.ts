import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          service: 'gmail',
          port: 587,
          secure: false,
          auth: {
            user: configService.get("MAIL_USER"),
            pass: configService.get("MAIL_PASSWORD")
          },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>'
      },
      template: {
        dir: join(__dirname, '..', '..', '..', 'client', 'public', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      },
    }),
    inject: [ConfigService]
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {
}
