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


    async getCommunityInfo(communityID: number){
        try{
            const data = await this.communityRepository.createQueryBuilder('community')
            .select(['community.name', 'community.message', 'community.regDate', 'leader.nickname', 'leader.number'])
            .leftJoin('community.leader', 'leader')
            .where('communityID = :keyCommunityID', {keyCommunityID: communityID})
            .getOne();
            return data;
        } catch(e){
            console.log('getCommunityInfo. ' + e);
            throw e;
        }
    } 

    async getCommunityEdit(communityID: number){
        try{
            const data = await this.communityRepository.createQueryBuilder(`community`)
            .select(['community.name', 'community.message', 'community.isOpen', 'community.ID'])
            .where('ID = :keyCommunityID', {keyCommunityID: communityID})
            .getOne();
            return data;
        } catch(e){
            console.log("getCommunityEdit. " + e);
            throw e;
        }
    }

    async getCommunitySearchList(offset: number, limit: number){
        try{
            const communityList = await this.communityRepository.createQueryBuilder('community')
            .select(['community.ID', 'community.name', 'community.message'])
            .offset(offset)
            .limit(limit)
            .where('community.isOpen = 1')
            .getManyAndCount();
            return communityList;
        } catch(e){
            console.log("getCommunitySearchList. " + e);
            throw e;
        }
    }

    async getCommunityUserList(communityID: number){
        try{
            const userList = await this.userRepository.createQueryBuilder('user')
            .select(['user.nickname', 'user.number'])
            .where('user.communityID = :keyCommunityID', {keyCommunityID: communityID})
            .getManyAndCount();
            return userList;
        } catch(e){
            console.log("getCommunityUserList. " + e);
            throw e;
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

    async createCommunity(dto: PostCommunityDto){
        if((await this.communityRepository.findOne({name: dto.name}))){
            throw new BadRequestException("존재하는 커뮤니티 이름입니다.");
        }
        const user = await this.userService.getUserInfo(dto.leaderNumber);
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

    async createApplyCommunity(dto: ApplyCommunityDto){
        if((await this.userService.getUserCommunityInfo(dto.userNumber)).communityID !== 1){
            throw new BadRequestException("이미 커뮤니티에 가입했습니다.");
        }
        await this.applyCommunityRepository.delete({userNumber: dto.userNumber})
        await this.applyCommunityRepository.insert({
            communityID: dto.ID,
            userNumber: dto.userNumber,
        });
    }


    async updateCommunity(dto: PutCommunityDto){
        await this.communityRepository.update(dto.ID, {
            isOpen: dto.isOpen, message: dto.message
        });
    }

    async updateCommunityLeader(communityID: number, leaderNumber: number){
        const user = await this.userService.getUserCommunityInfo(leaderNumber);
        if(user && user.communityID !== communityID){
            throw new BadRequestException("다른 커뮤니티의 유저는 리더가 될 수 없습니다.");
        }
        await this.communityRepository.update(communityID, {
            leaderNumber
        });
    }

    async updateCommunityUser(userNumber: number, communityID: number = 1){
        if(communityID !== 1){
            const affected = (await this.applyCommunityRepository.delete({
                userNumber, communityID
            })).affected;
            if(affected === 0){
                throw new BadRequestException("가입하려는 유저의 요청이 필요합니다.");
            }
        }
        else{
            if((await this.getCommunityInfo(communityID)).leader.number === userNumber){
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
        const DBfileDir = this.configService.get("MULTER_DEST_COMMUNITY") + communityID;
        if(fs.existsSync(DBfileDir)){
            fs.rm(DBfileDir, () => {});
        } else{
            console.log("파일이 존재하지 않아서 삭제가 불가능합니다. " + DBfileDir);
        }
    }
}
