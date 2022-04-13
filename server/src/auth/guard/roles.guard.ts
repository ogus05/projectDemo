import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/user/user.service";
import { RoleException } from "../exceptions/role.e";
import { UserRole } from "../roles/roles";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
        private userService: UserService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<number>('roles', context.getHandler());
        if(!roles) return true;
        else{
            const userID = context.switchToHttp().getRequest().user.userID;
            const user = await this.userService.getUserByID(userID, false, false);
            if(user.role < roles){
                throw new RoleException(roles);
            } else{
                console.log(22);
                return true;
            }
        }
    }
}