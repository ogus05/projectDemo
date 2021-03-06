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

    handleRefreshToken(){
        const issueToken = async user => {
            const payload = { number: user.number, sub: user.nickname};
            const refreshToken = this.jwtService.sign(payload, {expiresIn: this.config.get("REFRESH_EXPIRE")});
            pbkdf2(refreshToken, String(user.number), 100, 64, 'sha512', async (err, key) => {
                if(err) {
                    throw err;
                }
                await this.userRepository.update({
                    number: user.number
                }, {
                    refreshJWT: key.toString('base64'),
                })
            });
            return refreshToken;
        }

        const deleteToken = async user => {
            await this.userRepository.update({
                number: user.number,
            }, {
                refreshJWT: null,
            });
        }

        //Refresh토큰 Validation시 DB와 쿠키에 있는 Refresh토큰 비교.
        //같으면 true 및 user값, 틀리면 false 반환.
        const compareToken = async (user, token) => {
            const tokenFromDB = await this.userRepository.createQueryBuilder('user')
            .select('user.refreshJWT')
            .where(`number = :keyNumber`, {keyNumber: user.number})
            .getOne();
            if(!tokenFromDB) return false;
            const refreshToken = tokenFromDB.refreshJWT;
            if(token === null){
                if(refreshToken === null) return true;
                else return false;
            } else{ 
                const encryptedToken = pbkdf2Sync(token, String(user.number), 100, 64, 'sha512');
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
        const payload = { userID: user.number, sub: user.nickname};
        return this.jwtService.sign(payload, {expiresIn: this.config.get("ACCESS_EXPIRE")});
    }
}