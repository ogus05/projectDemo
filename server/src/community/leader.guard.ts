import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";
import { CommunityService } from "./community.service";

@Injectable()
export class LeaderGuard implements CanActivate {
    constructor (
        private readonly userService: UserService,
    ){}
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = await this.userService.getUserByID(req.user.userID, true, false);
        if(user === user.community.leader){
            throw new BadRequestException("권한이 부족합니다.")
        } else{
            req.user = user;
            return true;
        }
    }

}