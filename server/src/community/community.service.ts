import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { Connection, QueryResult, Repository } from 'typeorm';
import { PostCommunityDto } from './dto/community.dto';

@Injectable()
export class CommunityService {
    constructor(
        @InjectRepository(Community)
        private readonly communityRepository: Repository<Community>,
        private readonly connection: Connection
    ){}


    async getCommunityByID(communityID: number){
        try{
            const res = await this.communityRepository.createQueryBuilder()
            .where(`ID = :communityID`, {communityID})
            .getOne();
            if(!res) throw new Error("존재하지 않는 커뮤니티입니다.");
            else return res;
        } catch(e){
            console.log ("getCommunityByID. " + e);
            throw new Error(e);
        }
    }

    async getCommunityByName(communityName: string){
        try{
            const removeSpaceName = communityName.replace(' ', '');
            const res = await this.communityRepository.createQueryBuilder()
            .where("REPLACE(community.name, ' ', '') = :communityName", {communityName: removeSpaceName})
            .getOne();
            return res;
        } catch(e){
            console.log("getCommunityByName. " + e);
            throw e;
        }
    }

    async postCommunity(dto: PostCommunityDto){
        const qr = this.connection.createQueryRunner();
        try{
            await qr.startTransaction();
            const community = this.communityRepository.create({
                isOpen: dto.isOpen, leader: dto.leader, mark: dto.mark,
                message: dto.message, name: dto.name,
            });
            const insertedCommunity = await qr.manager.getRepository(Community).save(community);
            await qr.manager.getRepository(User).update(dto.leader.ID,{
               community: insertedCommunity,
            });
            await qr.commitTransaction();
        } catch(e){
            console.log("postCommunity. " + e);
            await qr.rollbackTransaction();
            throw e;
        } finally{
            await qr.release();
        }
    }
}
