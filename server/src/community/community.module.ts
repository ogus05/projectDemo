import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { ApplyCommunity } from 'src/entities/applyCommunity.entity';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Community, User, ApplyCommunity]),
        MulterModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              storage: diskStorage({
                  destination: configService.get("MULTER_DEST_COMMUNITY"),
                  filename: (req, file, cb) => {
                    cb(null, req.user.community.ID.toString());
                  }
              })
          }),
          inject: [ConfigService]
      }),
        UserModule
      ],
    controllers: [CommunityController],
    exports: [CommunityService],
    providers: [CommunityService],
})
export class CommunityModule {}
