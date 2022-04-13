import { HttpException, HttpStatus } from "@nestjs/common";
import { UserRole } from "../roles/roles";

export class RoleException extends HttpException{
    constructor(role: number = 1){
        super(Object.keys(UserRole).find(key => UserRole[key] === role) + " 권한이 필요합니다.", HttpStatus.UNAUTHORIZED);
    }
}
