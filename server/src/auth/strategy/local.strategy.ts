import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local"){
    constructor(private authService: AuthService){
        super({usernameField: 'userID'});
    }
    async validate(userID: string, password: string){
        const user = await this.authService.validateUser(userID, password);
        if(!user){
            throw new HttpException('아이디와 비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
        }
        return {userID: user.ID, nickname: user.nickname};
    }
}