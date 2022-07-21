import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local"){
    constructor(private userService: UserService){
        super({usernameField: 'userID'});
    }
    async validate(userID: string, password: string){
        const user = await this.userService.validateUser(userID, password);
        return {number: user.number, nickname: user.nickname};
    }
}