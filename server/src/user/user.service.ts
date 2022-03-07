import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Community } from "src/entities/community.entity";
import { Profile } from "src/entities/profile.entity";
import { User } from "src/entities/user.entity";
import { Connection, getConnection, getManager, Repository } from "typeorm";
import { PostUserDto } from "./dto/user.dto";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        private readonly connection: Connection,
    ){}


    async getUserByID(userID: string){
        try{
            const user = await this.userRepository.createQueryBuilder(`user`)
            .where(`user.ID = :userID`, {userID})
            .getOne();
            return user;
        } catch(e){
            console.log("getUserByID. " + e);
            throw e;
        }
    }

    async createUser(dto: PostUserDto){
        const qr = this.connection.createQueryRunner();
        const userRepo = qr.manager.getRepository(User);
        const profileRepo = qr.manager.getRepository(Profile);
        try{
            await qr.startTransaction();
            
            const profile = profileRepo.create({
                acceptMail: dto.acceptMail, email: dto.email, phone: dto.phone
            })
            await profileRepo.save(profile);
            
            const user = userRepo.create({
                ID: dto.ID, password: dto.password, nickname: dto.nickname, communityID: 1, profile: profile
            });
            await userRepo.save(user);
            await qr.commitTransaction();
            return true;
        } catch(e){
            await qr.rollbackTransaction();
            throw e;
        } finally{
            await qr.release();
        }
    }
    
}