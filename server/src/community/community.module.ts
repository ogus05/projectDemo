import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Community, User])
      ],
      controllers: [CommunityController],
      providers: [CommunityService, UserService],
})
export class CommunityModule {}
