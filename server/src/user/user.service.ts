import { BadRequestException, Body, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Connection, getConnection, getManager, Repository } from "typeorm";
import { PostUserDto, PutPasswordDto, PutUserDto } from "./dto/user.dto";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
import { ConfirmMail } from "src/entities/confirmMail";
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
    async validateUser(userID: string, password: string){
        const user = await this.userRepository.createQueryBuilder()
        .where(`ID= :userID`, {userID})
        .andWhere(`password= :userPassword`, {userPassword: password})
        .getOne();
        return user;
    }
    
    async getUserByID(userID: string, community: boolean, info: boolean){
        try{
            let qb = this.userRepository.createQueryBuilder(`user`)
            .select(['user.nickname', 'user.communityID', 'user.role']);
            if(community) qb = qb.leftJoinAndSelect('user.community', 'community');
            if(info) qb = qb.addSelect(['user.phone', 'user.image', 'user.message', 'user.regDate', 
            'user.birth', 'user.male', 'user.acceptMail']);
            const user = await qb.where(`user.ID = :keyID`, {keyID: userID})
            .getOne();
            return user;
        } catch(e){
            console.log("getUserByID. " + e);
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
        if(await this.getUserByID(dto.ID, false, false)){
            throw new BadRequestException("존재하는 아이디입니다.");
        }
        if(await this.getUserByNickname(dto.nickname, false, false)){
            throw new BadRequestException("존재하는 닉네임입니다.");
        }
        const user = this.userRepository.create(dto);
        await this.userRepository.save(user);
    }

    async getConfirmMail(token: string){
        const data = await this.confirmMailRepository.findOne({
            token,
        });
        if(!data){
            throw new NotFoundException("잘못된 요청입니다.");
        } else{
            return data;
        }
    }

    async createConfirmMail(userID: string, type: number){
        const token = crypto.randomInt(1000000, 9999999).toString();
        const confirmMail = this.confirmMailRepository.create({
            userID,
            type,
            token
        });
        await this.confirmMailRepository.insert(confirmMail);
        return token;
    }

    async deleteConfirmMail(token: string){
        await this.confirmMailRepository.delete({
            token,
        });
    }

    async setUserRole(userID: string, role: number){
        await this.userRepository.update(userID, {
            role,
        });
    }

    async updateUser(dto: PutUserDto){
        await this.userRepository.update(dto.ID, {
            nickname: dto.nickname,
            message: dto.message,
            acceptMail: dto.acceptMail,
        });
    }

    async updateUserImage(userID: string, filename: string = this.configService.get("USER_IMAGE")){
        await this.deleteImage(userID);
        await this.userRepository.update(userID, {
            image: filename
        });
    }

    async updateUserPassword(dto: PutPasswordDto){
        if(!(await this.validateUser(dto.ID, dto.currentPassword))
        && !(await this.validateUser(dto.ID, this.configService.get("EDIT_PASSWORD")))
        && dto.newPassword !== this.configService.get("EDIT_PASSWORD")){
            throw new BadRequestException("비밀번호가 정확하지 않습니다.");
        }
        await this.userRepository.update(dto.ID, {
            password: dto.newPassword,
        });
    }
    
    async deleteUser(userID: string){
        const user = await this.getUserByID(userID, true, false);
        if(user.communityID !== 1){
            throw new BadRequestException("커뮤니티 탈퇴 후 계정 삭제가 가능합니다.");
        }
        await this.deleteImage(userID);
        await this.userRepository.delete(userID);
    }

    async deleteImage(userID: string){
        const DBfilename = (await this.userRepository.createQueryBuilder('user')
        .select(['user.image'])
        .where('ID = :keyID', {keyID: userID}).getOne()).image;
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