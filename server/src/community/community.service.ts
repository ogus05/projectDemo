import { BadRequestException, Get, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { Connection, QueryResult, Repository } from 'typeorm';
import { GetCommunityListDto, PostCommunityDto, PutCommunityDto } from './dto/community.dto';
import * as fs from "fs"
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommunityService {
    constructor(
        @InjectRepository(Community)
        private readonly communityRepository: Repository<Community>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly connection: Connection
    ){}


    async getCommunityByID(communityID: number){
        try{
            const res = await this.communityRepository.createQueryBuilder()
            .where(`ID = :communityID`, {communityID})
            .getOne();
            return res;
        } catch(e){
            console.log ("getCommunityByID. " + e);
            throw e;
        }
    }

    async getCommunityByName(communityName: string){
        try{
            const removeSpaceName = communityName.replace(' ', '');
            const community = await this.communityRepository.createQueryBuilder('community')
            .select('community.ID', 'ID')
            .where("REPLACE(community.name, ' ', '') = :communityName", {communityName: removeSpaceName})
            .getOne();
            return community;
        } catch(e){
            console.log("getCommunityByName. " + e);
            throw e;
        }
    }

    //TODO 궁금 첫번째
    async getCommunityList(dto: GetCommunityListDto){
        const communityList = await this.userRepository.createQueryBuilder('user')
        .select("COUNT(user.ID)", "userCount")
        .addSelect("communityID", "communityID")
        .where("communityID = :keyCommunityID", )
    }

    async createCommunity(dto: PostCommunityDto){
        if(await this.getCommunityByName(dto.name)){
            throw new BadRequestException("존재하는 커뮤니티 이름입니다.");
        }
        const user = await this.userService.getUserByID(dto.leaderID, false, false);
        if(!user){
            throw new BadRequestException("존재하지 않는 유저입니다.");
        }
        if(user.communityID !== 1) {
            throw new BadRequestException("가입한 커뮤니티가 존재합니다.");
        }
        
        const qr = this.connection.createQueryRunner();
        try{
            await qr.startTransaction();
            const community = this.communityRepository.create({
                isOpen: dto.isOpen, leaderID: dto.leaderID,
                message: dto.message, name: dto.name,
            });
            const insertedCommunity = await qr.manager.getRepository(Community).save(community);
            await qr.manager.getRepository(User).update(dto.leaderID,{
               community: insertedCommunity,
            });
            await qr.commitTransaction();
        } catch(e){
            console.log("createCommunity. " + e);
            await qr.rollbackTransaction();
            throw e;
        } finally{
            await qr.release();
        }
    }

    async updateCommunity(dto: PutCommunityDto){
        await this.communityRepository.update(dto.ID, {
            isOpen: dto.isOpen, message: dto.message
        });
    }

    async updateCommunityImage(communityID: number, filename: string){
        await this.deleteImage(communityID);
        await this.communityRepository.update(communityID, {
            image: filename,
        });
    }

    async updateCommunityLeader(communityID: number, leaderID: string){
        const user = await this.userService.getUserByID(leaderID, false, false);
        if(user){
            if(user.communityID !== communityID){
                throw new BadRequestException("다른 커뮤니티의 유저는 리더가 될 수 없습니다.");
            }
        } else{
            throw new BadRequestException("존재하지 않는 유저입니다.");
        }
        await this.communityRepository.update(communityID, {
            leaderID: leaderID
        });
    }

    async updateCommunityUser(userID: string, communityID: number = 1){
        if((await this.getCommunityByID(communityID)).leaderID === userID){
            throw new BadRequestException("리더는 커뮤니티를 탈퇴할 수 없습니다.");
        }
        await this.userRepository.update(userID, {
            communityID
        });
    }

    async deleteCommunity(communityID: number){
        const qr = this.connection.createQueryRunner();
        try{
            await qr.startTransaction();
            await this.deleteImage(communityID);
            await qr.manager.getRepository(User)
            .createQueryBuilder()
            .update(User)
            .set({communityID: 1})
            .where(`communityID = :keyCommunityID`, {keyCommunityID: communityID})
            .execute();

            await qr.manager.getRepository(Community).delete(communityID);

            await qr.commitTransaction();

        } catch(e){
            console.log("deleteCommunity: \n" + e);
            await qr.rollbackTransaction();
        } finally{
            await qr.release();
        }
    }

    async deleteImage(communityID: number){
        const DBfilename = (await this.communityRepository.createQueryBuilder('community')
        .select(['community.image'])
        .where('ID = :keyID', {keyID: communityID}).getOne()).image;
        if(DBfilename !== this.configService.get("COMMUNITY_IMAGE")){
            const DBfileDir = this.configService.get("MULTER_DEST") + DBfilename;
            if(fs.existsSync(DBfileDir)){
                fs.rm(DBfileDir, () => {});
            } else{
                console.log("파일이 존재하지 않아서 삭제가 불가능합니다. " + this.configService.get("MULTER_DEST") + DBfilename);
            }
        }
    }
}
