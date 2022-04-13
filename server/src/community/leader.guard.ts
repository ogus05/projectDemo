import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class LeaderGuard implements CanActivate {
    constructor (
        private readonly userService: UserService,
    ){}
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = await this.userService.getUserByID(req.user.userID, true, false);
        if(req.user.userID === user.community.leaderID){
            req.user = user;
            return true;
        } else{
            return false;
        }
    }

}