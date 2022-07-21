import { BadRequestException, Body, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Connection, getConnection, getManager, Repository } from "typeorm";
import { PostUserDto, PutPasswordDto, PutUserDto } from "./dto/user.dto";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
import { ConfirmMail } from "src/entities/confirmMail.entity";
import * as crypto from "crypto";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ConfirmMail)
        private readonly confirmMailRepository: Repository<ConfirmMail>,
        private readonly configService: ConfigService,
        private readonly connection: Connection,
    ){}


    //여러 곳에서 사용하기 때문에 처리를 다양하게 하기 위해 user가 없을 때 exception을 넣지 않음.
    async validateUser(ID: string, password: string){
        const user = await this.userRepository.createQueryBuilder()
        .where(`ID = :keyID`, {keyID: ID})
        .andWhere(`password = :keyPassword`, {keyPassword: password})
        .getOne();
        return user;
    }


    async checkUserDuplicate(ID: string){
        return await this.userRepository.findOne({ID});
    }

    async getUserCommunityLeader(userNumber: number){
        try{
            const data = await this.userRepository.createQueryBuilder('user')
            .select(['user.number', 'community.ID', 'community.leaderNumber'])
            .leftJoin('user.community', 'community')
            .where('user.number = :keyUserNumber', {keyUserNumber: userNumber})
            .getOne();
            return data;
        } catch(e){
            console.log('getUserCommunity. ' + e);
            throw e;
        }
    }

    async getUserInfo(userNumber: number){
        try{
            const data = await this.userRepository.createQueryBuilder('user')
            .select(['user.nickname', 'user.communityID', 'user.message', 'user.regDate', 'community.name', 'user.role'])
            .leftJoin('user.community', 'community')
            .where(`user.number = :keyUserNumber`, {keyUserNumber: userNumber})
            .getOne();
            return data;
        } catch(e){
            console.log("getUserInfo." + e);
            throw e;
        }
    }

    async getUserCommunityInfo(userNumber: number){
        try{
            const data =await this.userRepository.createQueryBuilder('user')
            .select(['user.number', 'user.nickname', 'user.communityID'])
            .where('user.number = :keyUserNumber', {keyUserNumber: userNumber})
            .getOne();
            return data;
        } catch(e){
            console.log("getUserCommunityInfo. " + e);
            throw e;
        }
    }

    async getUserEdit(userNumber: number){
        try{
            const user = await this.userRepository.createQueryBuilder('user')
            .select([`user.message`, `user.role`, `user.nickname`, `user.number`])
            .where(`user.number = :keyUserNumber`, {keyUserNumber: userNumber})
            .getOne();
            return user;
        } catch(e){
            console.log("getUserEdit" + e);
            throw e;
        }
    }

    async getConfirmMail(token: string){
        const data = await this.confirmMailRepository.findOne({
            token,
        });
        return data;
    }
    
    async createUser(dto: PostUserDto){
        if(await this.checkUserDuplicate(dto.ID)){
            throw new BadRequestException("존재하는 아이디입니다.");
        }
        if((await this.userRepository.findOne({nickname: dto.nickname}))){
            throw new BadRequestException("존재하는 닉네임입니다.");
        }
        const user = this.userRepository.create(dto);
        await this.userRepository.save(user);
        return user;
    }


    async createConfirmMail(userID: string, type: number){
        const token = crypto.randomInt(1000000, 9999999).toString();
        const user = await this.userRepository.findOne({ID: userID});
        if(!user) throw new BadRequestException(["ID: 존재하지 않는 이메일입니다."]);
        await this.deleteConfirmMail(user.number);
        const confirmMail = this.confirmMailRepository.create({
            user,
            type,
            token
        });
        await this.confirmMailRepository.insert(confirmMail);
        return {user, token};
    }

    async updateUserRole(userNumber: number, role: number){
        await this.userRepository.update({number: userNumber}, {
            role,
        });
    }

    async updateUser(dto: PutUserDto){
        await this.userRepository.update({number: dto.number}, {
            message: dto.message,
        })
    }

    async updateUserPassword(dto: PutPasswordDto){
        try{
            //비밀번호 변경 메일 보낼 때,
            if(dto.newPassword === this.configService.get("EDIT_PASSWORD")){
                await this.userRepository.update({number: dto.number}, {
                    password: dto.newPassword,
                });
            }
            //비밀번호 patch사이트에서 비밀번호 변경 요청 보낼 때,
            else if(dto.currentPassword === this.configService.get("EDIT_PASSWORD")){
                const affected = (await this.userRepository.update({ID: dto.ID, number: dto.number, password: dto.currentPassword },{
                    password: dto.newPassword
                })).affected;
                if(affected === 0){
                    throw new BadRequestException("정보가 정확하지 않습니다.");
                }
            }
            //일반 put요청의 경우.
            else{
                const affected = (await this.userRepository.update({ID: dto.ID, number: dto.number, password: dto.currentPassword}, {
                    password: dto.newPassword
                })).affected;
                if(affected === 0){
                    throw new BadRequestException("정보가 정확하지 않습니다.");
                }
            }
        } catch(e){
            console.log("updateUserPassword:\n" + e);
            throw e;
        }
    }
    
    async deleteUser(number: number){
        const user = await this.getUserInfo(number);
        if(user.communityID !== 1){
            throw new BadRequestException("커뮤니티 탈퇴 후 계정 삭제가 가능합니다.");
        }
        await this.deleteImage(number);
        await this.userRepository.delete({number: number});
    }

    async deleteConfirmMail(userNumber: number){
        const user = await this.userRepository.findOne({number: userNumber});
        await this.confirmMailRepository.delete({
            user
        });
    }

    async deleteImage(number: number){
        const DBfileDir = this.configService.get("MULTER_DEST_USER") + number;
        if(fs.existsSync(DBfileDir)){
            fs.rm(DBfileDir, () => {});
        } else{
            console.log("파일이 존재하지 않아서 삭제가 불가능합니다. \n" + DBfileDir);
        }
    }
}