import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwtDecode from "jwt-decode";

@Injectable()
export class JWTInterceptor implements NestInterceptor{
    constructor(private config: ConfigService){}
    intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        const token = request.cookies[this.config.get("ACCESS_JWT")];
        if(token){
            request.user = jwtDecode(token);
        }
        return next.handle();
    }
}