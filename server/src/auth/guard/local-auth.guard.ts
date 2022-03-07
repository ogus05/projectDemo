import { BadRequestException, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export class LocalAuthGuard extends AuthGuard('local'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        if(err instanceof HttpException){
            throw err;
        } else if(err){
            console.log(err);
            throw new HttpException("잠시 후 다시 시도해주세요.", 500);
        }
        return user;
    }
}