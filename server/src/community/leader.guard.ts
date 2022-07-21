import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class LeaderGuard implements CanActivate {
    constructor (
        private readonly userService: UserService,
    ){}
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = await this.userService.getUserCommunityLeader(req.user.number);
        if(req.user.number === user.community.leaderNumber){
            req.user = user;
            return true;
        } else{
            throw new BadRequestException("커뮤니티 리더가 접근 가능한 정보입니다.");
        }
    }

}