import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Community } from "src/entities/community.entity";
import { User } from "src/entities/user.entity";
import { Connection, getConnection, getManager, Repository } from "typeorm";
import { PostUserDto, UpdateUserDto } from "./dto/user.dto";
import * as fs from "fs";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly connection: Connection,
    ){}


    async validateUser(userID: string, password: string){
        const user = await this.userRepository.createQueryBuilder()
        .where(`ID= :userID`, {userID})
        .andWhere(`password= :userPassword`, {userPassword: password})
        .getOne();
        return user;
    }
    
    async getUserByID(userID: string, community: boolean, profile: boolean){
        try{
            let qb = this.userRepository.createQueryBuilder(`user`)
            .select(['user.nickname', 'user.regDate', 'user.profileID', 'user.communityID']);
            if(profile) qb = qb.leftJoinAndSelect('user.profile', 'profile');
            if(community) qb = qb.leftJoinAndSelect('user.community', 'community');
            const user = await qb.where(`user.ID = :keyID`, {keyID: userID})
            .getOne();
            return user;
        } catch(e){
            console.log("getUserByID. " + e);
            throw e;
        }
    }

    async createUser(dto: PostUserDto){
        const user = this.userRepository.create(dto);
        await this.userRepository.save(user);
    }

    async updateUser(dto: UpdateUserDto){
        await this.userRepository.update(dto.ID, {
            nickname: dto.nickname,
            email: dto.email,
            phone: dto.phone,
            message: dto.message,
        });
    }

    async updateUserImage(userID: string, filename: string){
        if(filename !== "default.jpg"){
            const user = this.userRepository.createQueryBuilder('user')
            .select('user.photo')
            .where('ID = :keyID', {keyID: userID}).getOne();
            if(fs.readFileSync(this.configService.get("MULTER_DEST")))
            //파일은 이미 올라간 상태. userID를 이용해서 파일을 불러올 때 오류가 발생하면 올라간 파일 처리를 어떻게하지
            // -> 올라간 파일을 여기서 filename을 이용해서 지우는 것도 괜찮을 것 같다.
        }

        await this.userRepository.update(userID, {
            photo: filename
        });
    }
    
}