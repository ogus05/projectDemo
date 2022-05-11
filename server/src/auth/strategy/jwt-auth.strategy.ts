import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AccessTokenException } from "../exceptions/token.e";

const extractFromCookie = (req, configService: ConfigService) => {
    let accessJWT = null;
    accessJWT = req?.cookies[configService.get("ACCESS_JWT")];
    if(!accessJWT) throw new AccessTokenException();
    return accessJWT;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'accessJWT'){
    constructor(
        private configService: ConfigService,
    ){
        super({
            jwtFromRequest: (req) => extractFromCookie(req, configService),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET_KEY'),      
        },
        )
    }
    async validate(payload: any){
        if(payload.exp * 1000 < Date.now()){
            throw new AccessTokenException();
        }else{
            return {number: payload.userID, nickname: payload.sub}
        }
    }
}