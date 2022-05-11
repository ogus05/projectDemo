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

    async validateUserByNumber(number: number, password: string){
        const user = await this.userRepository.createQueryBuilder()
        .where("number = :keyNumber", {keyNumber: number})
        .andWhere("password = :keyPassword", {keyPassword: password})
        .getOne();
        return user;
    }

    async checkUserDuplicate(ID: string){
        return await this.userRepository.findOne(ID);
    }

    async getUserIDByNumber(number: number){
        const user = await this.userRepository.findOne({number});
        if(!user) return null;
        else return user.ID;
    }

    async getNumberByUserID(userID: string){
        const user = await this.userRepository.findOne({ID: userID});
        if(!user) return null;
        else return user.ID;
    }
    
    //3th param. 0. default, 1. info, 2. edit 
    async getUserByNumber(number: number, community: boolean, type: number = 0){
        try{
            let qb = this.userRepository.createQueryBuilder(`user`);
            switch(type){
                case 2: {
                    qb = qb.select(['user.ID', 'user.nickname', 'user.message', 'user.phone', 'user.birth',
                    'user.male', 'user.acceptMail', 'user.role']);
                    break;
                } case 1:{
                    qb = qb.select(['user.nickname', 'user.regDate', 'user.message',
                    'user.birth', 'user.male', 'user.image', 'user.communityID']);
                    break;
                } case 0:{
                    qb = qb.select(['user.number', 'user.nickname', 'user.communityID', 'user.role']);
                    break;
                }
            }
            if(community) qb = qb.leftJoinAndSelect('user.community', 'community');
            const user = await qb.where(`user.number = :keyNumber`, {keyNumber: number})
            .getOne();
            return user;
        } catch(e){
            console.log("getUserByNumber. " + e);
            throw e;
        }
    }

    async getUserByNickname(nickname: string, community: boolean, info: boolean){
        try{
            let qb = this.userRepository.createQueryBuilder(`user`)
            .select(['user.nickname', 'user.communityID']);
            if(community) qb = qb.leftJoinAndSelect('user.community', 'community');
            if(info) qb = qb.addSelect(['user.phone', 'user.image', 'user.message', 'user.regDate', 
            'user.birth', 'user.male', 'user.acceptMail']);
            const user = await qb.where(`user.nickname = :keyNickname`, {keyNickname: nickname})
            .getOne();
            return user;
        } catch(e){
            console.log("getUserByNickname. " + e);
            throw e;
        }
    }

    async createUser(dto: PostUserDto){
        if(await this.checkUserDuplicate(dto.ID)){
            throw new BadRequestException("존재하는 아이디입니다.");
        }
        if(await this.getUserByNickname(dto.nickname, false, false)){
            throw new BadRequestException("존재하는 닉네임입니다.");
        }
        const user = this.userRepository.create(dto);
        return (await this.userRepository.save(user));
    }

    async getConfirmMail(token: string){
        const data = await this.confirmMailRepository.findOne({
            token,
        });
        return data;
    }

    async createConfirmMail(userID: string, type: number){
        const token = crypto.randomInt(1000000, 9999999).toString();
        const user = await this.userRepository.findOne({ID: userID});
        if(!user) throw new BadRequestException("존재하지 않는 이메일입니다.");
        const confirmMail = this.confirmMailRepository.create({
            user,
            type,
            token
        });
        await this.confirmMailRepository.insert(confirmMail);
        return token;
    }

    async deleteConfirmMail(userID: string){
        const user = await this.userRepository.findOne({ID: userID});
        await this.confirmMailRepository.delete({
            user
        });
    }

    async setUserRole(userID: string, role: number){
        await this.userRepository.update({ID: userID}, {
            role,
        });
    }

    async updateUser(dto: PutUserDto){
        await this.userRepository.update({number: dto.number}, {
            nickname: dto.nickname,
            message: dto.message,
            acceptMail: dto.acceptMail,
        })
    }

    async updateUserImage(number: number, filename: string = this.configService.get("USER_IMAGE")){
        await this.deleteImage(number);
        await this.userRepository.update({number}, {
            image: filename
        });
    }

    async updateUserPassword(dto: PutPasswordDto){
        try{
            if(!(await this.validateUser(dto.ID, dto.currentPassword))
            && dto.newPassword !== this.configService.get("EDIT_PASSWORD")){
                throw new BadRequestException("현재 비밀번호가 정확하지 않습니다.");
            }
            if(dto.newPassword !== this.configService.get("EDIT_PASSWORD")
            && dto.currentPassword === dto.newPassword){
                throw new BadRequestException("현재 비밀번호와 이전 비밀번호가 같습니다.");
            }
            await this.userRepository.update({ID: dto.ID}, {
                password: dto.newPassword,
            });
        } catch(e){
            console.log("updateUserPassword:\n" + e);
            throw e;
        }
    }
    
    async deleteUser(number: number){
        const user = await this.getUserByNumber(number, true);
        if(user.communityID !== 1){
            throw new BadRequestException("커뮤니티 탈퇴 후 계정 삭제가 가능합니다.");
        }
        await this.deleteImage(number);
        await this.userRepository.delete({number: number});
    }

    async deleteImage(number: number){
        const DBfilename = (await this.userRepository.createQueryBuilder('user')
        .select(['user.image'])
        .where('number = :keyNumber', {keyNumber: number}).getOne()).image;
        if(DBfilename !== this.configService.get("USER_IMAGE")){
            const DBfileDir = this.configService.get("MULTER_DEST") + DBfilename;
            if(fs.existsSync(DBfileDir)){
                fs.rm(DBfileDir, () => {});
            } else{
                console.log("파일이 존재하지 않아서 삭제가 불가능합니다. " + this.configService.get("MULTER_DEST") + DBfilename);
            }
        }
    }
}