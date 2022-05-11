import { BadRequestException, Get, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { User } from 'src/entities/user.entity';
import { Connection, QueryResult, Repository } from 'typeorm';
import { ApplyCommunityDto, GetCommunityListDto, PostCommunityDto, PutCommunityDto } from './dto/community.dto';
import * as fs from "fs"
import { UserService } from 'src/user/user.service';
import { ApplyCommunity } from 'src/entities/applyCommunity.entity';

@Injectable()
export class CommunityService {
    constructor(
        @InjectRepository(Community)
        private readonly communityRepository: Repository<Community>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ApplyCommunity)
        private readonly applyCommunityRepository: Repository<ApplyCommunity>,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly connection: Connection
    ){}




    //0. default, 1. info, 2. edit
    async getCommunityByID(communityID: number, type: number){
        try{
            let qb = this.communityRepository.createQueryBuilder(`community`)
            switch(type){
                case 0:{
                    qb = qb.select(['leaderNumber']);
                    break;
                } case 1:{
                    qb = qb.select(['community.leaderNumber', 'community.image',
                    'community.message', 'community.regDate']);
                    break;
                } case 2:{
                    qb = qb.select(['community.name', 'community.isOpen', 
                    'community.message']);
                }
            }
            const community = await qb.where(`ID = :communityID`, {communityID})
            .getOne();
            return community;
        } catch(e){
            console.log ("getCommunityByID. " + e);
            throw e;
        }
    }

    async getCommunityIDByName(communityName: string){
        try{
            const removeSpaceName = communityName.replace(' ', '');
            const community = await this.communityRepository.createQueryBuilder('community')
            .select('community.ID', 'ID')
            .where("REPLACE(community.name, ' ', '') = :communityName", {communityName: removeSpaceName})
            .getOne();
            return community;
        } catch(e){
            console.log("getCommunityIDByName. " + e);
            throw e;
        }
    }


    async createCommunity(dto: PostCommunityDto){
        if(await this.getCommunityIDByName(dto.name)){
            throw new BadRequestException("존재하는 커뮤니티 이름입니다.");
        }
        const user = await this.userService.getUserByNumber(dto.leaderNumber, false);
        if(user.communityID !== 1) {
            throw new BadRequestException("가입한 커뮤니티가 존재합니다.");
        }
        
        const qr = this.connection.createQueryRunner();
        try{
            await qr.startTransaction();
            const community = this.communityRepository.create({
                isOpen: dto.isOpen, leaderNumber: dto.leaderNumber,
                message: dto.message, name: dto.name,
            });
            const insertedCommunity = await qr.manager.getRepository(Community).save(community);
            await qr.manager.getRepository(User).update(dto.leaderNumber,{
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
    
    async getCommunityApplyUserList(communityID: number){
        const users = await this.applyCommunityRepository.createQueryBuilder('apply')
        .leftJoin("apply.user", "user")
        .select(["user.number", "user.nickname", "apply.communityID"])
        .where('apply.communityID = :keyCommunityID', {keyCommunityID: communityID})
        .getMany();
        return users.map(user => user.user);
    }

    async applyCommunity(dto: ApplyCommunityDto){
        if((await this.userService.getUserByNumber(dto.number, false)).communityID !== 1){
            throw new BadRequestException("이미 커뮤니티에 가입했습니다.");
        }
        await this.deleteCommunityApply(dto.ID, dto.number);
        await this.applyCommunityRepository.insert({
            communityID: dto.ID,
            userNumber: dto.number,
        });
    }

    async deleteCommunityApply(communityID: number, number: number){
        const affected = (await this.applyCommunityRepository.delete({
            ID: communityID,
            userNumber: number,
        })).affected;
        if(affected === 0) throw new BadRequestException("해당 유저는 커뮤니티 가입을 요청하지 않았습니다.");
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

    async updateCommunityLeader(communityID: number, leaderNumber: number){
        const user = await this.userService.getUserByNumber(leaderNumber, false);
        if(user){
            if(user.communityID !== communityID){
                throw new BadRequestException("다른 커뮤니티의 유저는 리더가 될 수 없습니다.");
            }
        } else{
            throw new BadRequestException("존재하지 않는 유저입니다.");
        }
        await this.communityRepository.update(communityID, {
            leaderNumber
        });
    }

    async updateCommunityUser(userNumber: number, communityID: number = 1){
        if(communityID !== 1){
            const applyCommunity = await this.applyCommunityRepository.findOne({
                userNumber, communityID
            });
            if(!applyCommunity){
                throw new BadRequestException("가입하려는 유저의 요청이 필요합니다.");
            } else{
                await this.applyCommunityRepository.delete(applyCommunity);
            }
        }
        else{
            if((await this.getCommunityByID(communityID, 0)).leaderNumber === userNumber){
                throw new BadRequestException("리더는 커뮤니티를 탈퇴할 수 없습니다.");
            }
        }
        await this.userRepository.update({number: userNumber}, {
            communityID
        });
    }

    async deleteCommunity(communityID: number){
        const qr = this.connection.createQueryRunner();
        try{
            await this.deleteImage(communityID);
            await qr.startTransaction();
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
            throw new BadRequestException();
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
