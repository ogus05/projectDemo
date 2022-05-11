import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class LeaderGuard implements CanActivate {
    constructor (
        private readonly userService: UserService,
    ){}
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = await this.userService.getUserByNumber(req.user.number, true);
        if(req.user.number === user.community.leaderNumber){
            req.user = user;
            return true;
        } else{
            return false;
        }
    }

}