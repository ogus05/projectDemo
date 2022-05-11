import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyCommunity } from 'src/entities/applyCommunity.entity';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Community, User, ApplyCommunity]),
        UserModule
      ],
    controllers: [CommunityController],
    exports: [CommunityService],
    providers: [CommunityService],
})
export class CommunityModule {}
