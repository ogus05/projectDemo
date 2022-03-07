import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'reader',
        password: configService.get('DB_PASSWORD'),
        database: 'reader',
        entities: [join(__dirname, 'entities', '**')],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot(({
      isGlobal: true,
    })),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', "..", 'client', 'public')
    }),
    UserModule, AuthModule, ReviewModule, CommunityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
