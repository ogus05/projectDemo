import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { pbkdf2, pbkdf2Sync } from "crypto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ){}

    async validateUser(userID: string, password: string){
        const user = await this.userRepository.createQueryBuilder()
        .where(`ID= :userID`, {userID})
        .andWhere(`password= :userPassword`, {userPassword: password})
        .getOne();
        return user;
    }

    handleRefreshToken(){
        const issueToken = async user => {
            const payload = { userID: user.userID, sub: user.nickname};
            const refreshToken = this.jwtService.sign(payload, {expiresIn: this.config.get("REFRESH_EXPIRE")});
            pbkdf2(refreshToken, user.userID, 100, 64, 'sha512', async (err, key) => {
                if(err) {
                    throw err;
                }
                await this.userRepository.update({
                    ID: user.userID
                }, {
                    refreshJWT: key.toString('base64'),
                })
            });
            return refreshToken;
        }

        const deleteToken = async user => {
            await this.userRepository.update({
                ID: user.userID,
            }, {
                refreshJWT: null,
            });
        }

        //Refresh토큰 Validation시 DB와 쿠키에 있는 Refresh토큰 비교.
        //같으면 true 및 user값, 틀리면 false 반환.
        const compareToken = async (user, token) => {
            const tokenFromDB = await this.userRepository.createQueryBuilder()
            .where(`ID = :userID`, {userID: user.userID})
            .getOne();
            if(!tokenFromDB) return false;
            const refreshToken = tokenFromDB.refreshJWT;
            if(token === null){
                if(refreshToken === null) return true;
                else return false;
            } else{ 
                const encryptedToken = pbkdf2Sync(token, user.userID, 100, 64, 'sha512');
                if(encryptedToken.toString('base64') === refreshToken){
                    return true;
                } else{
                    return false;
                }
            }
        }
        return {issueToken, deleteToken, compareToken}
    }
    async issueAccessToken(user){
        const payload = { userID: user.userID, sub: user.nickname};
        return this.jwtService.sign(payload, {expiresIn: this.config.get("ACCESS_EXPIRE")});
    }
}