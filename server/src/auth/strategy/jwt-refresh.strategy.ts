import { ConflictException, ForbiddenException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { RefreshTokenException } from "../exceptions/token.e";

const extractFromCookie = (req, configService: ConfigService) => {
    let refreshJWT = null;
    refreshJWT = req?.cookies[configService.get("REFRESH_JWT")];
    //refreshToken이 아예 존재하지 않을 때,
    if(!refreshJWT) throw new RefreshTokenException("로그인 후 이용 가능합니다.");
    return refreshJWT;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,'refreshJWT'){
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
        ){
        super({
            jwtFromRequest: (req) => extractFromCookie(req, configService),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET_KEY'),
            passReqToCallback: true,
        })
    }
    //token 만료 시 guard의 handler에게 err넘김. 만료되지 않았으면 DB의 refreshToken과 일치 여부 확인.
    //1번째
    async validate(req: Request, payload: any){
        const user = {number: payload.number, nickname: payload.sub};
        if(!(await this.authService.handleRefreshToken().compareToken(user, req?.cookies?.[this.configService.get("REFRESH_JWT")]))){
            throw new RefreshTokenException('다른 사용자가 로그인하였습니다.');
        } else{
            if(payload.exp * 1000 < Date.now()){
                throw new RefreshTokenException('로그인 후 이용 가능합니다.');
            }
            return user;
        }
    }
}